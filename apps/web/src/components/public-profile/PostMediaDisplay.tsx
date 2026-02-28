import { useState } from 'react';
import { MediaViewer } from '../feed/MediaViewer';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface PostMediaDisplayProps {
  images: MediaItem[];
  isLocked: boolean;
}

function LockedOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white" className="opacity-80">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
      </svg>
      <p className="mt-[8px] rounded-[4px] bg-black/60 px-[12px] py-[4px] text-[13px] text-white">
        Subscribe to see user&apos;s photo
      </p>
    </div>
  );
}

function SingleImage({ image, onClick }: { image: MediaItem; onClick: () => void }) {
  return (
    <div
      className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]"
      onClick={onClick}
    >
      <img src={image.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
        <img src={images[0]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
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

function LockedImage({ image }: { image: MediaItem }) {
  return (
    <div className="relative mb-[14px] aspect-[3/4] w-[55%] max-w-[320px] overflow-hidden rounded-[16px] md:w-[45%] md:max-w-[380px]">
      <img src={image.url} alt="" className="h-full w-full object-cover blur-xl" />
      <LockedOverlay />
    </div>
  );
}

export function PostMediaDisplay({ images, isLocked }: PostMediaDisplayProps) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  if (isLocked) {
    return <LockedImage image={images[0]!} />;
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
