import type { Dispatch, SetStateAction } from 'react';
import type { ChatMessage } from './ChatBubbles';
import { ChatInputBar } from './ChatInputBar';
import { MessageUnlockPrompt } from './MessageUnlockPrompt';
import { CreatorAIBar, execSend, type OtherUser } from '../../pages/MessageChatParts';

export type SetMsg = Dispatch<SetStateAction<ChatMessage[]>>;

export function ChatInputSection({
  unlockRequired,
  unlockPrice,
  conversationId,
  newMsg,
  setNewMsg,
  other,
  isCreator,
  sending,
  setSending,
  setMessages,
  setPreviewFile,
  setShowTip,
  emitTyping,
  onUnlocked,
}: {
  unlockRequired: boolean;
  unlockPrice: number;
  conversationId: string;
  newMsg: string;
  setNewMsg: (v: string) => void;
  other: OtherUser | null;
  isCreator: boolean;
  sending: boolean;
  setSending: (v: boolean) => void;
  setMessages: SetMsg;
  setPreviewFile: (f: File | null) => void;
  setShowTip: (v: boolean) => void;
  emitTyping: (v: boolean) => void;
  onUnlocked: () => void;
}) {
  if (unlockRequired)
    return (
      <MessageUnlockPrompt
        conversationId={conversationId}
        price={unlockPrice}
        onUnlocked={onUnlocked}
      />
    );
  const tipFn = other && !isCreator ? () => setShowTip(true) : undefined;
  return (
    <>
      <CreatorAIBar
        isCreator={isCreator}
        conversationId={conversationId}
        currentText={newMsg}
        onSelect={setNewMsg}
        onPolish={setNewMsg}
      />
      <ChatInputBar
        value={newMsg}
        onChange={(v) => {
          setNewMsg(v);
          emitTyping(v.length > 0);
        }}
        onSend={() => execSend(conversationId, newMsg, sending, setSending, setMessages, setNewMsg)}
        onFileSelect={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreviewFile(f);
          e.target.value = '';
        }}
        sending={sending}
        onTip={tipFn}
        isCreator={isCreator}
      />
    </>
  );
}
