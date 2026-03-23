import { TipModal } from '../components/shared/TipModal';
import { TypingDots } from '../components/chat/ChatBubbles';
import { SmartReplyBar } from '../components/chat/SmartReplyBar';
import { api } from '../lib/api';
import type { ChatMessage } from '../components/chat/ChatBubbles';
import type React from 'react';

export type OtherUser = { id: string; displayName: string; avatar: string | null };
export type SetMsgs = React.Dispatch<React.SetStateAction<ChatMessage[]>>;

export function TipOverlay({
  show,
  other,
  onClose,
}: {
  show: boolean;
  other: OtherUser | null;
  onClose: () => void;
}) {
  if (!show || !other) return null;
  return <TipModal receiverId={other.id} receiverName={other.displayName} onClose={onClose} />;
}

export function TypingIndicator({ count }: { count: number }) {
  return count > 0 ? <TypingDots /> : null;
}

export function CreatorAIBar({
  isCreator,
  conversationId,
  currentText,
  onSelect,
  onPolish,
}: {
  isCreator: boolean;
  conversationId: string | undefined;
  currentText: string;
  onSelect: (text: string) => void;
  onPolish: (polished: string) => void;
}) {
  if (!isCreator || !conversationId) return null;
  return (
    <SmartReplyBar
      conversationId={conversationId}
      currentText={currentText}
      onSelect={onSelect}
      onPolish={onPolish}
    />
  );
}

export type UnlockResp = { success: boolean; data: { required: boolean; price: number } };
export function applyUnlock(
  r: UnlockResp,
  setReq: (v: boolean) => void,
  setPrice: (v: number) => void,
) {
  if (!r.success) return;
  setReq(r.data.required);
  r.data.required && setPrice(r.data.price);
}

export async function execSend(
  cid: string,
  text: string,
  sending: boolean,
  setSending: (v: boolean) => void,
  setMsgs: SetMsgs,
  setMsg: (v: string) => void,
) {
  if (!text || !cid || sending) return;
  setSending(true);
  try {
    const { data: res } = await api.post(`/messages/${cid}`, { text });
    if (res.success) {
      setMsgs((p) => [...p, res.data]);
      setMsg('');
    }
  } catch {
    /* */
  } finally {
    setSending(false);
  }
}

export async function execImageSend(
  cid: string,
  file: File,
  caption: string,
  setSending: (v: boolean) => void,
  setMsgs: SetMsgs,
  setPreview: (v: File | null) => void,
) {
  if (!cid) return;
  setSending(true);
  try {
    const fd = new FormData();
    fd.append('image', file);
    if (caption.trim()) fd.append('caption', caption.trim());
    const { data: res } = await api.post(`/messages/${cid}/image`, fd);
    if (res.success) {
      setMsgs((p) => [...p, res.data]);
      setPreview(null);
    }
  } catch {
    /* */
  } finally {
    setSending(false);
  }
}

export async function execLoadOlder(
  cid: string,
  cursor: string | null,
  loading: boolean,
  setLoading: (v: boolean) => void,
  setMsgs: SetMsgs,
  setHasMore: (v: boolean) => void,
  setCursor: (v: string | null) => void,
) {
  if (!cid || !cursor || loading) return;
  setLoading(true);
  try {
    const { data: res } = await api.get(`/messages/${cid}?cursor=${cursor}`);
    if (res.success) {
      setMsgs((p) => [...res.data.messages, ...p]);
      setHasMore(res.data.hasMore ?? false);
      setCursor(res.data.nextCursor ?? null);
    }
  } catch {
    /* */
  } finally {
    setLoading(false);
  }
}
