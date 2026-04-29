import { useState } from 'react';
import { useNotificationsPage } from '../hooks/useNotificationsPage';
import { NotificationRow } from '../components/notifications/NotificationRow';
import type { Notification } from '../components/notifications/NotificationRow';

function BulkActionBar({
  allSelected,
  selectedSize,
  isArchiveTab,
  onToggleAll,
  onBulkArchive,
  onBulkDelete,
}: {
  allSelected: boolean;
  selectedSize: number;
  isArchiveTab: boolean;
  onToggleAll: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
}) {
  return (
    <div className="mt-[12px] flex items-center gap-[10px] border-b border-muted pb-[12px]">
      <button
        onClick={onToggleAll}
        className="flex items-center gap-[6px] text-[12px] text-muted-foreground hover:text-foreground"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          {allSelected ? (
            <>
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
        {allSelected ? 'Deselect all' : 'Select all'}
      </button>
      {selectedSize > 0 && (
        <>
          <span className="text-[12px] text-muted-foreground">{selectedSize} selected</span>
          {!isArchiveTab && (
            <button
              onClick={onBulkArchive}
              className="rounded-[50px] bg-muted px-[12px] py-[5px] text-[12px] font-medium text-foreground hover:bg-muted-foreground/20"
            >
              Archive selected
            </button>
          )}
          <button
            onClick={onBulkDelete}
            className="rounded-[50px] bg-red-500/10 px-[12px] py-[5px] text-[12px] font-medium text-red-400 hover:bg-red-500/20"
          >
            Delete selected
          </button>
        </>
      )}
    </div>
  );
}

const FILTER_TABS = ['All', 'Likes', 'Comments', 'Follows', 'Tips', 'System', 'Archived'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function Notifications() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const {
    loading,
    grouped,
    selected,
    isArchiveTab,
    items,
    handleDelete,
    handleArchive,
    handleMarkRead,
    handleMarkAllRead,
    handleBulkArchive,
    handleBulkDelete,
    allSelected,
    toggleSelect,
    toggleSelectAll,
    setSelected,
  } = useNotificationsPage(activeTab, search);

  const totalFiltered = grouped.reduce((acc, g) => acc + g.items.length, 0);
  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="rounded-[22px] bg-card p-[16px] md:p-[22px]">
        <div className="flex items-center gap-[10px] rounded-[52px] bg-muted py-[8px] pl-[10px] pr-[10px] md:py-[10px] md:pl-[15px]">
          <img
            src="/icons/dashboard/search.svg"
            alt=""
            className="size-[21px] shrink-0 md:size-[24px]"
          />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground md:text-[16px]"
          />
        </div>

        <div className="mt-[16px] flex items-center justify-between">
          <p className="text-[20px] text-foreground">Notifications</p>
          {hasUnread && !isArchiveTab && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[6px] text-[12px] font-medium text-white transition-opacity hover:opacity-90 md:text-[14px]"
            >
              Mark All Read
            </button>
          )}
        </div>

        <div className="mt-[12px] flex gap-[8px] overflow-x-auto pb-[4px]">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelected(new Set());
              }}
              className={`shrink-0 rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium transition-colors md:text-[14px] ${activeTab === tab ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {totalFiltered > 0 && (
          <BulkActionBar
            allSelected={allSelected}
            selectedSize={selected.size}
            isArchiveTab={isArchiveTab}
            onToggleAll={toggleSelectAll}
            onBulkArchive={() => handleBulkArchive(Array.from(selected))}
            onBulkDelete={() => handleBulkDelete(Array.from(selected))}
          />
        )}

        <div className="mt-[16px]">
          {loading ? (
            <div className="flex justify-center py-[60px]">
              <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            </div>
          ) : totalFiltered === 0 ? (
            <p className="py-[40px] text-center text-[16px] text-muted-foreground">
              {search.trim()
                ? 'No matching notifications'
                : isArchiveTab
                  ? 'No archived notifications'
                  : 'No notifications'}
            </p>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {grouped.map((group) => (
                <div key={group.label}>
                  <p className="mb-[8px] text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    {group.items.map((n: Notification) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        isSelected={selected.has(n.id)}
                        onToggleSelect={toggleSelect}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
