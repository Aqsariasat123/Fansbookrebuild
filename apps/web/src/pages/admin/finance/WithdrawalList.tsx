import { useState, useEffect, useCallback, useRef } from 'react';
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
  selected?: boolean;
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
  const didLoad = useRef(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulk = async (action: 'approve' | 'reject') => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await api.post(`/admin/finance/withdrawals/bulk-${action}`, { ids: Array.from(selected) });
      setSelected(new Set());
      fetch();
    } catch {
      /* ignore */
    }
    setBulkLoading(false);
  };

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
      key: 'select',
      header: '',
      render: (w: W) =>
        w.status === 'PENDING' ? (
          <input
            type="checkbox"
            checked={selected.has(w.id)}
            onChange={() => toggleSelect(w.id)}
            className="size-4 accent-[#01adf1]"
          />
        ) : null,
      className: 'w-[40px]',
    },
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

  if (loading && !didLoad.current)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[12px] font-outfit text-[20px] font-normal text-black md:mb-[16px] md:text-[32px]">
        Finance {'>'} Withdrawal List
      </p>
      {selected.size > 0 && (
        <div className="mb-[12px] flex items-center gap-[10px] rounded-[12px] bg-[#f0f8ff] p-[12px]">
          <span className="font-outfit text-[14px] text-black">{selected.size} selected</span>
          <button
            onClick={() => handleBulk('approve')}
            disabled={bulkLoading}
            className="rounded-[80px] bg-[#28a745] px-[16px] py-[6px] font-outfit text-[12px] text-white disabled:opacity-50"
          >
            Bulk Approve
          </button>
          <button
            onClick={() => handleBulk('reject')}
            disabled={bulkLoading}
            className="rounded-[80px] bg-[#dc3545] px-[16px] py-[6px] font-outfit text-[12px] text-white disabled:opacity-50"
          >
            Bulk Reject
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-outfit text-[12px] text-[#5d5d5d] underline"
          >
            Clear
          </button>
        </div>
      )}
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
