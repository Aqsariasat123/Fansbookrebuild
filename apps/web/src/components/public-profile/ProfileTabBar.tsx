export type ContentTab = 'feed' | 'media';

export function ProfileTabBar({
  activeTab,
  onTabChange,
  postsCount = 0,
  mediaCount = 0,
}: {
  activeTab: ContentTab;
  onTabChange: (t: ContentTab) => void;
  postsCount?: number;
  mediaCount?: number;
}) {
  const tabs = [
    { key: 'feed' as ContentTab, label: `${postsCount} Posts` },
    { key: 'media' as ContentTab, label: `${mediaCount} Media` },
  ];

  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`-mb-px border-b-2 px-[20px] py-[14px] text-[15px] font-medium transition-colors ${
            activeTab === tab.key
              ? 'border-[#01adf1] text-[#01adf1]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
