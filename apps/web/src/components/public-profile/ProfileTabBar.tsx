export type ContentTab = 'feed' | 'photos' | 'videos';

const TABS: { key: ContentTab; label: string }[] = [
  { key: 'feed', label: 'Feed' },
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
];

export function ProfileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ContentTab;
  onTabChange: (t: ContentTab) => void;
}) {
  return (
    <div className="relative flex items-center rounded-[70px] bg-[#0e1012] p-[10px]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative z-10 flex-1 rounded-[70px] py-[12px] text-center text-[16px] font-medium transition-colors ${
            activeTab === tab.key
              ? 'bg-[#01adf1] text-white'
              : 'text-[#f8f8f8] hover:text-[#01adf1]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
