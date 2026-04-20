import { useState } from 'react';

export type Visibility = 'PUBLIC' | 'SUBSCRIBERS' | 'TIER_SPECIFIC';

export const VIS_LABELS: Record<Visibility, string> = {
  PUBLIC: 'Public',
  SUBSCRIBERS: 'Followers',
  TIER_SPECIFIC: 'Tier Only',
};

export function AuthorRow({
  user,
}: {
  user: { avatar?: string | null; displayName?: string; username?: string } | null;
}) {
  return (
    <div className="flex items-center gap-[12px]">
      <img
        src={user?.avatar || '/icons/dashboard/person.svg'}
        alt=""
        className="size-[48px] rounded-full object-cover"
      />
      <div>
        <div className="flex items-center gap-[6px]">
          <p className="text-[16px] font-medium text-foreground">
            {user?.displayName || 'Creator'}
          </p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#01adf1">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <p className="text-[12px] text-muted-foreground">@{user?.username || 'username'}</p>
      </div>
    </div>
  );
}

export function VisibilityDropdown({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[6px] rounded-[20px] border border-border px-[12px] py-[4px] text-[12px] text-foreground"
      >
        {VIS_LABELS[value]}{' '}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[32px] z-20 min-w-[120px] rounded-[8px] bg-card py-[4px] shadow-lg">
            {(['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'] as Visibility[]).map((v) => (
              <button
                key={v}
                onClick={() => {
                  onChange(v);
                  setOpen(false);
                }}
                className="flex w-full px-[14px] py-[8px] text-[13px] text-foreground hover:bg-muted"
              >
                {VIS_LABELS[v]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Hashtag Panel ─────────────────────────────────────────
export function HashtagPanel({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [input, setInput] = useState('');

  function commit() {
    const tag = input.trim().replace(/^#+/, '').toLowerCase().replace(/\s+/g, '');
    if (tag && !tags.includes(tag)) onAdd(tag);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      onRemove(tags[tags.length - 1]);
    }
  }

  return (
    <div className="mt-[12px] rounded-[12px] border border-border bg-muted/40 px-[12px] py-[10px]">
      <div className="flex flex-wrap items-center gap-[6px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-[4px] rounded-full bg-[#01adf1]/15 px-[10px] py-[3px] text-[12px] text-[#01adf1]"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-[2px] text-[#01adf1]/70 hover:text-[#01adf1]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={tags.length === 0 ? 'Add hashtags… (press Enter or Space)' : ''}
          className="min-w-[180px] flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder-muted-foreground"
        />
      </div>
    </div>
  );
}

// ── Media Upload Area ─────────────────────────────────────
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
