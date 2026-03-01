import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { AdminTable } from '../../../components/admin/AdminTable';
import { AdminSearchBar, AdminDateRange } from '../../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../../components/admin/AdminPagination';

interface W {
  id: string;
  createdAt: string;
  withdrawId: string;
  userName: string;
  tokens: number;
  commission: number;
  payable: number;
  status: string;
  [key: string]: unknown;
}

export default function WithdrawalList() {
  const [items, setItems] = useState<W[]>([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) p.set('search', search);
    if (dateFrom) p.set('from', dateFrom);
    if (dateTo) p.set('to', dateTo);
    api
      .get(`/admin/finance/withdrawals?${p}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (w: W) => new Date(w.createdAt).toLocaleDateString(),
    },
    {
      key: 'withdrawId',
      header: 'Withdraw ID',
      render: (w: W) => w.withdrawId || w.id.slice(0, 8),
    },
    { key: 'userName', header: 'User' },
    { key: 'tokens', header: 'Tokens', render: (w: W) => String(w.tokens || 0) },
    {
      key: 'commission',
      header: 'Commission',
      render: (w: W) => `$${Number(w.commission || 0).toFixed(2)}`,
    },
    {
      key: 'payable',
      header: 'Payable',
      render: (w: W) => `$${Number(w.payable || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Payment Status',
      render: (w: W) => (
        <span
          className={`text-[12px] ${w.status === 'COMPLETED' ? 'text-[#28a745]' : w.status === 'REJECTED' ? 'text-red-500' : 'text-[#ff9800]'}`}
        >
          {w.status}
        </span>
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Finance {'>'} Withdrawal List
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
      <AdminTable columns={columns} data={items} />
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
