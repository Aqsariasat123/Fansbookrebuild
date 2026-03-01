import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter, AdminDateRange } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { auditLogColumns, actionFilterOptions } from './auditLogColumns';

export default function AdminAuditLog() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
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
          options={actionFilterOptions}
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
        <AdminTable columns={auditLogColumns} data={items} />
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
