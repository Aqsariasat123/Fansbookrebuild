import { useState } from 'react';
import { MediaViewer } from '../feed/MediaViewer';
import { VideoThumbnail } from '../feed/VideoThumbnail';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  postId: string;
  isLocked: boolean;
  thumbnail?: string | null;
}

interface MediaGridProps {
  media: MediaItem[];
}

export function MediaGrid({ media }: MediaGridProps) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const unlocked = media.filter((m) => !m.isLocked);

  return (
    <>
      <div className="grid grid-cols-3 gap-[4px] md:gap-[6px]">
        {media.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-[8px] bg-card md:rounded-[12px]"
            onClick={() => {
              if (item.isLocked) return;
              const unlockedIdx = unlocked.findIndex((m) => m.id === item.id);
              if (unlockedIdx >= 0) setViewerIdx(unlockedIdx);
            }}
          >
            {item.type === 'VIDEO' ? (
              <VideoThumbnail
                src={item.url}
                fallback={item.thumbnail || undefined}
                className={`h-full w-full object-cover ${item.isLocked ? 'blur-xl' : ''}`}
              />
            ) : (
              <img
                src={item.url}
                alt=""
                className={`h-full w-full object-cover ${item.isLocked ? 'blur-xl' : ''}`}
              />
            )}
            {item.type === 'VIDEO' && !item.isLocked && (
              <div className="absolute bottom-[6px] left-[6px] flex items-center gap-[4px] rounded-[4px] bg-black/60 px-[6px] py-[2px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-[10px] text-white">Video</span>
              </div>
            )}
            {item.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="opacity-80">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {viewerIdx !== null && (
        <MediaViewer
          media={unlocked.map((m) => ({ id: m.id, url: m.url, type: m.type as 'IMAGE' | 'VIDEO' }))}
          initialIndex={viewerIdx}
          onClose={() => setViewerIdx(null)}
        />
      )}
    </>
  );
}
