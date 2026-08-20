import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { AIAssistantSettings } from '../../../types';
import { Bot, Sparkles, Save, CheckCircle2, AlertCircle, MessageSquare, Shield, Sliders } from 'lucide-react';

export const AISettingsTab: React.FC = () => {
  const { activeClinic, activeClinicId, authFetch, refreshClinicData } = useAdminAuth();

  const [aiSettings, setAiSettings] = useState<AIAssistantSettings>({
    assistantName: "Aura",
    welcomeMessage: "Hello and welcome to our clinic! How may I assist your smile today?",
    tone: "professional_warm",
    language: "en",
    clinicInstructions: "",
    greetingPrompt: "",
    afterHoursBehavior: "standard_with_notice",
    humanHandoffBehavior: "transfer_to_inbox",
    canAnswerFaqs: true,
    canRecommendTreatments: true,
    canDiscussPrices: true,
    canCaptureLeads: true,
    canCollectAppointments: true,
    canSendToBooking: true,
    canEscalateToStaff: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activeClinic?.aiSettings) {
      setAiSettings(activeClinic.aiSettings);
    }
  }, [activeClinic]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authFetch('/api/admin/clinic/config', {
        method: 'POST',
        body: JSON.stringify({
          clinicId: activeClinicId,
          updates: { aiSettings }
        })
      });

      if (res.ok) {
        setToastMsg({ type: 'success', text: 'AI Coordinator parameters updated! Changes active in system prompt immediately.' });
        await refreshClinicData();
      } else {
        const err = await res.json();
        setToastMsg({ type: 'error', text: err.error || 'Failed to update AI settings' });
      }
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif">AI Patient Coordinator Configuration</h1>
          <p className="text-sm text-slate-400">
            Control the AI assistant's personality, conversational tone, clinic instructions, and capability permissions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save AI Settings</span>
            </>
          )}
        </button>
      </div>

      {toastMsg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
          toastMsg.type === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border border-rose-800 text-rose-200'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Persona & Identity */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
            <Bot className="h-5 w-5 text-cyan-400" />
            <span>Assistant Identity & Tone</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Assistant Name
              </label>
              <input
                type="text"
                required
                value={aiSettings.assistantName}
                onChange={e => setAiSettings({ ...aiSettings, assistantName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Personality & Tone
              </label>
              <select
                value={aiSettings.tone}
                onChange={e => setAiSettings({ ...aiSettings, tone: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="professional_warm">Professional & Warm (Recommended)</option>
                <option value="luxury_concierge">Luxury Concierge & High-Touch</option>
                <option value="direct_efficient">Direct, Fast & Structured</option>
                <option value="empathetic_clinical">Empathetic Clinical & Gentle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Primary Language
              </label>
              <select
                value={aiSettings.language}
                onChange={e => setAiSettings({ ...aiSettings, language: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish (Español)</option>
                <option value="bilingual">Bilingual (Auto-Detect Language)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Welcome Greeting (Initial Message sent to Patient)
            </label>
            <textarea
              rows={2}
              value={aiSettings.welcomeMessage}
              onChange={e => setAiSettings({ ...aiSettings, welcomeMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
              Clinic-Specific System Instructions (Directly injected into AI reasoning)
            </label>
            <textarea
              rows={4}
              value={aiSettings.clinicInstructions}
              onChange={e => setAiSettings({ ...aiSettings, clinicInstructions: e.target.value })}
              placeholder="e.g. Always emphasize our complimentary 3D scan for orthodontic inquiries, and mention our 0% APR financing options through CareCredit."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* Capability Toggles */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
            <Sliders className="h-5 w-5 text-emerald-400" />
            <span>AI Assistant Functional Permissions</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canAnswerFaqs}
                onChange={e => setAiSettings({ ...aiSettings, canAnswerFaqs: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Answer Clinic & Practice FAQs</div>
                <div className="text-[11px] text-slate-400">Grounds in Knowledge Base & FAQs</div>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canDiscussPrices}
                onChange={e => setAiSettings({ ...aiSettings, canDiscussPrices: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Quote Verified Starting Prices</div>
                <div className="text-[11px] text-slate-400">If OFF, states price is consultation-dependent</div>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canRecommendTreatments}
                onChange={e => setAiSettings({ ...aiSettings, canRecommendTreatments: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Recommend Clinical Treatments</div>
                <div className="text-[11px] text-slate-400">Suggests relevant procedures for stated goals</div>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canCaptureLeads}
                onChange={e => setAiSettings({ ...aiSettings, canCaptureLeads: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Auto-Capture Patient Leads</div>
                <div className="text-[11px] text-slate-400">Extracts phone, email, and treatment intent</div>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canCollectAppointments}
                onChange={e => setAiSettings({ ...aiSettings, canCollectAppointments: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Collect Consultation Requests</div>
                <div className="text-[11px] text-slate-400">Records patient preferred dates & times</div>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={aiSettings.canEscalateToStaff}
                onChange={e => setAiSettings({ ...aiSettings, canEscalateToStaff: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <div className="text-xs font-semibold text-white">Escalate to Staff (Human Handoff)</div>
                <div className="text-[11px] text-slate-400">Transfers thread to front desk inbox</div>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
