import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import type { ChatMessage } from './ChatBubbles';
import { MsgItem, mergeMessages } from './ChatExtras';
import { ChatUserHeader } from './ChatHeader';
import { ChatOverlays } from './ImagePreview';
import { ChatInputSection, type SetMsg } from './ChatInputSection';
import { useChat } from '../../hooks/useChat';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useCall } from '../../hooks/useCall';
import {
  TipOverlay,
  TypingIndicator,
  applyUnlock,
  execImageSend,
  execLoadOlder,
  type OtherUser,
} from '../../pages/MessageChatParts';

interface Props {
  conversationId: string;
  onBack: () => void;
  hideHeader?: boolean;
}

export function MessageChatPanel({ conversationId, onBack, hideHeader }: Props) {
  const userId = useAuthStore((s) => s.user?.id);
  const userRole = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();
  const isCreator = userRole === 'CREATOR';
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
  useCall();

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setOther(null);
    api
      .get(`/messages/${conversationId}`)
      .then(({ data: r }) => {
        if (r.success) {
          setMessages(r.data.messages);
          setOther(r.data.other);
          setHasMore(Boolean(r.data.hasMore));
          setNextCursor(r.data.nextCursor as string | null);
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
    setMessages((prev) => mergeMessages(prev, incomingMessages));
    if (incomingMessages.length) markRead();
  }, [incomingMessages, markRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const delMsg = (id: string) => setMessages((p) => p.filter((m) => m.id !== id));

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center py-[60px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
      </div>
    );

  const setMsgTyped = setMessages as SetMsg;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {!hideHeader && (
        <ChatUserHeader
          otherName={other?.displayName}
          otherAvatar={other?.avatar}
          otherId={other?.id}
          conversationId={conversationId}
          onBack={onBack}
          isOnline={otherOnline}
        />
      )}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-[12px] overflow-y-auto p-[10px] md:gap-[20px] md:p-[17px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[6px]"
      >
        {hasMore && (
          <button
            onClick={() =>
              execLoadOlder(
                conversationId,
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
        {messages.map((msg, i) => (
          <MsgItem
            key={msg.id}
            msg={msg}
            prev={messages[i - 1]}
            userId={userId}
            onDelete={delMsg}
            onView={setViewImage}
          />
        ))}
        <TypingIndicator count={typingUsers.size} />
      </div>
      <ChatInputSection
        unlockRequired={unlockRequired}
        unlockPrice={unlockPrice}
        conversationId={conversationId}
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        other={other}
        isCreator={isCreator}
        sending={sending}
        setSending={setSending}
        setMessages={setMsgTyped}
        setPreviewFile={setPreviewFile}
        setShowTip={setShowTip}
        emitTyping={emitTyping}
        onUnlocked={() => {
          setUnlockRequired(false);
          setUnlockPrice(0);
        }}
      />
      <TipOverlay show={showTip} other={other} onClose={() => setShowTip(false)} />
      <ChatOverlays
        previewFile={previewFile}
        onSendImage={(file, cap) =>
          execImageSend(conversationId, file, cap, setSending, setMsgTyped, setPreviewFile)
        }
        onClosePreview={() => setPreviewFile(null)}
        sending={sending}
        viewImage={viewImage}
        onCloseViewer={() => setViewImage(null)}
      />
    </div>
  );
}
