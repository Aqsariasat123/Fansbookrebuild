import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { TierForm, emptyForm } from '../components/creator-subscriptions/TierForm';
import type { TierFormData } from '../components/creator-subscriptions/TierForm';
import { TierCard } from '../components/creator-subscriptions/TierCard';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  isActive: boolean;
}

export default function CreatorSubscriptionTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TierFormData>({ ...emptyForm });

  useEffect(() => {
    fetchTiers();
  }, []);

  async function fetchTiers() {
    try {
      const { data: res } = await api.get('/creator/tiers');
      setTiers(res.data || []);
    } catch {
      setError('Failed to load subscription tiers');
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowCreate(true);
  }

  function startEdit(tier: Tier) {
    setShowCreate(false);
    setEditingId(tier.id);
    setForm({
      name: tier.name,
      price: tier.price.toString(),
      description: tier.description,
      benefits: [...tier.benefits],
      newBenefit: '',
    });
  }

  function cancelForm() {
    setShowCreate(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  async function handleSaveNew() {
    if (!form.name.trim() || !form.price) {
      setError('Name and price are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data: res } = await api.post('/creator/tiers', {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        benefits: form.benefits,
      });
      if (res.data) setTiers((prev) => [...prev, res.data]);
      cancelForm();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || 'Failed to create tier');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingId || !form.name.trim() || !form.price) {
      setError('Name and price are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data: res } = await api.put(`/creator/tiers/${editingId}`, {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        benefits: form.benefits,
      });
      if (res.data) setTiers((prev) => prev.map((t) => (t.id === editingId ? res.data : t)));
      cancelForm();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e?.response?.data?.error || 'Failed to update tier');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(tier: Tier) {
    try {
      const { data: res } = await api.delete(`/creator/tiers/${tier.id}`);
      if (res.data) {
        setTiers((prev) => prev.map((t) => (t.id === tier.id ? res.data : t)));
      } else {
        setTiers((prev) =>
          prev.map((t) => (t.id === tier.id ? { ...t, isActive: !t.isActive } : t)),
        );
      }
    } catch {
      setError('Failed to update tier status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] md:gap-[22px]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-bold text-[#f8f8f8] md:text-[28px]">My Subscription Tiers</p>
        {!showCreate && !editingId && (
          <button
            onClick={startCreate}
            className="h-[40px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[22px] text-[14px] font-medium text-[#f8f8f8] hover:opacity-90 transition-opacity"
          >
            + Create New Tier
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-[10px] bg-red-500/10 px-[16px] py-[10px]">
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {showCreate && (
        <TierForm
          form={form}
          setForm={setForm}
          onSave={handleSaveNew}
          onCancel={cancelForm}
          saving={saving}
          title="Create New Tier"
        />
      )}

      {tiers.length === 0 && !showCreate ? (
        <div className="rounded-[22px] bg-[#0e1012] px-[20px] py-[40px] text-center">
          <p className="text-[16px] text-[#5d5d5d]">
            No subscription tiers yet. Create your first tier to start earning.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {tiers.map((tier) =>
            editingId === tier.id ? (
              <TierForm
                key={tier.id}
                form={form}
                setForm={setForm}
                onSave={handleSaveEdit}
                onCancel={cancelForm}
                saving={saving}
                title={`Edit: ${tier.name}`}
              />
            ) : (
              <TierCard
                key={tier.id}
                tier={tier}
                onEdit={() => startEdit(tier)}
                onDelete={() => handleToggleActive(tier)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
