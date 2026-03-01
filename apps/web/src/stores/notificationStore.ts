import { create } from 'zustand';

function getSoundDefault(): boolean {
  try {
    return globalThis.localStorage?.getItem('soundEnabled') !== 'false';
  } catch {
    return true;
  }
}

interface NotificationState {
  unreadCount: number;
  soundEnabled: boolean;
  setUnreadCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  toggleSound: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  soundEnabled: getSoundDefault(),
  setUnreadCount: (count) => set({ unreadCount: count }),
  increment: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  decrement: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  reset: () => set({ unreadCount: 0 }),
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      localStorage.setItem('soundEnabled', String(next));
      return { soundEnabled: next };
    }),
}));
