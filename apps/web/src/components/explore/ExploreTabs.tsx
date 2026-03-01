export type ExploreTab = 'all' | 'creators' | 'posts' | 'hashtags';

const TABS: { key: ExploreTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'creators', label: 'Creators' },
  { key: 'posts', label: 'Posts' },
  { key: 'hashtags', label: 'Hashtags' },
];

interface Props {
  active: ExploreTab;
  onChange: (tab: ExploreTab) => void;
}

export function ExploreTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-[4px] rounded-[12px] bg-muted p-[4px]">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 rounded-[10px] py-[10px] text-[14px] font-medium transition-colors ${
            active === t.key
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
