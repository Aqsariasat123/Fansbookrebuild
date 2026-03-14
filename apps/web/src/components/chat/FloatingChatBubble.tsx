import { useNavigate } from 'react-router-dom';
import { useMessageStore } from '../../stores/messageStore';

export function FloatingChatBubble() {
  const pendingConvs = useMessageStore((s) => s.pendingConvs);
  const removePending = useMessageStore((s) => s.removePending);
  const navigate = useNavigate();

  if (pendingConvs.length === 0) return null;

  return (
    <div className="fixed bottom-[24px] right-[24px] z-[100] flex flex-col-reverse gap-[10px]">
      {pendingConvs.slice(0, 3).map((conv) => (
        <button
          key={conv.conversationId}
          onClick={() => {
            removePending(conv.conversationId);
            navigate(`/messages/${conv.conversationId}`);
          }}
          className="relative flex size-[56px] items-center justify-center rounded-full shadow-lg ring-2 ring-[#01adf1] hover:scale-110 transition-transform"
        >
          {conv.senderAvatar ? (
            <img src={conv.senderAvatar} alt="" className="size-full rounded-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[18px] font-medium text-white">
              {conv.senderName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute -top-[4px] -right-[4px] flex min-w-[20px] h-[20px] items-center justify-center rounded-full bg-red-500 px-[4px] text-[11px] font-bold text-white">
            {conv.count > 99 ? '99+' : conv.count}
          </span>
        </button>
      ))}
    </div>
  );
}
