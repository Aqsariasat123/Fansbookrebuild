import { create } from 'zustand';
import type { UserPublicProfile } from '@fansbook/shared';
import { useNotificationStore } from './notificationStore';

interface AuthState {
  user: UserPublicProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserPublicProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('accessToken');
    useNotificationStore.getState().reset();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
