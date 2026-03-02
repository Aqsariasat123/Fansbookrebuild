import type { TextOverlay } from './StoryTextOverlay';
import type { Sticker } from './StoryStickers';

interface StoryPreviewProps {
  preview: string;
  isVideo: boolean;
  filterCss: string;
  textOverlay: TextOverlay | null;
  stickers: Sticker[];
  onClear: () => void;
}

export function StoryPreview({
  preview,
  isVideo,
  filterCss,
  textOverlay,
  stickers,
  onClear,
}: StoryPreviewProps) {
  return (
    <div className="relative">
      {isVideo ? (
        <video
          src={preview}
          className="w-full rounded-[16px]"
          style={{ filter: filterCss || undefined }}
          controls
        />
      ) : (
        <div className="relative overflow-hidden rounded-[16px]">
          <img
            src={preview}
            alt="Preview"
            className="w-full object-cover"
            style={{ filter: filterCss || undefined }}
          />
          {/* Text overlay */}
          {textOverlay && (
            <div
              className="pointer-events-none absolute select-none font-bold"
              style={{
                left: `${textOverlay.x}%`,
                top: `${textOverlay.y}%`,
                transform: 'translate(-50%, -50%)',
                color: textOverlay.color,
                fontSize: `${textOverlay.fontSize}px`,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {textOverlay.text}
            </div>
          )}
          {/* Sticker overlays */}
          {stickers.map((s, i) => (
            <div
              key={i}
              className="pointer-events-none absolute select-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${s.size}px`,
              }}
            >
              {s.emoji}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onClear}
        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
