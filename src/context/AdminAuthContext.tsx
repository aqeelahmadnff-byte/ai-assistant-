import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser, ClinicConfig } from '../types';

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeClinicId: string;
  activeClinic: ClinicConfig | null;
  allClinics: { id: string; slug: string; clinicName: string; address: string; phone: string }[];
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchClinic: (clinicId: string) => void;
  refreshClinicData: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'aura_admin_token';
const CLINIC_STORAGE_KEY = 'aura_active_clinic_id';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [activeClinicId, setActiveClinicId] = useState<string>(() => localStorage.getItem(CLINIC_STORAGE_KEY) || 'clinic-sf');
  const [activeClinic, setActiveClinic] = useState<ClinicConfig | null>(null);
  const [allClinics, setAllClinics] = useState<{ id: string; slug: string; clinicName: string; address: string; phone: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authenticated fetch wrapper
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(url, { ...options, headers });
  }, [token]);

  // Load clinic list
  const loadClinicsList = useCallback(async () => {
    try {
      const res = await fetch('/api/clinics');
      if (res.ok) {
        const list = await res.json();
        setAllClinics(list);
      }
    } catch (e) {
      console.warn('Could not load clinics list:', e);
    }
  }, []);

  // Load active clinic configuration
  const refreshClinicData = useCallback(async () => {
    try {
      const res = await fetch(`/api/clinic/config?clinicId=${activeClinicId}`);
      if (res.ok) {
        const config = await res.json();
        setActiveClinic(config);
      }
    } catch (e) {
      console.warn('Could not refresh clinic config:', e);
    }
  }, [activeClinicId]);

  // Check existing session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await loadClinicsList();

      if (token) {
        try {
          const res = await fetch('/api/admin/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            if (data.user.clinicId && data.user.role !== 'super_admin') {
              setActiveClinicId(data.user.clinicId);
              localStorage.setItem(CLINIC_STORAGE_KEY, data.user.clinicId);
            }
          } else {
            // Invalid token
            setToken(null);
            setUser(null);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        } catch (_err) {
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token, loadClinicsList]);

  // Load clinic config on active clinic change
  useEffect(() => {
    refreshClinicData();
  }, [activeClinicId, refreshClinicData]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

        const targetClinic = data.user.clinicId || activeClinicId;
        setActiveClinicId(targetClinic);
        localStorage.setItem(CLINIC_STORAGE_KEY, targetClinic);

        await refreshClinicData();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await authFetch('/api/admin/auth/logout', { method: 'POST' });
      } catch (_e) {}
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const switchClinic = (clinicId: string) => {
    if (user?.role !== 'super_admin' && user?.clinicId && user.clinicId !== clinicId) {
      console.warn('Unauthorized clinic switch attempt');
      return;
    }
    setActiveClinicId(clinicId);
    localStorage.setItem(CLINIC_STORAGE_KEY, clinicId);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        activeClinicId,
        activeClinic,
        allClinics,
        login,
        logout,
        switchClinic,
        refreshClinicData,
        authFetch
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
