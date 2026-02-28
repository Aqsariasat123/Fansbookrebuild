export type ContentTab = 'feed' | 'photos' | 'videos';

const TABS: { key: ContentTab; label: string; icon: string }[] = [
  {
    key: 'feed',
    label: 'Posts',
    icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  },
  {
    key: 'photos',
    label: 'Media',
    icon: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
  },
];

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
  postCount?: number;
  mediaCount?: number;
}

export function ContentTabs({
  activeTab,
  onTabChange,
  postCount = 0,
  mediaCount = 0,
}: ContentTabsProps) {
  const counts = [postCount, mediaCount];
  return (
    <div className="flex border-b border-border">
      {TABS.map((t, i) => {
        const active = activeTab === t.key || (t.key === 'photos' && activeTab === 'videos');
        const tabKey = t.key === 'feed' ? 'feed' : activeTab === 'videos' ? 'videos' : 'photos';
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(tabKey as ContentTab)}
            className={`flex flex-1 items-center justify-center gap-[8px] py-[12px] text-[13px] font-medium transition-colors md:py-[16px] md:text-[15px] ${
              active
                ? 'border-b-[3px] border-[#e91e8c] text-[#e91e8c]'
                : 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d={t.icon} />
            </svg>
            {counts[i] > 0 ? `${counts[i]} ${t.label}` : t.label}
          </button>
        );
      })}
    </div>
  );
}
