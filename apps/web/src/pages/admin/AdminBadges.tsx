import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { BadgeFormModal, AwardModal } from '../../components/admin/BadgeModals';
import type { FormState } from '../../components/admin/BadgeModals';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  category: string;
  earnedCount: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function AdminBadges() {
  const [items, setItems] = useState<BadgeItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false);
  const [editBadge, setEditBadge] = useState<BadgeItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAward, setShowAward] = useState<string | null>(null);

  const fetchBadges = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (search) params.set('search', search);
    api
      .get(`/admin/badges?${params}`)
      .then(({ data: r }) => {
        setItems(r.data.items);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false);
        didLoad.current = true;
      });
  }, [page, search]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const handleSave = async (form: FormState) => {
    if (editBadge) await api.put(`/admin/badges/${editBadge.id}`, form);
    else await api.post('/admin/badges', form);
    setShowForm(false);
    fetchBadges();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this badge?')) return;
    await api.delete(`/admin/badges/${id}`);
    fetchBadges();
  };

  const columns = [
    {
      key: 'icon',
      header: 'Icon',
      render: (b: BadgeItem) => <span className="text-xl">{b.icon}</span>,
    },
    { key: 'name', header: 'Name' },
    { key: 'rarity', header: 'Rarity' },
    { key: 'category', header: 'Category' },
    {
      key: 'earnedCount',
      header: 'Earned By',
      render: (b: BadgeItem) => <span>{b.earnedCount} users</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (b: BadgeItem) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditBadge(b);
              setShowForm(true);
            }}
            className="rounded bg-[#01adf1] px-3 py-1 text-[12px] text-white"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="rounded bg-[#dc3545] px-3 py-1 text-[12px] text-white"
          >
            Delete
          </button>
          <button
            onClick={() => setShowAward(b.id)}
            className="rounded bg-[#28a745] px-3 py-1 text-[12px] text-white"
          >
            Award
          </button>
        </div>
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
      <div className="mb-[16px] flex items-center justify-between">
        <p className="font-outfit text-[32px] font-normal text-black">Badge Management</p>
        <button
          onClick={() => {
            setEditBadge(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-[#01adf1] px-4 py-2 text-sm text-white"
        >
          + Add Badge
        </button>
      </div>
      <AdminSearchBar value={search} onChange={setSearch} />
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <AdminTable columns={columns} data={items} />
      )}
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      {showForm && (
        <BadgeFormModal badge={editBadge} onClose={() => setShowForm(false)} onSave={handleSave} />
      )}
      {showAward && <AwardModal badgeId={showAward} onClose={() => setShowAward(null)} />}
    </div>
  );
}
