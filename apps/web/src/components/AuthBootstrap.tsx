import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getMeApi } from '../lib/auth';
import { useSocket } from '../hooks/useSocket';
import { useImpersonation, ImpersonationBanner } from '../hooks/useImpersonation';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  useSocket();
  useImpersonation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return;
    }
    getMeApi()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [setUser]);

  return (
    <>
      <ImpersonationBanner />
      {children}
    </>
  );
}
