import { useCallback, useEffect, useState } from 'react';

interface MediaItem {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface MediaViewerProps {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export function MediaViewer({ media, initialIndex, onClose }: MediaViewerProps) {
  const [idx, setIdx] = useState(initialIndex);
  const item = media[idx];
  const hasPrev = idx > 0;
  const hasNext = idx < media.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) setIdx((i) => i + 1);
  }, [hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) setIdx((i) => i - 1);
  }, [hasPrev]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Counter */}
      {media.length > 1 && (
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {idx + 1} / {media.length}
        </div>
      )}

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Media - full screen for video */}
      <div
        className={
          item.type === 'VIDEO'
            ? 'h-full w-full max-w-[100vw] md:h-[95vh] md:w-[85vw] md:max-w-[1200px]'
            : 'max-h-[90vh] max-w-[90vw]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'VIDEO' ? (
          <video
            key={item.id}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="h-full w-full rounded-none object-contain md:rounded-xl"
          />
        ) : (
          <img
            key={item.id}
            src={item.url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
        )}
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
