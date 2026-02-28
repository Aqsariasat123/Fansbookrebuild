import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { EarningsMobileCards, EarningsTable } from './CreatorEarningsParts';
import type { EarningItem } from './CreatorEarningsParts';

const CATEGORIES = [
  'All',
  'Chat',
  'One-to-one call',
  'Tip',
  'Referral',
  'Subscription',
  'Post Purchased',
];

export default function CreatorEarnings() {
  const [items, setItems] = useState<EarningItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    api
      .get('/creator/earnings', { params })
      .then(({ data: r }) => {
        if (r.success) {
          setItems(r.data.items ?? []);
          setTotal(r.data.total ?? 0);
        }
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, category, search, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [search, category, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-foreground">My Earning</p>

      {/* Filters */}
      <div className="flex flex-col gap-[12px] rounded-[16px] bg-card p-[20px]">
        <div className="flex items-center gap-[10px] rounded-[52px] bg-muted px-[16px] py-[10px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-[12px]">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-[8px] rounded-[8px] border border-border px-[14px] py-[8px] text-[14px] text-foreground"
            >
              {category}{' '}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 top-[40px] z-20 min-w-[180px] rounded-[8px] bg-white py-[4px] shadow-lg">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCategory(c);
                        setDropdownOpen(false);
                      }}
                      className="flex w-full px-[14px] py-[8px] text-[14px] text-[#1a1a1a] hover:bg-[#f0f0f0]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-muted-foreground">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-[6px] border border-border bg-transparent px-[10px] py-[6px] text-[13px] text-foreground outline-none"
            />
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-muted-foreground">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-[6px] border border-border bg-transparent px-[10px] py-[6px] text-[13px] text-foreground outline-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="rounded-[50px] bg-[#01adf1] px-[14px] py-[6px] text-[13px] text-white"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-[12px] md:hidden">
        {loading ? (
          <div className="flex justify-center py-[40px]">
            <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-[40px] text-center text-[14px] text-muted-foreground">No earnings yet</p>
        ) : (
          <EarningsMobileCards items={items} />
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-[16px] md:block">
        <EarningsTable items={items} loading={loading} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-[6px]">
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`flex size-[32px] items-center justify-center rounded-[4px] text-[13px] ${page === i + 1 ? 'bg-[#01adf1] text-white' : 'bg-card text-muted-foreground hover:text-foreground'}`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 6 && <span className="text-[13px] text-muted-foreground">...</span>}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-[4px] bg-card px-[12px] py-[6px] text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
