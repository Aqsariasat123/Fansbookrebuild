export function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: 'list' | 'grid';
  onChange: (m: 'list' | 'grid') => void;
}) {
  const cls = (active: boolean) =>
    `rounded-[6px] p-[6px] transition-colors ${active ? 'bg-card text-foreground' : 'text-muted-foreground'}`;
  return (
    <div className="flex gap-[4px] rounded-[8px] bg-muted p-[4px]">
      <button
        onClick={() => onChange('list')}
        className={cls(viewMode === 'list')}
        title="List view"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </button>
      <button
        onClick={() => onChange('grid')}
        className={cls(viewMode === 'grid')}
        title="Grid view"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
        </svg>
      </button>
    </div>
  );
}
