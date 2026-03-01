import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';

interface Report {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminReports() {
  const [items, setItems] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    api
      .get(`/admin/reports?${params}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const columns = [
    { key: 'reporterName', header: 'Reported By' },
    {
      key: 'createdAt',
      header: 'Date',
      render: (r: Report) => new Date(r.createdAt).toLocaleDateString(),
    },
    { key: 'reportedName', header: 'Reported To' },
    { key: 'reason', header: 'Type' },
    {
      key: 'status',
      header: 'Action',
      render: (r: Report) => (
        <span
          className={`text-[12px] ${r.status === 'RESOLVED' ? 'text-[#28a745]' : r.status === 'DISMISSED' ? 'text-[#5d5d5d]' : 'text-[#ff9800]'}`}
        >
          {r.status === 'OPEN' ? 'Pending' : r.status}
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
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Report List</p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="Admin Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'OPEN', label: 'Pending' },
            { value: 'RESOLVED', label: 'Resolved' },
            { value: 'DISMISSED', label: 'Dismissed' },
          ]}
        />
        <AdminFilter
          label="All Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'SPAM', label: 'Spam' },
            { value: 'HARASSMENT', label: 'Harassment' },
            { value: 'NUDITY', label: 'Nudity' },
            { value: 'COPYRIGHT', label: 'Copyright' },
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
