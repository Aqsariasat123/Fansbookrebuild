import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { ConfirmStatusModal } from '../../components/admin/ConfirmStatusModal';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
  avatarUrl: string | null;
  [key: string]: unknown;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    api
      .get(`/admin/users?${params}`)
      .then(({ data: r }) => {
        setUsers(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setUsers([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, roleFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleStatus = async () => {
    if (!confirmUser) return;
    const newStatus = confirmUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await api.put(`/admin/users/${confirmUser.id}/status`, { status: newStatus });
    setConfirmUser(null);
    fetchUsers();
  };

  const handleImpersonate = async (user: User) => {
    try {
      const { data: r } = await api.post(`/admin/users/${user.id}/impersonate`);
      if (r.success)
        window.open(
          `${window.location.origin}/feed?impersonate=${r.data.accessToken}&user=${encodeURIComponent(r.data.user.username)}`,
          '_blank',
        );
    } catch {
      /* ignore */
    }
  };

  const fmt = (d: string) => {
    const dt = new Date(d);
    return `${dt.toLocaleDateString()}\n${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const columns = [
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (u: User) => <span className="whitespace-pre-wrap">{fmt(u.createdAt)}</span>,
    },
    { key: 'displayName', header: 'Name', render: (u: User) => u.displayName || u.username },
    { key: 'email', header: 'Email / Phone No.' },
    {
      key: 'role',
      header: 'Type',
      render: (u: User) => (
        <span
          className={`inline-flex h-[19px] items-center rounded-[26px] px-[6px] text-[10px] text-[#f8f8f8] ${u.role === 'CREATOR' ? 'bg-[#28a745]' : 'bg-[#2093ff]'}`}
        >
          {u.role === 'CREATOR' ? 'Model' : 'User'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u: User) => (
        <span
          className={`text-[12px] ${(u.status || 'ACTIVE') === 'ACTIVE' ? 'text-[#28a745]' : 'text-red-500'}`}
        >
          {(u.status || 'ACTIVE') === 'ACTIVE' ? 'Active' : 'Suspended'}
        </span>
      ),
    },
    {
      key: 'contract',
      header: 'Contract',
      render: () => <span className="text-[12px] text-[#15191c]">Sign</span>,
    },
    {
      key: 'userAction',
      header: 'User Action',
      render: () => <span className="text-[12px] text-[#28a745]">Approved</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (u: User) => (
        <div className="flex items-center gap-[5px]">
          <button onClick={() => setConfirmUser(u)} title="Edit">
            <img src="/icons/admin/pencil.png" alt="Edit" className="size-[20px]" />
          </button>
          <button title="View">
            <img src="/icons/admin/eye.png" alt="View" className="size-[20px]" />
          </button>
          {u.role !== 'ADMIN' && (
            <button
              onClick={() => handleImpersonate(u)}
              title="Impersonate"
              className="rounded bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[8px] py-[3px] text-[10px] text-white"
            >
              Login As
            </button>
          )}
        </div>
      ),
    },
  ];

  const spinner = (
    <div className="flex justify-center py-20">
      <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
    </div>
  );

  if (loading && !didLoad.current) return spinner;

  return (
    <div>
      <p className="mb-[12px] font-outfit text-[20px] font-normal text-black md:mb-[16px] md:text-[32px]">
        Users List
      </p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="All user"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'FAN', label: 'User' },
            { value: 'CREATOR', label: 'Model' },
          ]}
        />
        <AdminFilter
          label="All contract"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'ACTIVE', label: 'Active' },
            { value: 'SUSPENDED', label: 'Suspended' },
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
      {loading ? spinner : <AdminTable columns={columns} data={users} />}
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {confirmUser && (
        <ConfirmStatusModal onConfirm={toggleStatus} onCancel={() => setConfirmUser(null)} />
      )}
    </div>
  );
}
