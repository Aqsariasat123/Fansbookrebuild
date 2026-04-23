export type ContentTab = 'feed' | 'photos' | 'videos';

const TABS: { key: ContentTab; label: string }[] = [
  { key: 'feed', label: 'Feed' },
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
];

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  postCount?: number;
  mediaCount?: number;
}

export function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
  return (
    <div className="flex border-b border-border">
      {TABS.map((t) => {
        const active = activeTab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`relative flex flex-1 items-center justify-center py-[12px] text-[13px] font-medium transition-colors md:py-[16px] md:text-[15px] ${
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
