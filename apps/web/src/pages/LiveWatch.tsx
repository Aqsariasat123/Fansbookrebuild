import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLiveStream } from '../hooks/useLiveStream';
import { LiveChatPanel } from '../components/live/LiveChatPanel';
import { api } from '../lib/api';

export default function LiveWatch() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLive = useLiveStore((s) => s.isLive);
  const viewerCount = useLiveStore((s) => s.viewerCount);
  const { joinLive, consumeTrack, leaveLive, sendChat } = useLiveStream();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHls, setIsHls] = useState(false);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    (async () => {
      try {
        await joinLive(sessionId, videoRef.current);
        // Fetch producer list and consume each track
        const { data: prodData } = await api.get(`/live/${sessionId}/producers`);
        const producers: { producerId: string; kind: string }[] = prodData.data ?? [];
        for (const p of producers) {
          await consumeTrack(sessionId, p.producerId, videoRef.current);
        }
        if (mounted) setLoading(false);
      } catch {
        // mediasoup failed — try HLS fallback
        if (!mounted) return;
        try {
          await attachHlsFallback(sessionId);
          if (mounted) {
            setIsHls(true);
            setLoading(false);
          }
        } catch {
          if (mounted) {
            setError('This stream is not currently available or has ended.');
            setLoading(false);
          }
        }
      }
    })();

    return () => {
      mounted = false;
      leaveLive();
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function attachHlsFallback(sid: string) {
    const { data } = await api.get(`/live/${sid}`);
    const hlsUrl: string | null = data?.data?.hlsUrl ?? null;
    if (!hlsUrl) throw new Error('No HLS URL');

    const video = videoRef.current;
    if (!video) throw new Error('No video element');

    // Native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      await video.play();
      return;
    }

    // hls.js fallback
    const Hls = (await import('hls.js')).default;
    if (!Hls.isSupported()) throw new Error('HLS not supported');

    const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
    hlsRef.current = hls;
  }

  const handleLeave = () => {
    leaveLive();
    navigate(-1);
  };

  const formatViewers = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  if (error) {
    return (
      <div className="flex flex-col items-center gap-[16px] py-[80px]">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="#e02a2a" strokeWidth="2" />
        </svg>
        <p className="text-[18px] font-semibold text-foreground">Stream Unavailable</p>
        <p className="text-[14px] text-muted-foreground">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[14px] font-medium text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <span className="rounded-[4px] bg-red-600 px-[10px] py-[4px] text-[12px] font-semibold text-white">
            LIVE
          </span>
          <p className="text-[18px] font-semibold text-foreground">Watching Live</p>
        </div>
        <button
          onClick={handleLeave}
          className="rounded-[8px] border border-border px-[20px] py-[8px] text-[14px] text-foreground hover:border-foreground"
        >
          Leave
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        {/* Video */}
        <div className="overflow-hidden rounded-[16px] border border-[#e91e8c]">
          <div className="flex items-center justify-between bg-[#e91e8c] px-[20px] py-[10px]">
            <div className="flex items-center gap-[8px]">
              <p className="text-[16px] font-semibold text-white">Live Stream</p>
              {isHls && (
                <span className="rounded-[4px] bg-white/20 px-[6px] py-[2px] text-[10px] font-semibold uppercase text-white">
                  HLS
                </span>
              )}
            </div>
            <span className="text-[12px] text-white/80">{formatViewers(viewerCount)} viewers</span>
          </div>
          <div className="relative bg-[#0a0c0e]">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e91e8c] border-t-transparent" />
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="aspect-video w-full object-cover"
            />
            {!isLive && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-[16px] text-white">Stream has ended</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat */}
        <LiveChatPanel onSend={sendChat} />
      </div>
    </div>
  );
}
