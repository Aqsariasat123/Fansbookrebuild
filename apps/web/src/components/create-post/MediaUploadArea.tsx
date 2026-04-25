const MAX_FILES = 10;

export function MediaUploadArea({
  images,
  onRemove,
  onPickFiles,
}: {
  images: { preview: string; file: File }[];
  onRemove: (i: number) => void;
  onPickFiles: () => void;
}) {
  const atLimit = images.length >= MAX_FILES;

  if (images.length === 0) {
    return (
      <div
        onClick={onPickFiles}
        className="mt-[16px] flex h-[300px] cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-border bg-muted transition-colors hover:border-[#01adf1]/50"
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
          <p className="text-[12px] text-muted-foreground/60">
            Up to {MAX_FILES} files · 50 MB each
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[16px] flex flex-col gap-[10px]">
      <div className="grid grid-cols-2 gap-[8px] md:grid-cols-3">
        {images.map((img, i) => {
          const isVideo = img.file.type.startsWith('video/');
          return (
            <div key={i} className="relative overflow-hidden rounded-[12px]">
              {isVideo ? (
                <video
                  src={img.preview}
                  className="w-full rounded-[12px]"
                  controls
                  preload="metadata"
                />
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
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPickFiles}
          disabled={atLimit}
          className="flex items-center gap-[6px] rounded-[8px] border border-border px-[14px] py-[7px] text-[13px] text-foreground transition-colors hover:border-[#01adf1]/60 hover:text-[#01adf1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add more
        </button>
        <p className={`text-[12px] ${atLimit ? 'text-amber-400' : 'text-muted-foreground/60'}`}>
          {images.length}/{MAX_FILES} files
          {atLimit && ' — limit reached'}
        </p>
      </div>
    </div>
  );
}
