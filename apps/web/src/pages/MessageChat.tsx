import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import {
  OtherBubble,
  SelfBubble,
  CallBubble,
  type ChatMessage,
} from '../components/chat/ChatBubbles';
import { MessagePageHeader, ChatUserHeader } from '../components/chat/ChatHeader';
import { ChatOverlays } from '../components/chat/ImagePreview';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { MessageUnlockPrompt } from '../components/chat/MessageUnlockPrompt';
import { useChat } from '../hooks/useChat';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useCall } from '../hooks/useCall';
import {
  TipOverlay,
  TypingIndicator,
  CreatorAIBar,
  applyUnlock,
  execSend,
  execImageSend,
  execLoadOlder,
  type OtherUser,
} from './MessageChatParts';

export default function MessageChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const userRole = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [other, setOther] = useState<OtherUser | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [unlockRequired, setUnlockRequired] = useState(false);
  const [unlockPrice, setUnlockPrice] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { incomingMessages, typingUsers, emitTyping, markRead, clearIncoming } =
    useChat(conversationId);
  const otherOnline = useOnlineStatus(other?.id);
  useCall(); // keep hook alive for incoming call handling

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
    api
      .get(`/messages/${conversationId}/unlock-price`)
      .then(({ data: r }) => applyUnlock(r, setUnlockRequired, setUnlockPrice))
      .catch(() => {});
    markRead();
    return () => clearIncoming();
  }, [conversationId, navigate, markRead, clearIncoming]);

  useEffect(() => {
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const newOnes = incomingMessages.filter((m) => !ids.has(m.id));
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
    });
    incomingMessages.length && markRead();
  }, [incomingMessages, markRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (loading)
    return (
      <div className="flex justify-center py-[60px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
      </div>
    );

  return (
    <div className="bg-card rounded-[11px] md:rounded-[22px] flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-130px)]">
      <MessagePageHeader />
      <div className="flex flex-col flex-1 border border-muted rounded-[8px] mx-[10px] mb-[10px] md:mx-[22px] md:mb-[22px] overflow-hidden">
        <ChatUserHeader
          otherName={other?.displayName}
          otherAvatar={other?.avatar}
          otherId={other?.id}
          conversationId={conversationId}
          onBack={() => navigate('/messages')}
          isOnline={otherOnline}
        />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-[12px] md:gap-[20px] p-[10px] md:p-[17px]"
        >
          {hasMore && (
            <button
              onClick={() =>
                execLoadOlder(
                  conversationId!,
                  nextCursor,
                  loadingOlder,
                  setLoadingOlder,
                  setMessages,
                  setHasMore,
                  setNextCursor,
                )
              }
              disabled={loadingOlder}
              className="self-center rounded-[50px] bg-muted px-[16px] py-[6px] text-[12px] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {loadingOlder ? 'Loading...' : 'Load older messages'}
            </button>
          )}
          {messages.map((msg) =>
            msg.mediaType === 'CALL' ? (
              <CallBubble key={msg.id} msg={msg} userId={userId} />
            ) : msg.senderId === userId ? (
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
          <TypingIndicator count={typingUsers.size} />
        </div>
        {unlockRequired ? (
          <MessageUnlockPrompt
            conversationId={conversationId!}
            price={unlockPrice}
            onUnlocked={() => {
              setUnlockRequired(false);
              setUnlockPrice(0);
            }}
          />
        ) : (
          <>
            <CreatorAIBar
              isCreator={userRole === 'CREATOR'}
              conversationId={conversationId}
              currentText={newMsg}
              onSelect={(text) => setNewMsg(text)}
              onPolish={(polished) => setNewMsg(polished)}
            />
            <ChatInputBar
              value={newMsg}
              onChange={(v) => {
                setNewMsg(v);
                emitTyping(v.length > 0);
              }}
              onSend={() =>
                execSend(conversationId!, newMsg, sending, setSending, setMessages, setNewMsg)
              }
              onFileSelect={(e) => {
                const f = e.target.files?.[0];
                f && setPreviewFile(f);
                e.target.value = '';
              }}
              sending={sending}
              onTip={other ? () => setShowTip(true) : undefined}
            />
          </>
        )}
      </div>
      <TipOverlay show={showTip} other={other} onClose={() => setShowTip(false)} />
      <ChatOverlays
        previewFile={previewFile}
        onSendImage={(file, caption) =>
          execImageSend(conversationId!, file, caption, setSending, setMessages, setPreviewFile)
        }
        onClosePreview={() => setPreviewFile(null)}
        sending={sending}
        viewImage={viewImage}
        onCloseViewer={() => setViewImage(null)}
      />
    </div>
  );
}
