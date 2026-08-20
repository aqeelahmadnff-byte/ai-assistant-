export type AdminRole = 'super_admin' | 'clinic_admin' | 'staff';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  clinicId?: string; // Optional for super_admin who has global access
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}

export interface ClinicService {
  id: string;
  name: string;
  category: 'cosmetic' | 'orthodontics' | 'restorative' | 'emergency' | 'preventive' | 'general';
  price?: string;
  startingPrice: string;
  priceRange?: string;
  duration: string;
  isActive: boolean;
  isBookable: boolean;
  aiCanMentionPrice: boolean;
  aiCanRecommend: boolean;
  notes?: string;
  summary: string;
  keyBenefits: string[];
  candidateFor: string;
  displayOrder: number;
  faqs?: { q: string; a: string }[];
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

export interface BusinessDayHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  dayLabel: string;
  isOpen: boolean;
  openTime: string; // e.g. "08:00"
  closeTime: string; // e.g. "18:00"
  hasBreak: boolean;
  breakStart?: string; // e.g. "13:00"
  breakEnd?: string; // e.g. "14:00"
}

export interface HolidayClosure {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  note?: string;
}

export interface TemporaryClosure {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  specialInstructions?: string;
}

export interface BusinessHoursConfig {
  schedule: BusinessDayHours[];
  holidayClosures: HolidayClosure[];
  temporaryClosures: TemporaryClosure[];
  afterHoursMessage: string;
  lunchBreakSummary?: string;
}

export interface AppointmentTypeOption {
  id: string;
  name: string;
  durationMinutes: number;
  consultationType: 'in_person' | 'telehealth' | 'both';
  serviceCategory?: string;
  assignedDoctorIds: string[];
  depositRequired: boolean;
  depositAmount?: number;
  isActive: boolean;
}

export interface AppointmentSettings {
  appointmentTypes: AppointmentTypeOption[];
  availableDays: string[];
  timeWindows: { start: string; end: string }[];
  minNoticeHours: number;
  cancellationPolicyText: string;
  bookingUrl?: string;
  requireDeposit: boolean;
}

export type AIAssistantTone = 'professional_warm' | 'luxury_concierge' | 'direct_efficient' | 'empathetic_clinical';
export type AIAssistantLanguage = 'en' | 'es' | 'bilingual';

export interface AIAssistantSettings {
  assistantName: string;
  welcomeMessage: string;
  tone: AIAssistantTone;
  language: AIAssistantLanguage;
  clinicInstructions: string;
  greetingPrompt: string;
  afterHoursBehavior: 'auto_reply_and_queue' | 'emergency_only' | 'standard_with_notice';
  humanHandoffBehavior: 'prompt_phone_and_notify' | 'transfer_to_inbox' | 'email_alert';
  canAnswerFaqs: boolean;
  canRecommendTreatments: boolean;
  canDiscussPrices: boolean;
  canCaptureLeads: boolean;
  canCollectAppointments: boolean;
  canSendToBooking: boolean;
  canEscalateToStaff: boolean;
}

export type KBCategory = 
  | 'faqs' 
  | 'treatment_info' 
  | 'insurance' 
  | 'payment_methods' 
  | 'financing' 
  | 'cancellation_refund' 
  | 'parking_location' 
  | 'doctor_credentials' 
  | 'clinic_policies' 
  | 'custom';

export interface KnowledgeBaseArticle {
  id: string;
  clinicId: string;
  category: KBCategory;
  title: string;
  content: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  notificationEmails: string[];
  notifyOnNewLead: boolean;
  notifyOnAppointmentRequest: boolean;
  notifyOnHandoff: boolean;
  notifyOnEmergency: boolean;
  soundAlerts: boolean;
  desktopNotifications: boolean;
  smsAlerts?: boolean;
  smsRecipientPhone?: string;
}

export interface AISafetySettings {
  neverInventPrices: boolean;
  neverInventAvailability: boolean;
  neverClaimConfirmedWithoutRealSync: boolean;
  neverDiagnose: boolean;
  neverGuaranteeMedicalResults: boolean;
  recommendSpecialistNotice: boolean;
  identifyAsAI: boolean;
  emergencyPhoneEscalation: boolean;
  customBannedClaims?: string[];
}

export interface ClinicConfig {
  id: string;
  slug: string;
  clinicName: string;
  tagline?: string;
  logo?: string;
  address: string;
  cityStateZip: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;
  googleMapsUrl?: string;
  about: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  businessHours: BusinessHoursConfig;
  emergencyPolicy: string;
  services: ClinicService[];
  insuranceAccepted: string[];
  acceptedPayments: string[];
  financingOptions: string[];
  specialists: Specialist[];
  appointmentSettings: AppointmentSettings;
  aiSettings: AIAssistantSettings;
  kbArticles: KnowledgeBaseArticle[];
  notificationSettings: NotificationSettings;
  safetySettings: AISafetySettings;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'staff';
  text: string;
  timestamp: string;
  suggestions?: string[];
  bookingActionPrompt?: boolean;
  emergencyNotice?: boolean;
  serviceMentioned?: string;
  isStaffTakeover?: boolean;
  staffName?: string;
  collectedInfo?: {
    name?: string;
    contact?: string;
    preferredDate?: string;
    preferredTime?: string;
    treatment?: string;
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'appointment_requested' | 'booked' | 'closed' | 'lost';

export interface Lead {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email: string;
  serviceId?: string;
  serviceName: string;
  preferredTime?: string;
  message: string;
  source: 'chat' | 'booking_form' | 'emergency_triage' | 'manual';
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedStaff?: string;
  estimatedValue?: number;
}

export type ConversationStatus = 'active' | 'handoff_requested' | 'staff_took_over' | 'resolved' | 'closed';

export interface Conversation {
  id: string;
  clinicId: string;
  sessionId: string;
  patientName?: string;
  patientContact?: string;
  messages: ChatMessage[];
  status: ConversationStatus;
  leadId?: string;
  intent?: string;
  serviceMentioned?: string;
  priority: 'normal' | 'urgent' | 'emergency';
  isAfterHours: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
}

export interface AppointmentBooking {
  id: string;
  clinicId: string;
  fullName: string;
  contact: string; // Phone or Email
  preferredDate: string;
  preferredTime: string;
  treatment: string;
  appointmentTypeId?: string;
  doctorAssigned?: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'rescheduled' | 'cancelled';
  createdAt: string;
  source: 'chat' | 'booking_form' | 'emergency_triage' | 'admin_manual';
}

export interface EmergencyGuide {
  id: string;
  title: string;
  urgency: 'critical' | 'urgent' | 'moderate';
  firstAid: string[];
  warningNote: string;
  suggestedAction: string;
}

export interface AuditLogEntry {
  id: string;
  clinicId?: string;
  clinicName?: string;
  userId: string;
  userEmail: string;
  userRole: AdminRole;
  action: string; // e.g., 'UPDATE_CLINIC_PROFILE', 'CREATE_SERVICE', 'DELETE_KB'
  entityType: 'clinic' | 'service' | 'hours' | 'ai_settings' | 'kb' | 'lead' | 'appointment' | 'conversation' | 'safety';
  entityId?: string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  details?: any;
  timestamp: string;
  ipAddress?: string;
}

export type AuditLog = AuditLogEntry;

export interface DashboardMetrics {
  totalConversations: number;
  newLeads: number;
  appointmentRequests: number;
  conversationsToday: number;
  leadsToday: number;
  afterHoursConversations: number;
  conversionRate: number;
  handoffsCount: number;
  revenuePotential: number;
  treatmentBreakdown: { name: string; count: number; value: number }[];
  dailyTraffic: { date: string; conversations: number; leads: number; bookings: number }[];
  leadStatusCounts: Record<LeadStatus, number>;
}
