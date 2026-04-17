import { useRef } from 'react';

export function ImagePicker({
  images,
  onAdd,
  onRemove,
}: {
  images: { file: File; preview: string }[];
  onAdd: (files: File[]) => void;
  onRemove: (idx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAdd(Array.from(e.target.files || []));
  };

  return (
    <div>
      <label className="text-[13px] text-muted-foreground">Images (up to 10)</label>
      <div className="mt-[4px] flex flex-wrap gap-[8px]">
        {images.map((img, i) => (
          <div key={i} className="relative size-[80px] overflow-hidden rounded-[8px]">
            <img src={img.preview} alt="" className="size-full object-cover" />
            <button
              onClick={() => onRemove(i)}
              className="absolute right-[2px] top-[2px] flex size-[20px] items-center justify-center rounded-full bg-black/60 text-white"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {images.length < 10 && (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex size-[80px] items-center justify-center rounded-[8px] border-2 border-dashed border-border text-muted-foreground hover:border-[#01adf1]/50"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
