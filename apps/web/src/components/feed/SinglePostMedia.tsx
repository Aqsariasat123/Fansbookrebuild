import { useState } from 'react';
import { MultiImageGrid } from './MultiImageGrid';
import { MediaViewer } from './MediaViewer';
import { VideoThumbnail } from './VideoThumbnail';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export function SinglePostMedia({ media }: { media: Media[] }) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const images = media.filter((m) => m.type === 'IMAGE');
  const video = media.find((m) => m.type === 'VIDEO');

  return (
    <div className="mt-[20px]">
      {images.length === 1 && (
        <div
          className="relative aspect-[3/4] w-[60%] cursor-pointer overflow-hidden rounded-[22px]"
          onClick={() => setViewerIdx(0)}
        >
          <img src={images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
      {images.length > 1 && <MultiImageGrid images={images} onClickImage={setViewerIdx} />}
      {video && (
        <div
          className="relative aspect-[3/4] w-[60%] cursor-pointer overflow-hidden rounded-[22px]"
          onClick={() => setViewerIdx(0)}
        >
          <VideoThumbnail
            src={video.url}
            fallback={video.thumbnail || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}
      {viewerIdx !== null && (
        <MediaViewer
          media={video ? [video] : images}
          initialIndex={viewerIdx}
          onClose={() => setViewerIdx(null)}
        />
      )}
    </div>
  );
}
