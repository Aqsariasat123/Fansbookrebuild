import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLiveStream } from '../hooks/useLiveStream';
import { useLivePrivate } from '../hooks/useLivePrivate';
import { LiveChatPanel } from '../components/live/LiveChatPanel';
import { InStreamShopPanel } from '../components/live/InStreamShopPanel';
import { useCall } from '../hooks/useCall';
import { useCallStore } from '../stores/callStore';
import { PrivateRequestBanner, BroadcastVideoPanel } from './LiveBroadcastParts';

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

  const { stopBroadcast, sendChat, getLocalStream, switchToScreenShare, switchToCamera } =
    useLiveStream();
  const { acceptPrivate, declinePrivate, endPrivateCall } = useLivePrivate();
  const { startCall } = useCall();
  const callStatus = useCallStore((s) => s.status);

  const [elapsed, setElapsed] = useState(0);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'shop'>('chat');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [screenSharing, setScreenSharing] = useState(false);

  // Attach stream to video element + retry until ready
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

  // Health check — re-attach stream if video goes black
  useEffect(() => {
    if (!isLive) return;
    const check = setInterval(() => {
      if (!videoRef.current) return;
      const stream = getLocalStream();
      if (!stream) return;
      if (videoRef.current.srcObject !== stream || videoRef.current.paused) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    }, 3000);
    return () => clearInterval(check);
  }, [isLive, getLocalStream]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (!sessionId && !sessionFromUrl) navigate('/creator/go-live');
  }, [sessionId, sessionFromUrl, navigate]);

  useEffect(() => {
    if (callStatus === 'ended' && creatorOnPrivateCall && sessionId) endPrivateCall(sessionId);
  }, [callStatus, creatorOnPrivateCall, sessionId, endPrivateCall]);

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

  const handleToggleScreenShare = async () => {
    if (screenSharing) {
      await switchToCamera();
      setScreenSharing(false);
    } else {
      const ok = await switchToScreenShare();
      setScreenSharing(ok);
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

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
        <BroadcastVideoPanel
          videoRef={videoRef}
          viewerCount={viewerCount}
          creatorOnPrivateCall={creatorOnPrivateCall}
          zoomLevel={zoomLevel}
          isScreenSharing={screenSharing}
          onEnd={handleEnd}
          onZoomChange={setZoomLevel}
          onToggleScreenShare={handleToggleScreenShare}
        />
        <div className="flex flex-col gap-[8px]">
          <div className="flex overflow-hidden rounded-[12px] border border-[#a61651]/40">
            {(['chat', 'shop'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-[10px] text-[13px] font-semibold transition-colors ${
                  activeTab === t
                    ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
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
