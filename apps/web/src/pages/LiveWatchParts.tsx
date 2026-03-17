import { api } from '../lib/api';

export interface SessionInfo {
  privateShow: boolean;
  privateShowTokens: number;
  creatorId: string;
  creatorName: string;
}

export type PrivateStatus = 'idle' | 'pending' | 'accepted' | 'declined';

export async function attachHls(sid: string, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { data } = await api.get(`/live/${sid}`);
  const hlsUrl: string | null = data?.data?.hlsUrl ?? null;
  if (!hlsUrl) throw new Error('No HLS URL');
  const video = videoRef.current;
  if (!video) throw new Error('No video element');
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = hlsUrl;
    await video.play();
    return null;
  }
  const Hls = (await import('hls.js')).default;
  if (!Hls.isSupported()) throw new Error('HLS not supported');
  const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
  hls.loadSource(hlsUrl);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    video.play();
  });
  return hls;
}

export function VideoPanel({
  videoRef,
  loading,
  isHls,
  isLive,
  onPrivateCall,
  creatorName,
  viewerCount,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  loading: boolean;
  isHls: boolean;
  isLive: boolean;
  onPrivateCall: boolean;
  creatorName: string;
  viewerCount: number;
}) {
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
  return (
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
        <span className="text-[12px] text-white/80">{fmt(viewerCount)} viewers</span>
      </div>
      <div className="relative bg-[#0a0c0e]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e91e8c] border-t-transparent" />
          </div>
        )}
        <video ref={videoRef} autoPlay playsInline className="aspect-video w-full object-cover" />
        {!isLive && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <p className="text-[16px] text-white">Stream has ended</p>
          </div>
        )}
        {onPrivateCall && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-center text-[16px] font-semibold text-white px-[20px]">
              {creatorName} is on a Private call. Please wait.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function GoPrivateControls({
  status,
  tokens,
  onRequest,
}: {
  status: PrivateStatus;
  tokens: number;
  onRequest: () => void;
}) {
  if (status === 'pending')
    return <span className="text-[13px] text-muted-foreground">Request sent...</span>;
  if (status === 'accepted')
    return (
      <span className="text-[13px] text-green-500 font-medium">Creator will call you shortly!</span>
    );
  if (status === 'declined')
    return <span className="text-[13px] text-red-400">Request declined</span>;
  return (
    <button
      onClick={onRequest}
      className="flex items-center gap-[6px] rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[14px] font-medium text-white"
    >
      Go Private
      <span className="flex items-center gap-[2px] rounded-[20px] bg-yellow-400 px-[6px] py-[2px] text-[11px] font-bold text-black">
        🪙 {tokens}
      </span>
    </button>
  );
}
