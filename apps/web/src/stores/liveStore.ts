import { create } from 'zustand';
import type { LiveChatMessage } from '@fansbook/shared';

interface LiveState {
  sessionId: string | null;
  isLive: boolean;
  viewerCount: number;
  chatMessages: LiveChatMessage[];

  setSession: (id: string | null) => void;
  setIsLive: (live: boolean) => void;
  setViewerCount: (count: number) => void;
  addChat: (msg: LiveChatMessage) => void;
  clearChat: () => void;
  reset: () => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  sessionId: null,
  isLive: false,
  viewerCount: 0,
  chatMessages: [],

  setSession: (id) => set({ sessionId: id }),
  setIsLive: (live) => set({ isLive: live }),
  setViewerCount: (count) => set({ viewerCount: count }),
  addChat: (msg) =>
    set((s) => ({
      chatMessages: [...s.chatMessages.slice(-199), msg],
    })),
  clearChat: () => set({ chatMessages: [] }),
  reset: () =>
    set({
      sessionId: null,
      isLive: false,
      viewerCount: 0,
      chatMessages: [],
    }),
}));
