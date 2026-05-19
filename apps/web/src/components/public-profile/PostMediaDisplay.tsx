import { useState } from 'react';
import { MediaViewer } from '../feed/MediaViewer';
import { withWatermark } from '../../lib/api';
import { PostLockedImage } from './PostLockedImage';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface PostMediaDisplayProps {
  images: MediaItem[];
  isLocked: boolean;
  ppvPrice?: number | null;
  postId?: string;
  username?: string;
  onUnlocked?: () => void;
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

export function PostMediaDisplay({
  images,
  isLocked,
  ppvPrice,
  postId,
  username,
  onUnlocked,
}: PostMediaDisplayProps) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  if (isLocked) {
    return (
      <PostLockedImage
        image={images[0]!}
        ppvPrice={ppvPrice}
        postId={postId}
        onUnlocked={onUnlocked}
      />
    );
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
          username={username}
        />
      )}
    </>
  );
}
