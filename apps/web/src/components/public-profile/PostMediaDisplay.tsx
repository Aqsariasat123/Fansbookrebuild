import { useState } from 'react';
import { MediaViewer } from '../feed/MediaViewer';
import { withWatermark } from '../../lib/api';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface PostMediaDisplayProps {
  images: MediaItem[];
  isLocked: boolean;
  ppvPrice?: number | null;
  username?: string;
}

function LockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="white" className="opacity-90">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
  );
}

function SparkleOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[16px]">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[6px] w-[6px] rounded-full bg-white"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animation: `sparkle 0.6s ease-out ${i * 0.05}s forwards`,
            opacity: 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0 rounded-[16px] bg-white"
        style={{ animation: 'flashReveal 0.5s ease-out forwards' }}
      />
    </div>
  );
}

function LockedOverlay({ ppvPrice }: { ppvPrice?: number | null }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px] bg-black/50 backdrop-blur-[2px]">
      <LockIcon />
      {ppvPrice ? (
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[13px] text-white/80">Pay per view</span>
          <div className="flex items-center gap-[6px] rounded-[20px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[18px] py-[8px] text-[14px] font-semibold text-white shadow-lg">
            <span className="text-[16px]">🪙</span>
            Unlock for {ppvPrice} coins
          </div>
        </div>
      ) : (
        <p className="rounded-[6px] bg-black/60 px-[14px] py-[6px] text-[13px] text-white">
          Subscribe to unlock
        </p>
      )}
    </div>
  );
}

function SingleImage({ image, onClick }: { image: MediaItem; onClick: () => void }) {
  return (
    <div
      className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]"
      onClick={onClick}
    >
      <img
        src={withWatermark(image.url)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function MultiImageGrid({
  images,
  onClickIndex,
}: {
  images: MediaItem[];
  onClickIndex: (i: number) => void;
}) {
  return (
    <div className="flex w-full gap-[11px] md:gap-[20px]">
      <div
        className="relative h-[160px] w-[60%] shrink-0 cursor-pointer overflow-hidden rounded-[22px] md:h-[356px] md:w-[518px]"
        onClick={() => onClickIndex(0)}
      >
        <img
          src={withWatermark(images[0]?.url ?? '')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-[10px] md:gap-[20px]">
        <div
          className="relative h-[75px] cursor-pointer overflow-hidden rounded-[22px] md:h-[168px]"
          onClick={() => onClickIndex(1)}
        >
          <img
            src={images[1]?.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {images.length > 2 && (
          <div
            className="relative h-[75px] cursor-pointer overflow-hidden rounded-[22px] md:h-[168px]"
            onClick={() => onClickIndex(2)}
          >
            <img
              src={images[2]?.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="text-center text-[12px] font-normal text-foreground md:text-[20px]">
                +{String(images.length - 2).padStart(2, '0')}
                <br />
                More
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LockedImage({ image, ppvPrice }: { image: MediaItem; ppvPrice?: number | null }) {
  const [unlocking, setUnlocking] = useState(false);

  function handleUnlock() {
    if (!ppvPrice) return;
    setUnlocking(true);
    setTimeout(() => setUnlocking(false), 700);
  }

  return (
    <div className="relative mb-[14px] aspect-[3/4] w-[55%] max-w-[320px] overflow-hidden rounded-[16px] md:w-[45%] md:max-w-[380px]">
      <img src={image.url} alt="" className="h-full w-full object-cover blur-xl" />
      {unlocking && <SparkleOverlay />}
      {!unlocking && <LockedOverlay ppvPrice={ppvPrice} />}
      {ppvPrice && !unlocking && (
        <button
          onClick={handleUnlock}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label="Unlock content"
        />
      )}
    </div>
  );
}

export function PostMediaDisplay({
  images,
  isLocked,
  ppvPrice,
  username: _username,
}: PostMediaDisplayProps) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  if (isLocked) {
    return <LockedImage image={images[0]!} ppvPrice={ppvPrice} />;
  }

  return (
    <>
      <div className="mb-[14px]">
        {images.length === 1 ? (
          <SingleImage image={images[0]!} onClick={() => setViewerIdx(0)} />
        ) : (
          <MultiImageGrid images={images} onClickIndex={setViewerIdx} />
        )}
      </div>
      {viewerIdx !== null && (
        <MediaViewer
          media={images.map((m) => ({ ...m, type: m.type as 'IMAGE' | 'VIDEO' }))}
          initialIndex={viewerIdx}
          onClose={() => setViewerIdx(null)}
        />
      )}
    </>
  );
}
