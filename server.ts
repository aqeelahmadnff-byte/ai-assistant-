import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { ClinicConfig, AdminUser, Conversation, ChatMessage } from "./src/types";
import { store } from "./server/store";
import { generateLocalCoordinatorResponse, isClinicOpenNow } from "./src/utils/coordinatorEngine";

dotenv.config();

// Lazy-safe Gemini AI client setup
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }

  const user = store.verifySession(authHeader);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired session" });
  }

  req.user = user;
  next();
}

function requireClinicAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const requestedClinicId = (req.params.clinicId || req.query.clinicId || req.body.clinicId) as string;

  // Super admins have access to all clinics
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Clinic admins & staff must match their clinicId
  if (requestedClinicId && req.user.clinicId && req.user.clinicId !== requestedClinicId) {
    return res.status(403).json({ error: "Forbidden: You do not have permission to access this clinic's data" });
  }

  next();
}

function requireAdminRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'clinic_admin')) {
    return res.status(403).json({ error: "Forbidden: Admin privileges required" });
  }
  next();
}

// Builds dynamic system instruction grounded in the clinic's real database settings
function buildDynamicSystemPrompt(config: ClinicConfig): string {
  const openStatus = isClinicOpenNow(config);
  const ai = config.aiSettings || {
    assistantName: 'Aura',
    tone: 'professional_warm',
    canDiscussPrices: true,
    canRecommendTreatments: true,
    canAnswerFaqs: true,
    canCaptureLeads: true,
    clinicInstructions: ''
  };

  const servicesList = (config.services || [])
    .filter(s => s.isActive !== false)
    .map(s => {
      let priceText = '';
      if (!ai.canDiscussPrices || !s.aiCanMentionPrice) {
        priceText = 'Price: Price depends on in-person clinical consultation (DO NOT state fixed numerical price)';
      } else if (s.priceRange) {
        priceText = `Price: Starting at ${s.startingPrice} (${s.priceRange})`;
      } else {
        priceText = `Price: Starting at ${s.startingPrice}`;
      }
      return `- **${s.name}** (${s.category}): ${priceText} | Duration: ${s.duration} | Summary: ${s.summary}${s.notes ? ` | Note: ${s.notes}` : ''}`;
    })
    .join('\n');

  const kbList = (config.kbArticles || [])
    .filter(k => k.isActive !== false)
    .map(k => `### ${k.title} [${k.category}]:\n${k.content}`)
    .join('\n\n');

  const doctorsList = (config.specialists || [])
    .filter(d => d.isActive !== false)
    .map(d => `- **${d.name}** (${d.title}): ${d.specialty} (${d.experience})`)
    .join('\n');

  const insurances = (config.insuranceAccepted || []).join(', ');
  const payments = (config.acceptedPayments || []).join(', ');
  const financing = (config.financingOptions || []).join('; ');

  return `You are "${ai.assistantName || 'Aura'}", the authoritative and empathetic AI Patient Coordinator for **${config.clinicName}**.

### CLINIC PROFILE & CONTACT:
- Clinic Name: ${config.clinicName}
- Tagline: ${config.tagline || ''}
- Address: ${config.address}, ${config.cityStateZip}
- Main Office Phone: ${config.phone}
- 24/7 Emergency Line: ${config.emergencyPhone}
- Email: ${config.email}
- Website: ${config.website || ''}
- Doctors / Providers:
${doctorsList || 'Our lead licensed aesthetic and restorative dentists'}

### REAL-TIME OPERATING STATUS:
- Current Status: ${openStatus.isOpen ? 'OPEN NOW' : 'CURRENTLY CLOSED / AFTER HOURS'} (${openStatus.reason})
- After-Hours Message: "${config.businessHours?.afterHoursMessage || 'Our front desk is currently closed, but our AI coordinator is active 24/7.'}"

### VERIFIED SERVICES & PRICING (USE EXACT VALUES ONLY — NEVER INVENT PRICES):
${servicesList}

### CLINIC KNOWLEDGE BASE & POLICIES:
${kbList || 'Standard patient policies apply.'}

### INSURANCE, PAYMENT & FINANCING:
- In-Network Insurances: ${insurances}
- Payment Methods: ${payments}
- Financing Options: ${financing}
- Cancellation Policy: ${config.appointmentSettings?.cancellationPolicyText || '24 hours notice required.'}

### CLINIC-SPECIFIC CUSTOM INSTRUCTIONS:
${ai.clinicInstructions || 'Be courteous, concise, professional, and warmly welcoming.'}

### STRICT CLINICAL & LEGAL SAFETY GUARDRAILS (ZERO-TOLERANCE):
1. **NEVER PROVIDE MEDICAL DIAGNOSES**: If a user asks what disease, cancer, tumor, or medical condition they have, or asks for prescription drug dosages, you MUST state that an accurate diagnosis requires an in-person clinical examination by a licensed dentist, and offer to schedule an appointment.
2. **NEVER INVENT PRICES**: Quote only the prices listed above. If a price is variable or not listed, state that the fee is determined during the personalized clinical consultation.
3. **NEVER CLAIM AN APPOINTMENT IS FINALIZED/CONFIRMED**: Unless verified through the official booking portal, inform the patient that their request has been recorded and our front desk coordinator will confirm their operatory time.
4. **EMERGENCY ESCALATION**: For severe trauma, knocked-out teeth, uncontrolled bleeding, or acute swelling, provide immediate first-aid instructions, highlight our emergency phone (${config.emergencyPhone}), and advise them to seek emergency medical care if breathing/swallowing is impaired.
5. **HUMAN HANDOFF**: If the user explicitly asks for a human, staff, or asks something outside your verified clinic data, politely state that you are alerting the front desk team, provide the office phone (${config.phone}), and invite them to leave their contact details.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ==========================================
  // AUTHENTICATION & SESSION ENDPOINTS
  // ==========================================
  app.post("/api/admin/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const authResult = store.authenticate(email, password);
    if (!authResult) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      success: true,
      token: authResult.token,
      user: authResult.user
    });
  });

  app.post("/api/admin/auth/logout", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const token = req.headers.authorization || '';
    store.logout(token);
    res.json({ success: true, message: "Logged out successfully" });
  });

  app.get("/api/admin/auth/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // ==========================================
  // CLINIC CONFIG & MULTI-CLINIC ENDPOINTS
  // ==========================================
  app.get("/api/clinics", (_req: Request, res: Response) => {
    const clinics = store.getClinics().map(c => ({
      id: c.id,
      slug: c.slug,
      clinicName: c.clinicName,
      address: c.address,
      cityStateZip: c.cityStateZip,
      phone: c.phone,
      logo: c.logo
    }));
    res.json(clinics);
  });

  app.get("/api/clinic/config", (req: Request, res: Response) => {
    const clinicId = (req.query.clinicId as string) || 'clinic-sf';
    const config = store.getClinic(clinicId);
    res.json(config);
  });

  app.get("/api/clinic-config", (req: Request, res: Response) => {
    const clinicId = (req.query.clinicId as string) || 'clinic-sf';
    const config = store.getClinic(clinicId);
    res.json({ success: true, config, ...config });
  });

  const handleSaveClinicConfig = (req: Request, res: Response) => {
    const body = req.body || {};
    const clinicId = body.id || body.clinicId || (req.query.clinicId as string) || 'clinic-sf';
    const updates = body.updates || body.config || body;
    const user: AdminUser = (req as AuthenticatedRequest).user || {
      id: 'usr-coordinator',
      email: 'coordinator@clinic.local',
      fullName: 'Clinic Admin',
      role: 'clinic_admin',
      clinicId,
      createdAt: new Date().toISOString()
    };
    const updated = store.updateClinic(clinicId, updates, user);
    res.json({ success: true, config: updated });
  };

  app.post("/api/clinic-config", handleSaveClinicConfig);
  app.post("/api/admin/clinic/config", requireAuth, requireClinicAccess, requireAdminRole, handleSaveClinicConfig);

  app.post("/api/admin/clinics", requireAuth, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const clinicData = req.body.clinic || req.body;
    if (!clinicData || !clinicData.clinicName) {
      return res.status(400).json({ error: "Clinic name is required" });
    }
    const created = store.createClinic(clinicData, req.user!);
    res.json(created);
  });

  // ==========================================
  // SERVICES CRUD
  // ==========================================
  app.post("/api/admin/services", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const { clinicId, service } = req.body;
    if (!clinicId || !service || !service.name || !service.startingPrice) {
      return res.status(400).json({ error: "clinicId and complete service object are required" });
    }

    if (!service.id) {
      service.id = `serv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const saved = store.saveService(clinicId, service, req.user!);
    res.json({ success: true, service: saved });
  });

  app.put("/api/admin/services/:id", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const serviceId = req.params.id;
    const { clinicId, service } = req.body;
    if (!clinicId || !service) {
      return res.status(400).json({ error: "clinicId and service object are required" });
    }

    service.id = serviceId;
    const saved = store.saveService(clinicId, service, req.user!);
    res.json({ success: true, service: saved });
  });

  app.delete("/api/admin/services/:id", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const serviceId = req.params.id;
    const clinicId = (req.query.clinicId || req.body.clinicId) as string;
    if (!clinicId) {
      return res.status(400).json({ error: "clinicId is required" });
    }

    const deleted = store.deleteService(clinicId, serviceId, req.user!);
    res.json({ success: deleted });
  });

  app.post("/api/admin/services/reorder", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const { clinicId, serviceIds } = req.body;
    if (!clinicId || !Array.isArray(serviceIds)) {
      return res.status(400).json({ error: "clinicId and serviceIds array are required" });
    }

    const reordered = store.reorderServices(clinicId, serviceIds, req.user!);
    res.json({ success: true, services: reordered });
  });

  // ==========================================
  // KNOWLEDGE BASE CRUD
  // ==========================================
  app.post("/api/admin/kb", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const { clinicId, article } = req.body;
    if (!clinicId || !article || !article.title || !article.content) {
      return res.status(400).json({ error: "clinicId, article title, and content are required" });
    }

    if (!article.id) {
      article.id = `kb-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    article.clinicId = clinicId;

    const saved = store.saveKnowledgeArticle(clinicId, article, req.user!);
    res.json({ success: true, article: saved });
  });

  app.put("/api/admin/kb/:id", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const articleId = req.params.id;
    const { clinicId, article } = req.body;
    if (!clinicId || !article) {
      return res.status(400).json({ error: "clinicId and article are required" });
    }

    article.id = articleId;
    article.clinicId = clinicId;
    const saved = store.saveKnowledgeArticle(clinicId, article, req.user!);
    res.json({ success: true, article: saved });
  });

  app.delete("/api/admin/kb/:id", requireAuth, requireClinicAccess, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const articleId = req.params.id;
    const clinicId = (req.query.clinicId || req.body.clinicId) as string;
    if (!clinicId) {
      return res.status(400).json({ error: "clinicId is required" });
    }

    const deleted = store.deleteKnowledgeArticle(clinicId, articleId, req.user!);
    res.json({ success: deleted });
  });

  // ==========================================
  // LEADS ENDPOINTS
  // ==========================================
  app.get("/api/admin/leads", requireAuth, requireClinicAccess, (req: AuthenticatedRequest, res: Response) => {
    const clinicId = req.query.clinicId as string;
    const leads = store.getLeads(clinicId);
    res.json(leads);
  });

  app.post("/api/leads", (req: Request, res: Response) => {
    const { clinicId, name, phone, email, serviceName, preferredTime, message, source, estimatedValue } = req.body;
    if (!name || (!phone && !email)) {
      return res.status(400).json({ error: "Name and at least one contact method (phone/email) are required" });
    }

    const newLead = store.addLead({
      clinicId: clinicId || 'clinic-sf',
      name,
      phone: phone || '',
      email: email || '',
      serviceName: serviceName || 'General Consultation',
      preferredTime: preferredTime || 'Flexible',
      message: message || '',
      source: source || 'chat',
      status: 'new',
      estimatedValue: estimatedValue || 500
    });

    res.json({ success: true, lead: newLead });
  });

  app.post("/api/admin/leads", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const body = req.body.lead || req.body.updates || req.body;
    const newLead = store.addLead({
      clinicId: body.clinicId || (req.query.clinicId as string) || 'clinic-sf',
      name: body.name || 'New Patient Lead',
      phone: body.phone || '',
      email: body.email || '',
      serviceName: body.serviceName || 'General Consultation',
      preferredTime: body.preferredTime || 'Flexible',
      message: body.message || '',
      source: body.source || 'admin_manual',
      status: body.status || 'new',
      estimatedValue: body.estimatedValue || 500
    });

    res.json({ success: true, lead: newLead });
  });

  const handleUpdateLead = (req: AuthenticatedRequest, res: Response) => {
    const leadId = req.params.id;
    const updates = req.body.updates || req.body.lead || req.body;
    const updated = store.updateLead(leadId, updates, req.user!);
    if (!updated) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ success: true, lead: updated });
  };

  app.put("/api/admin/leads/:id", requireAuth, handleUpdateLead);
  app.patch("/api/admin/leads/:id", requireAuth, handleUpdateLead);

  app.delete("/api/admin/leads/:id", requireAuth, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
    const leadId = req.params.id;
    const deleted = store.deleteLead(leadId, req.user!);
    res.json({ success: deleted });
  });

  // ==========================================
  // CONVERSATIONS & INBOX ENDPOINTS
  // ==========================================
  app.get("/api/admin/conversations", requireAuth, requireClinicAccess, (req: AuthenticatedRequest, res: Response) => {
    const clinicId = req.query.clinicId as string;
    const convs = store.getConversations(clinicId);
    res.json(convs);
  });

  const handleStaffReplyRoute = (req: AuthenticatedRequest, res: Response) => {
    const convId = req.params.id;
    const replyText = req.body.replyText || req.body.text || req.body.message;
    if (!replyText) {
      return res.status(400).json({ error: "replyText is required" });
    }

    const staffUser = req.user || {
      id: 'usr-staff',
      email: 'staff@clinic.local',
      fullName: req.body.senderName || 'Staff Specialist',
      role: 'staff',
      createdAt: new Date().toISOString()
    };

    const updated = store.addStaffReply(convId, replyText, staffUser);
    if (!updated) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true, conversation: updated });
  };

  app.post("/api/admin/conversations/:id/reply", requireAuth, handleStaffReplyRoute);
  app.post("/api/admin/conversations/:id/message", requireAuth, handleStaffReplyRoute);

  const handleUpdateConversation = (req: AuthenticatedRequest, res: Response) => {
    const convId = req.params.id;
    const updates = req.body.updates || req.body;
    if (updates.status) {
      const updated = store.updateConversationStatus(convId, updates.status, req.user!);
      if (!updated) return res.status(404).json({ error: "Conversation not found" });
      return res.json({ success: true, conversation: updated });
    }
    const updated = store.updateConversation(convId, updates, req.user);
    if (!updated) return res.status(404).json({ error: "Conversation not found" });
    res.json({ success: true, conversation: updated });
  };

  app.put("/api/admin/conversations/:id", requireAuth, handleUpdateConversation);
  app.patch("/api/admin/conversations/:id", requireAuth, handleUpdateConversation);

  app.put("/api/admin/conversations/:id/status", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const convId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const updated = store.updateConversationStatus(convId, status, req.user!);
    if (!updated) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true, conversation: updated });
  });

  // ==========================================
  // APPOINTMENTS ENDPOINTS
  // ==========================================
  app.get("/api/appointments", (req: Request, res: Response) => {
    const clinicId = req.query.clinicId as string;
    const appointments = store.getAppointments(clinicId);
    res.json({ success: true, appointments });
  });

  app.post("/api/appointments", (req: Request, res: Response) => {
    const { clinicId, fullName, contact, preferredDate, preferredTime, treatment, doctorAssigned, notes, source } = req.body;
    if (!fullName || !contact || !preferredDate || !treatment) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const newApt = store.addAppointment({
      clinicId: clinicId || 'clinic-sf',
      fullName,
      contact,
      preferredDate,
      preferredTime: preferredTime || 'Flexible',
      treatment,
      doctorAssigned: doctorAssigned || 'Lead Specialist',
      notes: notes || '',
      status: 'pending',
      source: source || 'booking_form'
    });

    // Also create/update a Lead record for the patient coordinator
    store.addLead({
      clinicId: clinicId || 'clinic-sf',
      name: fullName,
      phone: contact.includes('@') ? '' : contact,
      email: contact.includes('@') ? contact : '',
      serviceName: treatment,
      preferredTime: `${preferredDate} at ${preferredTime || 'Morning'}`,
      message: `Appointment request: ${treatment} (${notes || 'No extra notes'})`,
      source: source || 'booking_form',
      status: 'appointment_requested',
      estimatedValue: 400
    });

    res.json({ success: true, appointment: newApt });
  });

  const handleUpdateAppointment = (req: Request, res: Response) => {
    const aptId = req.params.id;
    const updates = req.body.updates || req.body;
    const user = (req as AuthenticatedRequest).user;
    const updated = store.updateAppointment(aptId, updates, user);
    if (!updated) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ success: true, appointment: updated });
  };

  app.patch("/api/appointments/:id", handleUpdateAppointment);
  app.put("/api/appointments/:id", handleUpdateAppointment);
  app.put("/api/admin/appointments/:id", requireAuth, handleUpdateAppointment);
  app.patch("/api/admin/appointments/:id", requireAuth, handleUpdateAppointment);

  const handleDeleteAppointment = (req: Request, res: Response) => {
    const aptId = req.params.id;
    const user = (req as AuthenticatedRequest).user;
    const deleted = store.deleteAppointment(aptId, user);
    res.json({ success: deleted });
  };

  app.delete("/api/appointments/:id", handleDeleteAppointment);
  app.delete("/api/admin/appointments/:id", requireAuth, handleDeleteAppointment);

  // ==========================================
  // ANALYTICS & AUDIT LOGS
  // ==========================================
  app.get("/api/admin/analytics", requireAuth, requireClinicAccess, (req: AuthenticatedRequest, res: Response) => {
    const clinicId = req.query.clinicId as string;
    const analytics = store.getAnalytics(clinicId);
    res.json(analytics);
  });

  app.get("/api/admin/audit-logs", requireAuth, requireClinicAccess, (req: AuthenticatedRequest, res: Response) => {
    const clinicId = req.query.clinicId as string;
    const logs = store.getAuditLogs(clinicId);
    res.json(logs);
  });

  // ==========================================
  // PATIENT AI CHAT ENDPOINT
  // ==========================================
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history = [], clinicId, sessionId = `sess-${Date.now()}` } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const activeConfig = req.body.clinicConfigOverride || store.getClinic(clinicId);
      const isAfterHours = !isClinicOpenNow(activeConfig).isOpen;
      const ai = getAIClient();

      let textOutput = "";
      let suggestions: string[] = [];
      let bookingPrompt = false;
      let emergencyNotice = false;
      let serviceMentioned: string | undefined;

      if (ai) {
        try {
          const systemPrompt = buildDynamicSystemPrompt(activeConfig);
          const contents = history.map((h: { role: string; text: string }) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }]
          }));

          contents.push({
            role: "user",
            parts: [{ text: message }]
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini request timeout")), 8500)
          );

          const geminiPromise = ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.35,
            }
          });

          const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);
          textOutput = geminiResponse.text || `Welcome to **${activeConfig.clinicName}**. How may I assist you with your dental care today?`;

          const lowerMsg = message.toLowerCase();
          if (lowerMsg.includes('whitening')) {
            suggestions = ["Book Teeth Whitening", "Invisalign pricing", "Clinic hours & address"];
            serviceMentioned = "Teeth Whitening";
          } else if (lowerMsg.includes('invisalign') || lowerMsg.includes('aligner')) {
            suggestions = ["Book complimentary 3D scan", "0% APR Payment Plans", "Teeth Whitening cost"];
            serviceMentioned = "Invisalign® Clear Aligners";
          } else if (lowerMsg.includes('implant')) {
            suggestions = ["Book Implant Assessment", "Implant vs Bridge", "Accepted Insurances"];
            serviceMentioned = "Dental Implants";
          } else if (lowerMsg.includes('emergency') || lowerMsg.includes('pain') || lowerMsg.includes('broken')) {
            suggestions = ["Book urgent emergency slot", "Call Emergency Hotline", "View clinic address"];
            emergencyNotice = true;
            serviceMentioned = "Emergency Dental Care";
          } else {
            suggestions = ["Teeth Whitening prices", "Invisalign free 3D scan", "Book consultation", "Accepted Insurances"];
          }

          bookingPrompt = lowerMsg.includes('book') || lowerMsg.includes('appointment') || lowerMsg.includes('schedule') || lowerMsg.includes('consult');
        } catch (_geminiErr) {
          const localResult = generateLocalCoordinatorResponse(message, activeConfig);
          textOutput = localResult.text;
          suggestions = localResult.suggestions;
          bookingPrompt = !!localResult.bookingActionPrompt;
          emergencyNotice = !!localResult.emergencyNotice;
          serviceMentioned = localResult.serviceMentioned;
        }
      } else {
        const localResult = generateLocalCoordinatorResponse(message, activeConfig);
        textOutput = localResult.text;
        suggestions = localResult.suggestions;
        bookingPrompt = !!localResult.bookingActionPrompt;
        emergencyNotice = !!localResult.emergencyNotice;
        serviceMentioned = localResult.serviceMentioned;
      }

      // Persist Conversation state & Auto-capture Leads
      const existingConv = store.getConversationBySession(sessionId, activeConfig.id);
      const userMsgObj: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsgObj: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: textOutput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
        bookingActionPrompt: bookingPrompt,
        emergencyNotice,
        serviceMentioned
      };

      const messagesList = existingConv ? [...existingConv.messages, userMsgObj, assistantMsgObj] : [userMsgObj, assistantMsgObj];

      // Detect if user provided contact/name info in chat
      const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = message.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      
      let capturedLeadId = existingConv?.leadId;
      if (emailMatch || phoneMatch) {
        const lead = store.addLead({
          clinicId: activeConfig.id,
          name: existingConv?.patientName || 'Web Visitor',
          phone: phoneMatch ? phoneMatch[0] : '',
          email: emailMatch ? emailMatch[0] : '',
          serviceName: serviceMentioned || 'General Inquiry',
          preferredTime: 'Pending confirmation',
          message: `Captured via chat: "${message}"`,
          source: emergencyNotice ? 'emergency_triage' : 'chat',
          status: 'new',
          estimatedValue: 450
        });
        capturedLeadId = lead.id;
      }

      const updatedConv: Conversation = {
        id: existingConv?.id || `conv-${Date.now()}`,
        clinicId: activeConfig.id,
        sessionId,
        patientName: existingConv?.patientName || (emailMatch ? emailMatch[0].split('@')[0] : 'Web Visitor'),
        patientContact: phoneMatch ? phoneMatch[0] : (emailMatch ? emailMatch[0] : undefined),
        messages: messagesList,
        status: existingConv?.status || (emergencyNotice ? 'active' : 'active'),
        leadId: capturedLeadId,
        serviceMentioned: serviceMentioned || existingConv?.serviceMentioned,
        priority: emergencyNotice ? 'emergency' : (bookingPrompt ? 'urgent' : 'normal'),
        isAfterHours,
        createdAt: existingConv?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.saveConversation(updatedConv);

      res.json({
        text: textOutput,
        suggestions,
        bookingActionPrompt: bookingPrompt,
        emergencyNotice,
        serviceMentioned,
        conversationId: updatedConv.id
      });
    } catch (err: any) {
      console.error("Chat route error:", err);
      const fallback = generateLocalCoordinatorResponse(req.body?.message || "", store.getClinic());
      res.json({
        text: fallback.text,
        suggestions: fallback.suggestions,
        bookingActionPrompt: fallback.bookingActionPrompt
      });
    }
  });

  // Vite middleware for development vs production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinic Coordinator & Admin Platform running on http://localhost:${PORT}`);
  });
}

startServer();
