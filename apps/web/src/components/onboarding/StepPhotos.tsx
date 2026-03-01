import React from 'react';

export default function StepPhotos({
  avatarPreview,
  coverPreview,
  avatarRef,
  coverRef,
  onAvatar,
  onCover,
}: {
  avatarPreview: string | null;
  coverPreview: string | null;
  avatarRef: React.RefObject<HTMLInputElement | null>;
  coverRef: React.RefObject<HTMLInputElement | null>;
  onAvatar: (f: File) => void;
  onCover: (f: File) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Profile Photos</p>
      <div className="flex items-center gap-[16px]">
        <button
          onClick={() => avatarRef.current?.click()}
          className="relative size-[80px] shrink-0 overflow-hidden rounded-full bg-muted"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
        </button>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])}
        />
        <div>
          <p className="text-[14px] text-foreground">Avatar</p>
          <p className="text-[12px] text-muted-foreground">Square photo, min 200x200px</p>
        </div>
      </div>
      <button
        onClick={() => coverRef.current?.click()}
        className="relative h-[120px] w-full overflow-hidden rounded-[12px] bg-muted"
      >
        {coverPreview ? (
          <img src={coverPreview} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-[12px]">Cover Photo</p>
          </div>
        )}
      </button>
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onCover(e.target.files[0])}
      />
    </div>
  );
}
