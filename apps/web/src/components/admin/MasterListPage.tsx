import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from './AdminTable';
import { AdminSearchBar } from './AdminSearchBar';
import { AdminPagination } from './AdminPagination';

interface Column {
  key: string;
  header: string;
  render?: (row: Record<string, unknown>) => ReactNode;
}

interface Props {
  title: string;
  apiPath: string;
  columns: Column[];
  addLabel?: string;
  onAdd?: () => void;
  extraButtons?: ReactNode;
}

export function MasterListPage({ title, apiPath, columns, addLabel, onAdd, extraButtons }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) p.set('search', search);
    api
      .get(`${apiPath}?${p}`)
      .then(({ data: r }) => {
        const d = r.data;
        setItems(Array.isArray(d) ? d : d.items || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [page, search, apiPath]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">{title}</p>
      <AdminSearchBar value={search} onChange={setSearch} onAdd={onAdd} addLabel={addLabel}>
        {extraButtons}
      </AdminSearchBar>
      <AdminTable columns={columns} data={items} />
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
