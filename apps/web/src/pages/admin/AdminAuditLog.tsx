import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';

interface AuditEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: unknown;
  ipAddress: string | null;
  createdAt: string;
  admin: { id: string; username: string; displayName: string };
  [key: string]: unknown;
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-[#28a745]',
  UPDATE: 'bg-[#f0ad4e]',
  DELETE: 'bg-[#dc3545]',
};

const fmt = (d: string) => {
  const dt = new Date(d);
  return `${dt.toLocaleDateString()}\n${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const columns = [
  {
    key: 'createdAt',
    header: 'Date & Time',
    render: (r: AuditEntry) => <span className="whitespace-pre-wrap">{fmt(r.createdAt)}</span>,
  },
  {
    key: 'admin',
    header: 'Admin',
    render: (r: AuditEntry) => {
      const admin = r.admin as { username: string; displayName: string };
      return <span className="font-medium">{admin?.displayName || admin?.username || '-'}</span>;
    },
  },
  {
    key: 'action',
    header: 'Action',
    render: (r: AuditEntry) => (
      <span
        className={`inline-flex h-[19px] items-center rounded-[26px] px-[8px] text-[10px] font-medium text-[#f8f8f8] ${actionColors[r.action] || 'bg-[#5d5d5d]'}`}
      >
        {r.action}
      </span>
    ),
  },
  {
    key: 'targetType',
    header: 'Target',
    render: (r: AuditEntry) => <span className="text-[#15191c]">{r.targetType || '-'}</span>,
  },
  {
    key: 'details',
    header: 'Details',
    render: (r: AuditEntry) => {
      const d = r.details;
      if (!d) return <span className="text-[#5d5d5d]">-</span>;
      const str = JSON.stringify(d);
      return (
        <span className="text-[#5d5d5d]" title={str}>
          {str.length > 40 ? str.slice(0, 40) + '…' : str}
        </span>
      );
    },
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (r: AuditEntry) => <span className="text-[#5d5d5d]">{r.ipAddress || '-'}</span>,
  },
];

export default function AdminAuditLog() {
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (action) params.set('action', action);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    api
      .get(`/admin/audit-log?${params}`)
      .then(({ data: res }) => {
        if (res.success) {
          setItems(res.data.items);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, action, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !didLoad.current)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Audit Log</p>

      <AdminSearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      >
        <AdminFilter
          label="All Actions"
          value={action}
          onChange={(v) => {
            setAction(v);
            setPage(1);
          }}
          options={[
            { value: 'CREATE', label: 'Create' },
            { value: 'UPDATE', label: 'Update' },
            { value: 'DELETE', label: 'Delete' },
          ]}
        />
        <AdminDateRange
          from={dateFrom}
          to={dateTo}
          onFromChange={(v) => {
            setDateFrom(v);
            setPage(1);
          }}
          onToChange={(v) => {
            setDateTo(v);
            setPage(1);
          }}
          onClear={() => {
            setDateFrom('');
            setDateTo('');
            setPage(1);
          }}
        />
      </AdminSearchBar>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <AdminTable columns={columns} data={items as unknown as Record<string, unknown>[]} />
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
