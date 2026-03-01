import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';
import { AdminTable } from '../../../components/admin/AdminTable';
import { AdminSearchBar, AdminDateRange } from '../../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../../components/admin/AdminPagination';

interface W1099 {
  id: string;
  userName: string;
  formType: string;
  status: string;
  amount: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function W1099List() {
  const [items, setItems] = useState<W1099[]>([]);
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
      .get(`/admin/finance/w1099?${p}`)
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
    { key: 'userName', header: 'Model Name' },
    { key: 'formType', header: 'Form Type' },
    {
      key: 'amount',
      header: 'Amount',
      render: (w: W1099) => `$${Number(w.amount || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (w: W1099) => (
        <span
          className={`text-[12px] ${w.status === 'Submitted' ? 'text-[#28a745]' : 'text-[#ff9800]'}`}
        >
          {w.status || 'Pending'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (w: W1099) => new Date(w.createdAt).toLocaleDateString(),
    },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <button title="View">
          <img src="/icons/admin/eye.png" alt="View" className="size-[20px]" />
        </button>
      ),
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
        Finance {'>'} W1099 NEC
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
