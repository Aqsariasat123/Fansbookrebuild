import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { EarningsFilterBar } from '../components/creator-earnings/EarningsFilterBar';
import type { CategoryFilter } from '../components/creator-earnings/EarningsFilterBar';

interface EarningItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  TIP_RECEIVED: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  SUBSCRIPTION: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  PPV_EARNING: { bg: 'bg-green-500/20', text: 'text-green-400' },
  WITHDRAWAL: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

const CATEGORY_LABELS: Record<string, string> = {
  TIP_RECEIVED: 'Tip Received',
  SUBSCRIPTION: 'Subscription',
  PPV_EARNING: 'PPV Earning',
  WITHDRAWAL: 'Withdrawal',
};

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? { bg: 'bg-gray-500/20', text: 'text-gray-400' };
  const label = CATEGORY_LABELS[category] ?? category;
  return (
    <span
      className={`inline-block rounded-full px-[10px] py-[3px] text-[12px] font-medium ${colors.bg} ${colors.text}`}
    >
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const isCompleted = status === 'COMPLETED';
  return (
    <span
      className={`inline-block rounded-full px-[10px] py-[3px] text-[12px] font-medium ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
    >
      {isCompleted ? 'Completed' : 'Pending'}
    </span>
  );
}

export default function CreatorEarnings() {
  const [items, setItems] = useState<EarningItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit };
    if (category) params.category = category;
    if (search) params.search = search;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    api
      .get('/creator/earnings', { params })
      .then(({ data: r }) => {
        if (r.success) {
          setItems(r.data.items);
          setTotal(r.data.total);
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
  const hasFilters = !!(search || category || startDate || endDate);

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">My Earnings</p>

      <EarningsFilterBar
        search={search}
        onSearchChange={setSearch}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        category={category}
        onCategoryChange={setCategory}
      />

      <div className="rounded-[22px] bg-[#0e1012]">
        {loading ? (
          <div className="flex justify-center py-[60px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-[40px] text-center text-[16px] text-[#5d5d5d]">
            {hasFilters ? 'No matching earnings found' : 'No earnings yet'}
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#15191c] text-left text-[14px] text-[#5d5d5d]">
                    <th className="px-[20px] py-[16px] font-medium">Date</th>
                    <th className="px-[20px] py-[16px] font-medium">Description</th>
                    <th className="px-[20px] py-[16px] font-medium">Category</th>
                    <th className="px-[20px] py-[16px] font-medium">Amount</th>
                    <th className="px-[20px] py-[16px] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-[#15191c] last:border-b-0">
                      <td className="px-[20px] py-[14px] text-[14px] text-[#f8f8f8]">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-[20px] py-[14px] text-[14px] text-[#f8f8f8]">
                        {item.description}
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="px-[20px] py-[14px] text-[14px] font-medium text-green-400">
                        +${item.amount.toFixed(2)}
                      </td>
                      <td className="px-[20px] py-[14px]">
                        <StatusPill status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-[12px] p-[12px] md:hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-[8px] rounded-[12px] bg-[#15191c] p-[12px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#5d5d5d]">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-[14px] text-[#f8f8f8]">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={item.category} />
                    <span className="text-[14px] font-medium text-green-400">
                      +${item.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-[16px]">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-[12px] bg-[#0e1012] px-[16px] py-[8px] text-[14px] text-[#f8f8f8] transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-[14px] text-[#5d5d5d]">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-[12px] bg-[#0e1012] px-[16px] py-[8px] text-[14px] text-[#f8f8f8] transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
