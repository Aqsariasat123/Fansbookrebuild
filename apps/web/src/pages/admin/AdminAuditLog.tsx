import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
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
}

const columns = [
  {
    key: 'admin',
    header: 'Admin',
    render: (r: Record<string, unknown>) => {
      const admin = r.admin as { username: string; displayName: string };
      return admin?.displayName || admin?.username || '-';
    },
  },
  { key: 'action', header: 'Action' },
  { key: 'targetType', header: 'Target' },
  { key: 'targetId', header: 'Target ID' },
  {
    key: 'details',
    header: 'Details',
    render: (r: Record<string, unknown>) => {
      const d = r.details;
      if (!d) return '-';
      const str = JSON.stringify(d);
      return str.length > 50 ? str.slice(0, 50) + '...' : str;
    },
  },
  { key: 'ipAddress', header: 'IP' },
  {
    key: 'createdAt',
    header: 'Timestamp',
    render: (r: Record<string, unknown>) => {
      const d = r.createdAt as string;
      return d ? new Date(d).toLocaleString() : '-';
    },
  },
];

export default function AdminAuditLog() {
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search });
    if (action) params.set('action', action);
    api
      .get(`/admin/audit-log?${params}`)
      .then(({ data: res }) => {
        if (res.success) {
          setItems(res.data.items);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, action]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Audit Log</p>

      <div className="flex items-center gap-[12px] mb-[16px] flex-wrap">
        <AdminSearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[8px] font-outfit text-[13px] text-black"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-6 animate-spin rounded-full border-3 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <AdminTable columns={columns} data={items as unknown as Record<string, unknown>[]} />
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
