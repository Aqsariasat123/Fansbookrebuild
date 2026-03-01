import { create } from 'zustand';

interface SocketState {
  isConnected: boolean;
  onlineUsers: Set<string>;
  setConnected: (connected: boolean) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  setOnlineUsers: (users: string[]) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  onlineUsers: new Set<string>(),
  setConnected: (connected) => set({ isConnected: connected }),
  addOnlineUser: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    }),
  removeOnlineUser: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return { onlineUsers: next };
    }),
  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
}));
