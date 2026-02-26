import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { OtherBubble, SelfBubble } from '../components/chat/ChatBubbles';
import { MessagePageHeader, ChatUserHeader } from '../components/chat/ChatHeader';
import { ImagePreview, ImageViewer } from '../components/chat/ImagePreview';
import type { ChatMessage } from '../components/chat/ChatBubbles';

const EMOJIS = [
  '😊',
  '😂',
  '❤️',
  '👍',
  '🔥',
  '😍',
  '🎉',
  '💯',
  '😎',
  '🙌',
  '💪',
  '🤩',
  '😘',
  '🥰',
  '👏',
  '✨',
];

export default function MessageChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [other, setOther] = useState<{ displayName: string; avatar: string | null } | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
  }, [conversationId, navigate]);

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
    <div className="bg-[#0e1012] rounded-[22px] flex flex-col h-[calc(100vh-130px)]">
      <MessagePageHeader />
      <div className="flex flex-col flex-1 border border-[#15191c] rounded-[8px] mx-[22px] mb-[22px] overflow-hidden">
        <ChatUserHeader
          otherName={other?.displayName}
          otherAvatar={other?.avatar}
          onBack={() => navigate('/messages')}
        />
        <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-[20px] p-[17px]">
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
        </div>
        <div className="relative flex items-center justify-between border border-[#15191c] rounded-[8px] mx-[17px] mb-[17px] px-[10px] py-[8px]">
          {showEmoji && (
            <div className="absolute bottom-full mb-[8px] left-0 bg-[#15191c] rounded-[12px] p-[10px] grid grid-cols-8 gap-[2px] z-20 shadow-lg">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setNewMsg((p) => p + e);
                    setShowEmoji(false);
                  }}
                  className="text-[22px] hover:bg-[#2a2d30] rounded-[6px] p-[6px]"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <input
            type="file"
            ref={galleryRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <input type="file" ref={fileRef} className="hidden" onChange={handleFileSelect} />
          <div className="flex items-center gap-[20px]">
            <button onClick={() => setShowEmoji(!showEmoji)} className="shrink-0 hover:opacity-80">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5d5d5d"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
              </svg>
            </button>
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onFocus={() => setShowEmoji(false)}
              placeholder="Message"
              className="bg-transparent text-[16px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
            />
          </div>
          <div className="flex items-center gap-[34px]">
            <div className="flex items-center gap-[16px]">
              <button onClick={() => galleryRef.current?.click()} className="hover:opacity-80">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5d5d5d"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </button>
              <button onClick={() => fileRef.current?.click()} className="hover:opacity-80">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5d5d5d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!newMsg.trim() || sending}
              className="hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg width="34" height="31" viewBox="0 0 24 24" fill="#2e80c8">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
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
