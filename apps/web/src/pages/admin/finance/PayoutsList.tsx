import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';
import { AdminTable } from '../../../components/admin/AdminTable';
import {
  AdminSearchBar,
  AdminFilter,
  AdminDateRange,
} from '../../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../../components/admin/AdminPagination';

interface Payout {
  id: string;
  createdAt: string;
  type: string;
  requestId: string;
  userName: string;
  payable: number;
  commission: number;
  status: string;
  [key: string]: unknown;
}

export default function PayoutsList() {
  const [items, setItems] = useState<Payout[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
    if (statusFilter) p.set('status', statusFilter);
    if (dateFrom) p.set('from', dateFrom);
    if (dateTo) p.set('to', dateTo);
    api
      .get(`/admin/finance/payouts?${p}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    {
      key: 'createdAt',
      header: 'Created Date',
      render: (p: Payout) => new Date(p.createdAt).toLocaleDateString(),
    },
    { key: 'type', header: 'Type' },
    {
      key: 'requestId',
      header: 'Request ID',
      render: (p: Payout) => p.requestId || p.id.slice(0, 8),
    },
    { key: 'userName', header: 'User' },
    {
      key: 'payable',
      header: 'Payable',
      render: (p: Payout) => `$${Number(p.payable || 0).toFixed(2)}`,
    },
    {
      key: 'commission',
      header: 'Commission',
      render: (p: Payout) => `$${Number(p.commission || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Payout Status',
      render: (p: Payout) => (
        <span
          className={`text-[12px] ${p.status === 'Paid' ? 'text-[#28a745]' : 'text-[#ff9800]'}`}
        >
          {p.status}
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
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Finance {'>'} Payouts List
      </p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="Unpaid"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'Unpaid', label: 'Unpaid' },
            { value: 'Paid', label: 'Paid' },
          ]}
        />
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
        <button className="rounded-[6px] border border-[#15191c] px-[12px] py-[6px] font-outfit text-[14px] text-[#15191c]">
          Export
        </button>
        <button className="rounded-[6px] border border-[#15191c] px-[12px] py-[6px] font-outfit text-[14px] text-[#15191c]">
          Import
        </button>
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
