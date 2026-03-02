import { useEffect } from 'react';

export function useImpersonation() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const impersonateToken = params.get('impersonate');
    const impersonateUser = params.get('user');
    if (impersonateToken) {
      localStorage.setItem('accessToken', impersonateToken);
      if (impersonateUser) sessionStorage.setItem('impersonating', impersonateUser);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return sessionStorage.getItem('impersonating');
}

export function ImpersonationBanner() {
  const impersonating = sessionStorage.getItem('impersonating');
  if (!impersonating) return null;

  return (
    <div className="sticky top-0 z-[100] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-4 py-2 text-center text-sm font-medium text-white">
      Impersonating: @{impersonating}
      <button
        onClick={() => {
          sessionStorage.removeItem('impersonating');
          localStorage.removeItem('accessToken');
          window.close();
        }}
        className="ml-4 rounded bg-white/20 px-3 py-0.5 text-xs hover:bg-white/30"
      >
        Exit
      </button>
    </div>
  );
}
