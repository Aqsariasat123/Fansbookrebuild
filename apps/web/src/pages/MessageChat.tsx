import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { OtherBubble, SelfBubble } from '../components/chat/ChatBubbles';
import { MessagePageHeader, ChatUserHeader } from '../components/chat/ChatHeader';
import { ImagePreview, ImageViewer } from '../components/chat/ImagePreview';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { useChat } from '../hooks/useChat';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import type { ChatMessage } from '../components/chat/ChatBubbles';

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
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { incomingMessages, typingUsers, emitTyping, markRead, clearIncoming } =
    useChat(conversationId);
  const otherOnline = useOnlineStatus(other?.id);

  useEffect(() => {
    if (!conversationId) return;
    api
      .get(`/messages/${conversationId}`)
      .then(({ data: res }) => {
        if (res.success) {
          setMessages(res.data.messages);
          setOther(res.data.other);
        }
      })
      .catch(() => navigate('/messages'))
      .finally(() => setLoading(false));
    api.put(`/messages/${conversationId}/read`).catch(() => {});
    markRead();
    return () => clearIncoming();
  }, [conversationId, navigate, markRead, clearIncoming]);

  // Merge incoming real-time messages
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
      const formData = new FormData();
      formData.append('image', file);
      if (caption.trim()) formData.append('caption', caption.trim());
      const { data: res } = await api.post(`/messages/${conversationId}/image`, formData);
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreviewFile(file);
    e.target.value = '';
  }

  function handleDelete(msgId: string) {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
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
          onBack={() => navigate('/messages')}
          isOnline={otherOnline}
        />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-[12px] md:gap-[20px] p-[10px] md:p-[17px]"
        >
          {messages.map((msg) =>
            msg.senderId === userId ? (
              <SelfBubble
                key={msg.id}
                msg={msg}
                onDelete={handleDelete}
                onViewImage={setViewImage}
              />
            ) : (
              <OtherBubble
                key={msg.id}
                msg={msg}
                onDelete={handleDelete}
                onViewImage={setViewImage}
              />
            ),
          )}
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-[8px] px-[10px] py-[4px]">
              <div className="flex gap-[3px]">
                <span
                  className="size-[6px] rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="size-[6px] rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="size-[6px] rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span className="text-[12px] text-muted-foreground">typing...</span>
            </div>
          )}
        </div>
        <ChatInputBar
          value={newMsg}
          onChange={(val) => {
            setNewMsg(val);
            emitTyping(val.length > 0);
          }}
          onSend={handleSend}
          onFileSelect={handleFileSelect}
          sending={sending}
        />
      </div>
      {previewFile && (
        <ImagePreview
          file={previewFile}
          onSend={handleImageSend}
          onClose={() => setPreviewFile(null)}
          sending={sending}
        />
      )}
      {viewImage && <ImageViewer url={viewImage} onClose={() => setViewImage(null)} />}
    </div>
  );
}
