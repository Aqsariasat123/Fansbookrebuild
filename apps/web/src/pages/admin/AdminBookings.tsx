import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';

interface Booking {
  id: string;
  date: string;
  fanName: string;
  creatorName: string;
  timeSlot: string;
  status: string;
  coins: number;
  refundStatus: string;
  callTime: string;
  [key: string]: unknown;
}

export default function AdminBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [refundFilter, setRefundFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);

  const fetch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (refundFilter) params.set('refundStatus', refundFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    api
      .get(`/admin/bookings?${params}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, refundFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    {
      key: 'date',
      header: 'Booking Date',
      render: (b: Booking) => new Date(b.date).toLocaleDateString(),
    },
    { key: 'fanName', header: 'User Name' },
    { key: 'creatorName', header: 'Model Name' },
    { key: 'timeSlot', header: 'Booking Slot' },
    {
      key: 'status',
      header: 'Status',
      render: (b: Booking) => (
        <span
          className={`text-[12px] ${b.status === 'COMPLETED' ? 'text-[#28a745]' : b.status === 'REJECTED' ? 'text-red-500' : 'text-[#ff9800]'}`}
        >
          {b.status}
        </span>
      ),
    },
    { key: 'coins', header: 'Coins', render: (b: Booking) => String(b.coins || 0) },
    {
      key: 'refundStatus',
      header: 'Refund Status',
      render: (b: Booking) => (
        <span
          className={`text-[12px] ${b.refundStatus === 'Refunded' ? 'text-[#28a745]' : 'text-[#5d5d5d]'}`}
        >
          {b.refundStatus || 'N/A'}
        </span>
      ),
    },
    { key: 'callTime', header: 'Call Time', render: (b: Booking) => b.callTime || '-' },
  ];

  if (loading && !didLoad.current)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Booking List</p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="Refund Status"
          value={refundFilter}
          onChange={setRefundFilter}
          options={[
            { value: 'Refunded', label: 'Refunded' },
            { value: 'None', label: 'None' },
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
