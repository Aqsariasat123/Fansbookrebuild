import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';
import { AdminTable } from '../../../components/admin/AdminTable';
import { AdminSearchBar, AdminDateRange } from '../../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../../components/admin/AdminPagination';

interface Sub {
  id: string;
  userName: string;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  [key: string]: unknown;
}

export default function SubscriptionHistory() {
  const [items, setItems] = useState<Sub[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);

  const fetch = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) p.set('search', search);
    if (dateFrom) p.set('from', dateFrom);
    if (dateTo) p.set('to', dateTo);
    api
      .get(`/admin/finance/subscriptions?${p}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (s: Sub) => new Date(s.createdAt).toLocaleDateString(),
    },
    { key: 'userName', header: 'User' },
    { key: 'planName', header: 'Plan' },
    { key: 'amount', header: 'Amount', render: (s: Sub) => `$${Number(s.amount).toFixed(2)}` },
    {
      key: 'status',
      header: 'Status',
      render: (s: Sub) => (
        <span
          className={`text-[12px] ${s.status === 'ACTIVE' ? 'text-[#28a745]' : 'text-[#5d5d5d]'}`}
        >
          {s.status}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (s: Sub) => (s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '-'),
    },
  ];

  if (loading && !didLoad.current)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Finance {'>'} Subscription History
      </p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminDateRange
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
          onClear={() => {
            setDateFrom('');
            setDateTo('');
          }}
        />
      </AdminSearchBar>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <AdminTable columns={columns} data={items} />
      )}
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
