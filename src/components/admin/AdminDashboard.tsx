import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  Clock, 
  CalendarCheck, 
  Bot, 
  BookOpen, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  TrendingUp, 
  Bell, 
  FileText, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  ExternalLink,
  Shield,
  Radio
} from 'lucide-react';

import { DashboardHomeTab } from './tabs/DashboardHomeTab';
import { ClinicProfileTab } from './tabs/ClinicProfileTab';
import { ServicesTab } from './tabs/ServicesTab';
import { BusinessHoursTab } from './tabs/BusinessHoursTab';
import { AppointmentSettingsTab } from './tabs/AppointmentSettingsTab';
import { AISettingsTab } from './tabs/AISettingsTab';
import { KnowledgeBaseTab } from './tabs/KnowledgeBaseTab';
import { LeadsTab } from './tabs/LeadsTab';
import { ConversationInboxTab } from './tabs/ConversationInboxTab';
import { AISafetyTab } from './tabs/AISafetyTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AuditLogTab } from './tabs/AuditLogTab';
import { ClinicsManagerTab } from './tabs/ClinicsManagerTab';

interface AdminDashboardProps {
  onBackToPatientSite: () => void;
  onOpenLiveChatModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPatientSite, onOpenLiveChatModal }) => {
  const { user, logout, activeClinic, activeClinicId, clinics, setActiveClinicId, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Clinic & Doctors', icon: Building2 },
    { id: 'services', label: 'Services & Pricing', icon: Stethoscope },
    { id: 'hours', label: 'Hours & Schedule', icon: Clock },
    { id: 'appointments', label: 'Appointment Rules', icon: CalendarCheck },
    { id: 'ai-settings', label: 'AI Prompt & Tone', icon: Bot },
    { id: 'knowledge-base', label: 'Knowledge & FAQs', icon: BookOpen },
    { id: 'leads', label: 'Patient Leads', icon: Users },
    { id: 'inbox', label: 'Live AI Inbox', icon: MessageSquare },
    { id: 'safety', label: 'Safety & Sandbox', icon: ShieldCheck },
    { id: 'analytics', label: 'Practice Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Alerts & Routing', icon: Bell },
    { id: 'audit-logs', label: 'Audit Trail', icon: FileText },
    { id: 'clinics', label: 'Multi-Clinic Network', icon: Shield }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHomeTab onNavigateTab={(tab) => setActiveTab(tab)} onOpenLiveTest={onOpenLiveChatModal} />;
      case 'profile':
        return <ClinicProfileTab />;
      case 'services':
        return <ServicesTab />;
      case 'hours':
        return <BusinessHoursTab />;
      case 'appointments':
        return <AppointmentSettingsTab />;
      case 'ai-settings':
        return <AISettingsTab />;
      case 'knowledge-base':
        return <KnowledgeBaseTab />;
      case 'leads':
        return <LeadsTab />;
      case 'inbox':
        return <ConversationInboxTab />;
      case 'safety':
        return <AISafetyTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'audit-logs':
        return <AuditLogTab />;
      case 'clinics':
        return <ClinicsManagerTab />;
      default:
        return <DashboardHomeTab onNavigateTab={(tab) => setActiveTab(tab)} onOpenLiveTest={onOpenLiveChatModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <div className="text-sm font-bold text-white font-serif">{activeClinic?.clinicName || 'Aura Clinical'}</div>
            <div className="text-[10px] text-cyan-400">Admin Console</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Clinic Brand & Switcher */}
          <div className="p-4 border-b border-slate-800 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
                <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-white tracking-tight truncate font-serif">
                  Aura Practice Suite
                </h1>
                <p className="text-[10px] text-slate-400">Clinical AI & Admin Hub</p>
              </div>
            </div>

            {/* Clinic Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
                className="w-full p-2.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Current Scope</div>
                  <div className="text-xs font-bold text-cyan-300 truncate">
                    {activeClinic?.clinicName || 'Select Clinic'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              </button>

              {isClinicDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                  {clinics.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveClinicId(c.id);
                        setIsClinicDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        c.id === activeClinicId
                          ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{c.clinicName}</span>
                      {c.id === activeClinicId && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/20 to-emerald-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3 shrink-0">
            <button
              onClick={onBackToPatientSite}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              <span>View Patient Site & AI</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-slate-950">
        {/* Top Desktop Bar */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {activeClinic?.clinicName}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-white capitalize">
              {navigationItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLiveChatModal}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Test Patient AI</span>
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="p-6 lg:p-8 flex-1">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};
