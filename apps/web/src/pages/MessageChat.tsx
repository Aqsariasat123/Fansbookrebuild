import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { OtherBubble, SelfBubble, TypingDots } from '../components/chat/ChatBubbles';
import { MessagePageHeader, ChatUserHeader } from '../components/chat/ChatHeader';
import { ChatOverlays } from '../components/chat/ImagePreview';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { useChat } from '../hooks/useChat';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useCall } from '../hooks/useCall';
import type { ChatMessage } from '../components/chat/ChatBubbles';
import type { CallMode } from '../stores/callStore';

function buildCallProps(id: string | undefined, fn: (id: string, m: CallMode) => void) {
  if (!id) return {};
  return { onAudioCall: () => fn(id, 'audio'), onVideoCall: () => fn(id, 'video') };
}

export default function MessageChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [other, setOther] = useState<{
    id: string;
    displayName: string;
    avatar: string | null;
  } | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { incomingMessages, typingUsers, emitTyping, markRead, clearIncoming } =
    useChat(conversationId);
  const otherOnline = useOnlineStatus(other?.id);
  const { startCall } = useCall();
  const callProps = buildCallProps(other?.id, startCall);

  useEffect(() => {
    if (!conversationId) return;
    api
      .get(`/messages/${conversationId}`)
      .then(({ data: res }) => {
        if (res.success) {
          setMessages(res.data.messages);
          setOther(res.data.other);
          setHasMore(res.data.hasMore ?? false);
          setNextCursor(res.data.nextCursor ?? null);
        }
      })
      .catch(() => navigate('/messages'))
      .finally(() => setLoading(false));
    api.put(`/messages/${conversationId}/read`).catch(() => {});
    markRead();
    return () => clearIncoming();
  }, [conversationId, navigate, markRead, clearIncoming]);

  useEffect(() => {
    if (incomingMessages.length === 0) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const newOnes = incomingMessages.filter((m) => !ids.has(m.id));
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
    });
    markRead();
  }, [incomingMessages, markRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend() {
    const text = newMsg.trim();
    if (!text || !conversationId || sending) return;
    setSending(true);
    try {
      const { data: res } = await api.post(`/messages/${conversationId}`, { text });
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMsg('');
      }
    } catch {
      /* */
    } finally {
      setSending(false);
    }
  }

  async function handleImageSend(file: File, caption: string) {
    if (!conversationId) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      if (caption.trim()) fd.append('caption', caption.trim());
      const { data: res } = await api.post(`/messages/${conversationId}/image`, fd);
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setPreviewFile(null);
      }
    } catch {
      /* */
    } finally {
      setSending(false);
    }
  }

  async function handleLoadOlder() {
    if (!conversationId || !nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const { data: res } = await api.get(`/messages/${conversationId}?cursor=${nextCursor}`);
      if (res.success) {
        setMessages((prev) => [...res.data.messages, ...prev]);
        setHasMore(res.data.hasMore ?? false);
        setNextCursor(res.data.nextCursor ?? null);
      }
    } catch {
      /* */
    } finally {
      setLoadingOlder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-[60px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[11px] md:rounded-[22px] flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-130px)]">
      <MessagePageHeader />
      <div className="flex flex-col flex-1 border border-muted rounded-[8px] mx-[10px] mb-[10px] md:mx-[22px] md:mb-[22px] overflow-hidden">
        <ChatUserHeader
          otherName={other?.displayName}
          otherAvatar={other?.avatar}
          otherId={other?.id}
          onBack={() => navigate('/messages')}
          isOnline={otherOnline}
          {...callProps}
        />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-[12px] md:gap-[20px] p-[10px] md:p-[17px]"
        >
          {hasMore && (
            <button
              onClick={handleLoadOlder}
              disabled={loadingOlder}
              className="self-center rounded-[50px] bg-muted px-[16px] py-[6px] text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {loadingOlder ? 'Loading...' : 'Load older messages'}
            </button>
          )}
          {messages.map((msg) =>
            msg.senderId === userId ? (
              <SelfBubble
                key={msg.id}
                msg={msg}
                onDelete={(id) => setMessages((p) => p.filter((m) => m.id !== id))}
                onViewImage={setViewImage}
              />
            ) : (
              <OtherBubble
                key={msg.id}
                msg={msg}
                onDelete={(id) => setMessages((p) => p.filter((m) => m.id !== id))}
                onViewImage={setViewImage}
              />
            ),
          )}
          {typingUsers.size > 0 && <TypingDots />}
        </div>
        <ChatInputBar
          value={newMsg}
          onChange={(v) => {
            setNewMsg(v);
            emitTyping(v.length > 0);
          }}
          onSend={handleSend}
          onFileSelect={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreviewFile(f);
            e.target.value = '';
          }}
          sending={sending}
        />
      </div>
      <ChatOverlays
        previewFile={previewFile}
        onSendImage={handleImageSend}
        onClosePreview={() => setPreviewFile(null)}
        sending={sending}
        viewImage={viewImage}
        onCloseViewer={() => setViewImage(null)}
      />
    </div>
  );
}
