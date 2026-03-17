import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLiveStream } from '../hooks/useLiveStream';
import { useLivePrivate } from '../hooks/useLivePrivate';
import { LiveChatPanel } from '../components/live/LiveChatPanel';
import { useCall } from '../hooks/useCall';
import { useCallStore } from '../stores/callStore';

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

  // On mount: if we just returned from a call page and private overlay is still set, clear it
  // (callStatus resets to 'idle' before LiveBroadcasting remounts, so we check idle here)
  useEffect(() => {
    if (creatorOnPrivateCall && callStatus === 'idle' && sessionId) {
      endPrivateCall(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While mounted: clear overlay the moment the call transitions to ended
  useEffect(() => {
    if (callStatus === 'ended' && creatorOnPrivateCall && sessionId) {
      endPrivateCall(sessionId);
    }
  }, [callStatus, creatorOnPrivateCall, sessionId, endPrivateCall]);

  // Attach local stream to video element
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

  // Timer
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Redirect if no session
  useEffect(() => {
    if (!sessionId && !sessionFromUrl) navigate('/creator/go-live');
  }, [sessionId, sessionFromUrl, navigate]);

  const handleEnd = async () => {
    await stopBroadcast();
    // Release camera/mic from browser — stopping tracks alone isn't enough
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    navigate('/creator/go-live');
  };

  const handleAccept = () => {
    if (!privateIncoming || !sessionId) return;
    acceptPrivate(sessionId, privateIncoming.userId);
    // Creator starts the call — fan will receive call:incoming
    startCall(privateIncoming.userId, 'video', {
      name: privateIncoming.userName,
      avatar: null,
    });
  };

  const handleDecline = () => {
    if (!privateIncoming) return;
    declinePrivate(privateIncoming.userId);
  };

  const handleEndPrivate = () => {
    if (sessionId) endPrivateCall(sessionId);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  const formatViewers = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

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
            <span className="text-[14px] text-muted-foreground">{formatTime(elapsed)}</span>
            {creatorOnPrivateCall && (
              <button
                onClick={handleEndPrivate}
                className="rounded-[6px] border border-border px-[10px] py-[4px] text-[12px] text-muted-foreground hover:border-foreground"
              >
                End Private
              </button>
            )}
          </div>
        )}
      </div>

      {/* Private call incoming request */}
      {privateIncoming && (
        <div className="flex items-center justify-between rounded-[12px] border border-[#e91e8c] bg-card px-[16px] py-[14px]">
          <div>
            <p className="text-[15px] font-semibold text-foreground">Private Show Request</p>
            <p className="text-[13px] text-muted-foreground">
              <span className="font-medium text-foreground">{privateIncoming.userName}</span> wants
              a private call
              <span className="ml-[6px] rounded-[12px] bg-yellow-400/20 px-[8px] py-[2px] text-[12px] font-bold text-yellow-500">
                🪙 {privateIncoming.tokens} tokens
              </span>
            </p>
          </div>
          <div className="flex gap-[10px]">
            <button
              onClick={handleAccept}
              className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[13px] font-medium text-white"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="rounded-[8px] border border-border px-[16px] py-[8px] text-[13px] text-foreground hover:border-foreground"
            >
              Decline
            </button>
          </div>
        </div>
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
            <div className="absolute right-[16px] top-[16px] flex items-center gap-[8px]">
              <span className="rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[14px] text-white">
                {formatViewers(viewerCount)} viewers
              </span>
            </div>
            {creatorOnPrivateCall && (
              <div className="absolute bottom-[12px] left-[12px] rounded-[6px] bg-[#e91e8c]/90 px-[10px] py-[4px] text-[12px] font-semibold text-white">
                On Private Call
              </div>
            )}
          </div>
        </div>
        <LiveChatPanel onSend={sendChat} />
      </div>
    </div>
  );
}
