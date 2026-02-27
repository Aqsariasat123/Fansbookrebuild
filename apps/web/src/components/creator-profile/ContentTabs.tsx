export type ContentTab = 'feed' | 'photos' | 'videos';

const TABS: { key: ContentTab; label: string }[] = [
  { key: 'feed', label: 'Feed' },
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
];

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
  return (
    <div className="flex border-b border-[#2a2d30]">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`flex-1 py-[12px] text-center text-[13px] font-medium transition-colors md:py-[16px] md:text-[16px] ${
            activeTab === t.key
              ? 'border-b-2 border-[#01adf1] text-[#01adf1]'
              : 'text-[#5d5d5d] hover:text-[#a0a0a0]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
