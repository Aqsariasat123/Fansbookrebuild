import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLiveStream } from '../hooks/useLiveStream';
import { LiveChatPanel } from '../components/live/LiveChatPanel';

export default function LiveBroadcasting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionFromUrl = searchParams.get('session');
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLive = useLiveStore((s) => s.isLive);
  const viewerCount = useLiveStore((s) => s.viewerCount);
  const sessionId = useLiveStore((s) => s.sessionId);
  const { stopBroadcast, sendChat, getLocalStream } = useLiveStream();
  const [elapsed, setElapsed] = useState(0);

  // Attach local stream to video element
  useEffect(() => {
    const stream = getLocalStream();
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [getLocalStream, isLive]);

  // Timer
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Redirect if no session
  useEffect(() => {
    if (!sessionId && !sessionFromUrl) {
      navigate('/creator/go-live');
    }
  }, [sessionId, sessionFromUrl, navigate]);

  const handleEnd = async () => {
    await stopBroadcast();
    navigate('/creator/go-live');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const formatViewers = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[18px] font-semibold text-foreground">Live Broadcasting</p>
          <p className="text-[14px] text-muted-foreground">
            You are live! Your fans can watch you in real-time.
          </p>
        </div>
        {isLive && (
          <div className="flex items-center gap-[12px]">
            <span className="rounded-[4px] bg-red-600 px-[10px] py-[4px] text-[12px] font-semibold text-white">
              LIVE
            </span>
            <span className="text-[14px] text-muted-foreground">{formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        {/* Video Panel */}
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
          </div>
        </div>

        {/* Chat Panel */}
        <LiveChatPanel onSend={sendChat} />
      </div>
    </div>
  );
}
