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
