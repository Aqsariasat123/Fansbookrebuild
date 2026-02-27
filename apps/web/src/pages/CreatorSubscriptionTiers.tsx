import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Tier {
  id: string;
  name: string;
  duration: string;
  defaultPrice: number;
  price: number;
  discount: number;
  remainingUsers: number;
}

export default function CreatorSubscriptionTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/creator/tiers')
      .then(({ data: res }) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
        setTiers(
          raw.map((t: Record<string, unknown>) => ({
            id: t.id as string,
            name: t.name as string,
            duration: (t.duration as string) || 'monthly',
            defaultPrice: (t.price as number) || 0,
            price: (t.price as number) || 0,
            discount: 0,
            remainingUsers: 0,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateTier(id: string, field: keyof Tier, value: string | number) {
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const t of tiers) {
        await api.put(`/creator/tiers/${t.id}`, {
          name: t.name,
          price: t.price,
          description: '',
          benefits: [],
        });
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-[#f8f8f8]">My Subscriptions</p>

      <div className="overflow-x-auto rounded-[16px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
              {[
                'Subscription Name',
                'Duration',
                'Default Subscription Price',
                'My Subscription Price',
                'Discount Percentage',
                'Remaining Users / No. of Users',
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
          <tbody className="bg-[#0e1012]">
            {tiers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
                  No subscription tiers yet
                </td>
              </tr>
            ) : (
              tiers.map((t) => (
                <tr key={t.id} className="border-b border-[#15191c] last:border-0">
                  <td className="px-[14px] py-[12px] text-[14px] text-[#f8f8f8]">{t.name}</td>
                  <td className="px-[14px] py-[12px] text-[14px] text-[#f8f8f8]">{t.duration}</td>
                  <td className="px-[14px] py-[12px] text-[14px] text-[#f8f8f8]">
                    {t.defaultPrice.toFixed(2)}
                  </td>
                  <td className="px-[14px] py-[12px]">
                    <input
                      type="number"
                      value={t.price}
                      onChange={(e) => updateTier(t.id, 'price', Number(e.target.value))}
                      className="w-[80px] rounded-[4px] border border-[#5d5d5d] bg-transparent px-[8px] py-[4px] text-[14px] text-[#f8f8f8] outline-none"
                    />
                  </td>
                  <td className="px-[14px] py-[12px] text-[14px] text-[#5d5d5d]">
                    {t.discount || '-'}
                  </td>
                  <td className="px-[14px] py-[12px] text-[14px] text-[#5d5d5d]">
                    {t.remainingUsers || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-[16px]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full max-w-[306px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] py-[12px] text-[18px] text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="w-full max-w-[306px] rounded-[80px] border border-[#2e4882] bg-[#f8f8f8] py-[12px] text-[18px] text-black shadow-md hover:opacity-90 transition-opacity">
          Cancel
        </button>
      </div>
    </div>
  );
}
