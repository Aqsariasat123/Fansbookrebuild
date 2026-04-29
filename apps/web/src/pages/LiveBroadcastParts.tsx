import type { RefObject } from 'react';

export function PrivateRequestBanner({
  userName,
  tokens,
  onAccept,
  onDecline,
}: {
  userName: string;
  tokens: number;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#a61651]/40 bg-card px-[16px] py-[14px]">
      <div>
        <p className="text-[15px] font-semibold text-foreground">Private Show Request</p>
        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">{userName}</span> wants a private call
          <span className="ml-[6px] rounded-[12px] bg-yellow-400/20 px-[8px] py-[2px] text-[12px] font-bold text-yellow-500">
            🪙 {tokens} tokens
          </span>
        </p>
      </div>
      <div className="flex gap-[10px]">
        <button
          onClick={onAccept}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[13px] font-medium text-white"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="rounded-[8px] border border-border px-[16px] py-[8px] text-[13px] text-foreground hover:border-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export function BroadcastVideoPanel({
  videoRef,
  viewerCount,
  creatorOnPrivateCall,
  zoomLevel,
  isScreenSharing,
  isLive,
  elapsed,
  onEnd,
  onZoomChange,
  onToggleScreenShare,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  viewerCount: number;
  creatorOnPrivateCall: boolean;
  zoomLevel: number;
  isScreenSharing: boolean;
  isLive: boolean;
  elapsed: number;
  onEnd: () => void;
  onZoomChange: (level: number) => void;
  onToggleScreenShare: () => void;
}) {
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="overflow-hidden rounded-[16px]">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[10px]">
        <p className="text-[16px] font-semibold text-white">Video Broadcasting</p>
        <button
          onClick={onEnd}
          className="rounded-[8px] bg-card px-[20px] py-[6px] text-[14px] font-medium text-foreground"
        >
          End Stream
        </button>
      </div>
      {/* Video — overflow:hidden clips zoom, object-cover fills 100% always */}
      <div className="relative overflow-hidden bg-[#0a0c0e]" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${zoomLevel}) scaleX(-1)`, transformOrigin: 'center center' }}
        />
        {/* LIVE badge + timer — top left */}
        {isLive && (
          <div className="absolute left-[12px] top-[12px] flex items-center gap-[8px]">
            <span className="rounded-[4px] bg-red-600 px-[10px] py-[4px] text-[13px] font-bold text-white">
              LIVE
            </span>
            <span className="rounded-[4px] bg-black/60 px-[8px] py-[4px] text-[13px] font-medium text-white">
              {fmtTime(elapsed)}
            </span>
          </div>
        )}
        {/* Viewer count — top right */}
        <div className="absolute right-[12px] top-[12px]">
          <span className="rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[13px] text-white">
            {fmt(viewerCount)} viewers
          </span>
        </div>
        {creatorOnPrivateCall && (
          <div className="absolute bottom-[12px] left-[12px] rounded-[6px] bg-gradient-to-r from-[#01adf1]/90 to-[#a61651]/90 px-[10px] py-[4px] text-[12px] font-semibold text-white">
            On Private Call
          </div>
        )}
      </div>
      {/* Camera controls */}
      <div className="flex items-center gap-[16px] bg-card px-[16px] py-[10px]">
        <div className="flex flex-1 items-center gap-[8px]">
          <button
            onClick={() => onZoomChange(Math.max(1.0, zoomLevel - 0.1))}
            className="flex size-[28px] items-center justify-center rounded-full border border-border text-[16px] font-medium text-foreground hover:border-foreground"
          >
            −
          </button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoomLevel}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="h-[4px] flex-1 accent-[#01adf1]"
          />
          <button
            onClick={() => onZoomChange(Math.min(3, zoomLevel + 0.1))}
            className="flex size-[28px] items-center justify-center rounded-full border border-border text-[16px] font-medium text-foreground hover:border-foreground"
          >
            +
          </button>
          <span className="min-w-[36px] text-[12px] text-muted-foreground">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
        <button
          onClick={onToggleScreenShare}
          className={`flex items-center gap-[6px] rounded-[8px] px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
            isScreenSharing
              ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
              : 'border border-border text-foreground hover:border-foreground'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-[14px]">
            <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v1h12v-1l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z" />
          </svg>
          {isScreenSharing ? 'Stop Share' : 'Share Screen'}
        </button>
      </div>
    </div>
  );
}
