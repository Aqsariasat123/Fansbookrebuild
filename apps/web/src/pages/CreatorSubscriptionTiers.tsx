import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { TierFormModal } from '../components/creator-subscriptions/TierFormModal';
import {
  TierMobileCards,
  TierDesktopTable,
  type Tier,
} from '../components/creator-subscriptions/TierList';

export default function CreatorSubscriptionTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTier, setEditTier] = useState<Tier | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchTiers = useCallback(() => {
    api
      .get('/creator/tiers')
      .then(({ data: res }) => {
        setTiers(Array.isArray(res.data) ? res.data : (res.data?.items ?? []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  const handleCreate = async (data: {
    name: string;
    price: number;
    description: string;
    benefits: string[];
  }) => {
    await api.post('/creator/tiers', data);
    fetchTiers();
  };

  const handleUpdate = async (data: {
    id?: string;
    name: string;
    price: number;
    description: string;
    benefits: string[];
  }) => {
    if (!data.id) return;
    await api.put(`/creator/tiers/${data.id}`, data);
    fetchTiers();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/creator/tiers/${id}`);
    fetchTiers();
  };

  const moveTier = async (idx: number, dir: -1 | 1) => {
    const newTiers = [...tiers];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newTiers.length) return;
    [newTiers[idx], newTiers[swapIdx]] = [newTiers[swapIdx], newTiers[idx]];
    setTiers(newTiers);
    await api.put('/creator/tiers/reorder', {
      items: newTiers.map((t, i) => ({ id: t.id, order: i })),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-semibold text-foreground">My Subscriptions</p>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white md:text-[14px]"
        >
          + Create Tier
        </button>
      </div>

      {tiers.length === 0 ? (
        <p className="py-[40px] text-center text-[14px] text-muted-foreground">
          No subscription tiers yet. Create one!
        </p>
      ) : (
        <>
          <TierMobileCards tiers={tiers} onMove={moveTier} onEdit={setEditTier} />
          <TierDesktopTable tiers={tiers} onMove={moveTier} onEdit={setEditTier} />
        </>
      )}

      {showCreate && <TierFormModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
      {editTier && (
        <TierFormModal
          initial={editTier}
          onSave={handleUpdate}
          onDelete={() => handleDelete(editTier.id)}
          onClose={() => setEditTier(null)}
        />
      )}
    </div>
  );
}
