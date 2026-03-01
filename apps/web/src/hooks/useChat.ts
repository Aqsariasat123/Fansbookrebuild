import { useEffect, useState, useCallback, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { playSound } from '../lib/sounds';
import { useAuthStore } from '../stores/authStore';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  mediaUrl: string | null;
  mediaType: string;
  readAt: string | null;
  createdAt: string;
  sender: { id: string; username: string; displayName: string; avatar: string | null };
}

interface TypingState {
  userId: string;
  isTyping: boolean;
}

export function useChat(conversationId: string | undefined) {
  const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const currentUserId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    const handleNewMessage = (msg: Message) => {
      if (msg.conversationId === conversationId) {
        setIncomingMessages((prev) => [...prev, msg]);
        if (msg.senderId !== currentUserId) {
          playSound('message');
        }
      }
    };

    const handleTyping = (data: TypingState & { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          if (data.isTyping) {
            next.set(data.userId, true);
          } else {
            next.delete(data.userId);
          }
          return next;
        });
      }
    };

    const handleReadReceipt = (data: { conversationId: string; readBy: string }) => {
      if (data.conversationId === conversationId) {
        setIncomingMessages((prev) =>
          prev.map((m) => (m.readAt ? m : { ...m, readAt: new Date().toISOString() })),
        );
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:indicator', handleTyping);
    socket.on('message:read', handleReadReceipt);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:indicator', handleTyping);
      socket.off('message:read', handleReadReceipt);
    };
  }, [conversationId, currentUserId]);

  const sendMessage = useCallback(
    (text: string) => {
      const socket = getSocket();
      if (!socket || !conversationId) return;
      socket.emit('message:send', { conversationId, text });
    },
    [conversationId],
  );

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      const socket = getSocket();
      if (!socket || !conversationId) return;
      if (isTyping) {
        socket.emit('typing:start', { conversationId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing:stop', { conversationId });
        }, 3000);
      } else {
        socket.emit('typing:stop', { conversationId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    },
    [conversationId],
  );

  const markRead = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    socket.emit('message:read', { conversationId });
  }, [conversationId]);

  const clearIncoming = useCallback(() => setIncomingMessages([]), []);

  return {
    incomingMessages,
    typingUsers,
    sendMessage,
    emitTyping,
    markRead,
    clearIncoming,
  };
}
