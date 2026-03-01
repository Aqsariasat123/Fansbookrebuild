import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar, AdminFilter } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';

interface ContentPost {
  id: string;
  authorName: string;
  authorUsername: string;
  text: string;
  mediaCount: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminContent() {
  const [items, setItems] = useState<ContentPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    api
      .get(`/admin/content/posts?${params}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/admin/content/posts/${id}`);
    fetchPosts();
  };

  const handleRestore = async (id: string) => {
    await api.put(`/admin/content/posts/${id}/restore`);
    fetchPosts();
  };

  const columns = [
    { key: 'authorName', header: 'Author' },
    { key: 'text', header: 'Text' },
    {
      key: 'mediaCount',
      header: 'Media',
      render: (r: ContentPost) => <span>{r.mediaCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: ContentPost) => (
        <span
          className={`text-[12px] ${r.status === 'Active' ? 'text-[#28a745]' : 'text-[#dc3545]'}`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (r: ContentPost) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r: ContentPost) =>
        r.status === 'Active' ? (
          <button
            onClick={() => handleDelete(r.id)}
            className="rounded bg-[#dc3545] px-3 py-1 text-[12px] text-white"
          >
            Delete
          </button>
        ) : (
          <button
            onClick={() => handleRestore(r.id)}
            className="rounded bg-[#28a745] px-3 py-1 text-[12px] text-white"
          >
            Restore
          </button>
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
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">Content Moderation</p>
      <AdminSearchBar value={search} onChange={setSearch}>
        <AdminFilter
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'deleted', label: 'Deleted' },
          ]}
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
