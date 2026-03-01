import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';

interface Earning {
  id: string;
  userName: string;
  userType: string;
  earningType: string;
  earning: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminEarnings() {
  const [items, setItems] = useState<Earning[]>([]);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (userFilter) params.set('userType', userFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    api
      .get(`/admin/earnings?${params}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, userFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    { key: 'userName', header: 'Name' },
    {
      key: 'userType',
      header: 'User Type',
      render: (e: Earning) => (
        <span
          className={`inline-flex h-[19px] items-center rounded-[26px] px-[6px] text-[10px] text-[#f8f8f8] ${e.userType === 'CREATOR' ? 'bg-[#28a745]' : 'bg-[#2093ff]'}`}
        >
          {e.userType === 'CREATOR' ? 'Model' : 'User'}
        </span>
      ),
    },
    { key: 'earningType', header: 'Earning Type' },
    {
      key: 'earning',
      header: 'Earning',
      render: (e: Earning) => `$${Number(e.earning).toFixed(2)}`,
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (e: Earning) => new Date(e.createdAt).toLocaleString(),
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
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Earnings List</p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="All User"
          value={userFilter}
          onChange={setUserFilter}
          options={[
            { value: 'CREATOR', label: 'Model' },
            { value: 'FAN', label: 'User' },
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
      <AdminTable columns={columns} data={items} />
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
