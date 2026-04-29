import { useParams, useNavigate } from 'react-router-dom';
import { MessagePageHeader } from '../components/chat/ChatHeader';
import { MessageChatPanel } from '../components/chat/MessageChatPanel';

export default function MessageChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();

  if (!conversationId) return null;

  return (
    <div className="bg-card rounded-[11px] md:rounded-[22px] flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-130px)]">
      <MessagePageHeader />
      <div className="flex flex-col flex-1 border border-muted rounded-[8px] mx-[10px] mb-[10px] md:mx-[22px] md:mb-[22px] overflow-hidden">
        <MessageChatPanel conversationId={conversationId} onBack={() => navigate('/messages')} />
      </div>
    </div>
  );
}
