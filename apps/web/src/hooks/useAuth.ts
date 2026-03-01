import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { loginApi, registerApi, logoutApi, validate2FA } from '../lib/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setUser, logout: storeLogout } = useAuthStore();

  const login = useCallback(
    async (emailOrUsername: string, password: string, rememberMe?: boolean) => {
      const res = await loginApi({ emailOrUsername, password, rememberMe });
      if (res.data.requires2FA) {
        navigate('/2fa/verify', { state: { userId: res.data.userId, rememberMe } });
        return { requires2FA: true };
      }
      if (res.data.user) setUser(res.data.user as never);
      navigate('/feed');
      return { requires2FA: false };
    },
    [navigate, setUser],
  );

  const register = useCallback(
    async (payload: {
      displayName: string;
      email: string;
      password: string;
      confirmPassword: string;
      accountType: 'creator' | 'fan';
    }) => {
      const res = await registerApi(payload);
      setUser(res.data.user as never);
      navigate('/verify-email', { state: { userId: res.data.user.id, email: payload.email } });
    },
    [navigate, setUser],
  );

  const verify2FA = useCallback(
    async (userId: string, code?: string, backupCode?: string, rememberMe?: boolean) => {
      const res = await validate2FA({ userId, code, backupCode, rememberMe });
      setUser(res.data.user as never);
      navigate('/feed');
    },
    [navigate, setUser],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    storeLogout();
    navigate('/login');
  }, [navigate, storeLogout]);

  const isCreator = user?.role === 'CREATOR';
  const isAdmin = user?.role === 'ADMIN';
  const isFan = user?.role === 'FAN';

  return {
    user,
    isAuthenticated,
    isLoading,
    isCreator,
    isAdmin,
    isFan,
    login,
    register,
    verify2FA,
    logout,
  };
}
