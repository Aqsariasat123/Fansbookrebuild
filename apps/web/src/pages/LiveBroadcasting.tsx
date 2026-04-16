import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLiveStream } from '../hooks/useLiveStream';
import { useLivePrivate } from '../hooks/useLivePrivate';
import { LiveChatPanel } from '../components/live/LiveChatPanel';
import { InStreamShopPanel } from '../components/live/InStreamShopPanel';
import { useCall } from '../hooks/useCall';
import { useCallStore } from '../stores/callStore';
import { PrivateRequestBanner } from './LiveBroadcastParts';

export default function LiveBroadcasting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionFromUrl = searchParams.get('session');
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLive = useLiveStore((s) => s.isLive);
  const viewerCount = useLiveStore((s) => s.viewerCount);
  const sessionId = useLiveStore((s) => s.sessionId);
  const privateIncoming = useLiveStore((s) => s.privateIncoming);
  const creatorOnPrivateCall = useLiveStore((s) => s.creatorOnPrivateCall);

  const { stopBroadcast, sendChat, getLocalStream } = useLiveStream();
  const { acceptPrivate, declinePrivate, endPrivateCall } = useLivePrivate();
  const { startCall } = useCall();
  const callStatus = useCallStore((s) => s.status);
  const [elapsed, setElapsed] = useState(0);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'shop'>('chat');

  useEffect(() => {
    if (creatorOnPrivateCall && callStatus === 'idle' && sessionId) endPrivateCall(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (callStatus === 'ended' && creatorOnPrivateCall && sessionId) endPrivateCall(sessionId);
  }, [callStatus, creatorOnPrivateCall, sessionId, endPrivateCall]);

  useEffect(() => {
    const attach = () => {
      const stream = getLocalStream();
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
        return true;
      }
      return false;
    };
    if (attach()) return;
    const interval = setInterval(() => {
      if (attach()) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [getLocalStream, isLive]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (!sessionId && !sessionFromUrl) navigate('/creator/go-live');
  }, [sessionId, sessionFromUrl, navigate]);

  const handleEnd = async () => {
    await stopBroadcast();
    if (videoRef.current) videoRef.current.srcObject = null;
    navigate('/creator/go-live');
  };

  const handleAccept = () => {
    if (!privateIncoming || !sessionId) return;
    acceptPrivate(sessionId, privateIncoming.userId);
    startCall(privateIncoming.userId, 'video', { name: privateIncoming.userName, avatar: null });
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const fmtV = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[12px] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[16px] font-semibold text-foreground md:text-[18px]">
            Live Broadcasting
          </p>
          <p className="text-[13px] text-muted-foreground md:text-[14px]">
            You are live! Your fans can watch you in real-time.
          </p>
        </div>
        {isLive && (
          <div className="flex items-center gap-[12px]">
            <span className="rounded-[4px] bg-red-600 px-[10px] py-[4px] text-[12px] font-semibold text-white">
              LIVE
            </span>
            <span className="text-[14px] text-muted-foreground">{fmt(elapsed)}</span>
            {creatorOnPrivateCall && (
              <button
                onClick={() => sessionId && endPrivateCall(sessionId)}
                className="rounded-[6px] border border-border px-[10px] py-[4px] text-[12px] text-muted-foreground hover:border-foreground"
              >
                End Private
              </button>
            )}
          </div>
        )}
      </div>

      {privateIncoming && (
        <PrivateRequestBanner
          userName={privateIncoming.userName}
          tokens={privateIncoming.tokens}
          onAccept={handleAccept}
          onDecline={() => privateIncoming && declinePrivate(privateIncoming.userId)}
        />
      )}

      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        <div className="overflow-hidden rounded-[16px] border border-[#e91e8c]">
          <div className="flex items-center justify-between bg-[#e91e8c] px-[20px] py-[10px]">
            <p className="text-[16px] font-semibold text-white">Video Broadcasting</p>
            <button
              onClick={handleEnd}
              className="rounded-[8px] bg-card px-[20px] py-[6px] text-[14px] font-medium text-[#e91e8c]"
            >
              End Stream
            </button>
          </div>
          <div className="relative bg-[#0a0c0e]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full -scale-x-100 object-cover"
            />
            <div className="absolute right-[16px] top-[16px]">
              <span className="rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[14px] text-white">
                {fmtV(viewerCount)} viewers
              </span>
            </div>
            {creatorOnPrivateCall && (
              <div className="absolute bottom-[12px] left-[12px] rounded-[6px] bg-[#e91e8c]/90 px-[10px] py-[4px] text-[12px] font-semibold text-white">
                On Private Call
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex overflow-hidden rounded-[12px] border border-[#e91e8c]">
            {(['chat', 'shop'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-[10px] text-[13px] font-semibold transition-colors ${activeTab === t ? 'bg-[#e91e8c] text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t === 'chat' ? 'Live Chat' : pinnedItemId ? '🟢 Shop' : 'Shop'}
              </button>
            ))}
          </div>
          <div className={activeTab === 'chat' ? '' : 'hidden'}>
            <LiveChatPanel onSend={sendChat} />
          </div>
          {sessionId && (
            <div className={activeTab === 'shop' ? '' : 'hidden'}>
              <InStreamShopPanel
                sessionId={sessionId}
                pinnedItemId={pinnedItemId}
                onPinChange={setPinnedItemId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
