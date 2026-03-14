import { create } from 'zustand';

export interface PendingConv {
  conversationId: string;
  senderAvatar: string | null;
  senderName: string;
  count: number;
}

interface MessageState {
  unreadCount: number;
  pendingConvs: PendingConv[];
  setUnreadCount: (n: number) => void;
  increment: () => void;
  reset: () => void;
  addPending: (conv: Omit<PendingConv, 'count'>) => void;
  removePending: (conversationId: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  unreadCount: 0,
  pendingConvs: [],
  setUnreadCount: (n) => set({ unreadCount: n }),
  increment: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  reset: () => set({ unreadCount: 0, pendingConvs: [] }),
  addPending: (conv) =>
    set((s) => {
      const existing = s.pendingConvs.find((c) => c.conversationId === conv.conversationId);
      if (existing) {
        return {
          pendingConvs: s.pendingConvs.map((c) =>
            c.conversationId === conv.conversationId ? { ...c, count: c.count + 1 } : c,
          ),
        };
      }
      return { pendingConvs: [...s.pendingConvs, { ...conv, count: 1 }] };
    }),
  removePending: (cid) =>
    set((s) => ({ pendingConvs: s.pendingConvs.filter((c) => c.conversationId !== cid) })),
}));
