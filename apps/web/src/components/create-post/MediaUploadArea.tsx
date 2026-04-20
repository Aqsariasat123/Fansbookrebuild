export function MediaUploadArea({
  images,
  onRemove,
  onPickFiles,
}: {
  images: { preview: string; file: File }[];
  onRemove: (i: number) => void;
  onPickFiles: () => void;
}) {
  if (images.length === 0) {
    return (
      <div
        onClick={onPickFiles}
        className="mt-[16px] flex h-[300px] cursor-pointer items-center justify-center rounded-[16px] border-2 border-dashed border-border bg-muted transition-colors hover:border-border"
      >
        <div className="flex flex-col items-center gap-[12px]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="text-[14px] text-muted-foreground">Click to add photos or videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[16px] grid grid-cols-2 gap-[8px] md:grid-cols-3">
      {images.map((img, i) => {
        const isVideo = img.file.type.startsWith('video/');
        return (
          <div key={i} className="relative aspect-square overflow-hidden rounded-[12px]">
            {isVideo ? (
              <video src={img.preview} className="size-full object-cover" muted />
            ) : (
              <img src={img.preview} alt="" className="size-full object-cover" />
            )}
            <button
              onClick={() => onRemove(i)}
              className="absolute right-[6px] top-[6px] flex size-[24px] items-center justify-center rounded-full bg-black/60 text-white"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {isVideo && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex size-[40px] items-center justify-center rounded-full bg-black/50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
