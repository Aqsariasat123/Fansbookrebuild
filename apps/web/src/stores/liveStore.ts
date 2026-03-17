import { create } from 'zustand';
import type { LiveChatMessage } from '@fansbook/shared';

export interface PrivateIncoming {
  sessionId: string;
  userId: string;
  userName: string;
  tokens: number;
}

interface LiveState {
  sessionId: string | null;
  isLive: boolean;
  viewerCount: number;
  chatMessages: LiveChatMessage[];
  privateIncoming: PrivateIncoming | null;
  creatorOnPrivateCall: boolean;

  setSession: (id: string | null) => void;
  setIsLive: (live: boolean) => void;
  setViewerCount: (count: number) => void;
  addChat: (msg: LiveChatMessage) => void;
  clearChat: () => void;
  setPrivateIncoming: (req: PrivateIncoming | null) => void;
  setCreatorOnPrivateCall: (v: boolean) => void;
  reset: () => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  sessionId: null,
  isLive: false,
  viewerCount: 0,
  chatMessages: [],
  privateIncoming: null,
  creatorOnPrivateCall: false,

  setSession: (id) => set({ sessionId: id }),
  setIsLive: (live) => set({ isLive: live }),
  setViewerCount: (count) => set({ viewerCount: count }),
  addChat: (msg) =>
    set((s) => ({
      chatMessages: [...s.chatMessages.slice(-199), msg],
    })),
  clearChat: () => set({ chatMessages: [] }),
  setPrivateIncoming: (req) => set({ privateIncoming: req }),
  setCreatorOnPrivateCall: (v) => set({ creatorOnPrivateCall: v }),
  reset: () =>
    set({
      sessionId: null,
      isLive: false,
      viewerCount: 0,
      chatMessages: [],
      privateIncoming: null,
      creatorOnPrivateCall: false,
    }),
}));
