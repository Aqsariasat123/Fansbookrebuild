import { useState } from 'react';
import { api } from '../../lib/api';

export type FormState = {
  name: string;
  description: string;
  icon: string;
  rarity: string;
  category: string;
};
export const emptyForm: FormState = {
  name: '',
  description: '',
  icon: '',
  rarity: 'COMMON',
  category: 'SPECIAL',
};

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  category: string;
}

export function BadgeFormModal({
  badge,
  onClose,
  onSave,
}: {
  badge: BadgeItem | null;
  onClose: () => void;
  onSave: (f: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(
    badge
      ? {
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          category: badge.category,
        }
      : emptyForm,
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div className="w-[420px] rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <p className="mb-4 text-lg font-semibold">{badge ? 'Edit Badge' : 'Create Badge'}</p>
        <div className="flex flex-col gap-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="rounded border px-3 py-2 text-sm"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Icon (emoji or URL)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <select
            className="rounded border px-3 py-2 text-sm"
            value={form.rarity}
            onChange={(e) => setForm({ ...form, rarity: e.target.value })}
          >
            <option value="COMMON">Common</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
            <option value="LEGENDARY">Legendary</option>
          </select>
          <select
            className="rounded border px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="CONTENT">Content</option>
            <option value="SOCIAL">Social</option>
            <option value="ENGAGEMENT">Engagement</option>
            <option value="REVENUE">Revenue</option>
            <option value="SPECIAL">Special</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="rounded bg-[#01adf1] px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

async function lookupAndAward(badgeId: string, username: string) {
  const { data: userRes } = await api.get(`/admin/users?search=${username.trim()}&limit=1`);
  const user = userRes.data?.items?.[0];
  if (!user) throw new Error('User not found');
  await api.post(`/admin/badges/${badgeId}/award`, { userId: user.id });
}

export function AwardModal({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const [username, setUsername] = useState('');
  const handleAward = async () => {
    try {
      await lookupAndAward(badgeId, username);
      onClose();
      alert('Badge awarded!');
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error).message,
      );
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div className="w-[360px] rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <p className="mb-4 text-lg font-semibold">Award Badge</p>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleAward}
            className="rounded bg-[#28a745] px-4 py-2 text-sm text-white"
          >
            Award
          </button>
        </div>
      </div>
    </div>
  );
}
