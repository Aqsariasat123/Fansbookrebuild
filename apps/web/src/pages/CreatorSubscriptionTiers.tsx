import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { TierFormModal } from '../components/creator-subscriptions/TierFormModal';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
  order: number;
  subscriberCount: number;
}

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
          {/* Mobile Cards */}
          <div className="flex flex-col gap-[12px] md:hidden">
            {tiers.map((t, idx) => (
              <div key={t.id} className="rounded-[16px] bg-card p-[16px]">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium text-foreground">{t.name}</p>
                  <div className="flex items-center gap-[8px]">
                    <button
                      onClick={() => moveTier(idx, -1)}
                      disabled={idx === 0}
                      className="text-muted-foreground disabled:opacity-30"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveTier(idx, 1)}
                      disabled={idx === tiers.length - 1}
                      className="text-muted-foreground disabled:opacity-30"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                    <button onClick={() => setEditTier(t)} className="text-[#01adf1]">
                      Edit
                    </button>
                  </div>
                </div>
                <p className="mt-[4px] text-[20px] font-semibold text-[#01adf1]">
                  ${t.price.toFixed(2)}/mo
                </p>
                {t.description && (
                  <p className="mt-[4px] text-[12px] text-muted-foreground">{t.description}</p>
                )}
                {t.benefits.length > 0 && (
                  <ul className="mt-[8px] flex flex-col gap-[4px]">
                    {t.benefits.map((b, i) => (
                      <li key={i} className="text-[12px] text-foreground">
                        - {b}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-[8px] text-[11px] text-muted-foreground">
                  {t.subscriberCount} subscribers
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-[16px] md:block">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
                  {[
                    'Order',
                    'Name',
                    'Price',
                    'Description',
                    'Benefits',
                    'Subscribers',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-[14px] py-[14px] text-left text-[13px] font-semibold text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card">
                {tiers.map((t, idx) => (
                  <tr key={t.id} className="border-b border-muted last:border-0">
                    <td className="px-[14px] py-[12px]">
                      <div className="flex gap-[4px]">
                        <button
                          onClick={() => moveTier(idx, -1)}
                          disabled={idx === 0}
                          className="text-muted-foreground disabled:opacity-30"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 14l5-5 5 5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveTier(idx, 1)}
                          disabled={idx === tiers.length - 1}
                          className="text-muted-foreground disabled:opacity-30"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-[14px] py-[12px] text-[14px] text-foreground">{t.name}</td>
                    <td className="px-[14px] py-[12px] text-[14px] font-medium text-[#01adf1]">
                      ${t.price.toFixed(2)}
                    </td>
                    <td className="max-w-[200px] px-[14px] py-[12px] text-[13px] text-muted-foreground">
                      {t.description || '-'}
                    </td>
                    <td className="px-[14px] py-[12px] text-[13px] text-foreground">
                      {t.benefits.length > 0 ? t.benefits.join(', ') : '-'}
                    </td>
                    <td className="px-[14px] py-[12px] text-[14px] text-muted-foreground">
                      {t.subscriberCount}
                    </td>
                    <td className="px-[14px] py-[12px]">
                      <button
                        onClick={() => setEditTier(t)}
                        className="text-[13px] text-[#01adf1] hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
