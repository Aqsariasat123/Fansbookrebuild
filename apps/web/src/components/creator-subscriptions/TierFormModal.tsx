import { useState, useEffect } from 'react';

interface TierData {
  id?: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

interface Props {
  initial?: TierData;
  onSave: (data: TierData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

function isValidTier(name: string, price: string): boolean {
  if (!name.trim() || !price) return false;
  const p = parseFloat(price);
  return p >= 4.99 && p <= 99.99;
}

function buildTierData(
  initial: TierData | undefined,
  name: string,
  price: string,
  description: string,
  benefits: string[],
): TierData {
  return {
    id: initial?.id,
    name: name.trim(),
    price: parseFloat(price),
    description: description.trim(),
    benefits: benefits.filter((b) => b.trim()),
  };
}

const INPUT_CLASS =
  'mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none';

function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function BenefitsEditor({
  benefits,
  onChange,
}: {
  benefits: string[];
  onChange: (b: string[]) => void;
}) {
  const add = () => onChange([...benefits, '']);
  const remove = (idx: number) => onChange(benefits.filter((_, i) => i !== idx));
  const update = (idx: number, val: string) =>
    onChange(benefits.map((b, i) => (i === idx ? val : b)));

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-[13px] text-muted-foreground">Benefits</label>
        <button onClick={add} className="text-[12px] text-[#01adf1]">
          + Add
        </button>
      </div>
      <div className="mt-[4px] flex flex-col gap-[6px]">
        {benefits.map((b, i) => (
          <div key={i} className="flex gap-[6px]">
            <input
              value={b}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Benefit ${i + 1}`}
              className="flex-1 rounded-[8px] bg-muted px-[12px] py-[8px] text-[13px] text-foreground outline-none"
            />
            {benefits.length > 1 && (
              <button
                onClick={() => remove(i)}
                className="text-muted-foreground hover:text-red-400"
              >
                <CloseIcon size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TierFormFields({
  name,
  price,
  description,
  benefits,
  onNameChange,
  onPriceChange,
  onDescChange,
  onBenefitsChange,
}: {
  name: string;
  price: string;
  description: string;
  benefits: string[];
  onNameChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onBenefitsChange: (b: string[]) => void;
}) {
  return (
    <div className="mt-[16px] flex flex-col gap-[12px]">
      <div>
        <label className="text-[13px] text-muted-foreground">Tier Name</label>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Gold"
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label className="text-[13px] text-muted-foreground">Price ($4.99 - $99.99)</label>
        <input
          type="number"
          min="4.99"
          max="99.99"
          step="0.01"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="9.99"
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label className="text-[13px] text-muted-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="What subscribers get..."
          className="mt-[4px] min-h-[80px] w-full resize-none rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
        />
      </div>
      <BenefitsEditor benefits={benefits} onChange={onBenefitsChange} />
    </div>
  );
}

function TierFormFooter({
  isEdit,
  saving,
  deleting,
  disabled,
  onSubmit,
  onDelete,
}: {
  isEdit: boolean;
  saving: boolean;
  deleting: boolean;
  disabled: boolean;
  onSubmit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="mt-[20px] flex gap-[12px]">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
      >
        {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-[50px] bg-red-500/20 px-[24px] py-[10px] text-[14px] font-medium text-red-400 disabled:opacity-50"
        >
          {deleting ? '...' : 'Delete'}
        </button>
      )}
    </div>
  );
}

function getInitialValues(initial?: TierData) {
  return {
    name: initial?.name ?? '',
    price: initial?.price?.toString() ?? '',
    description: initial?.description ?? '',
    benefits: initial?.benefits ?? [''],
  };
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
}

function TierModalHeader({ isEdit, onClose }: { isEdit: boolean; onClose: () => void }) {
  const title = isEdit ? 'Edit Tier' : 'Create New Tier';
  return (
    <div className="flex items-center justify-between">
      <p className="text-[18px] font-semibold text-foreground">{title}</p>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <CloseIcon />
      </button>
    </div>
  );
}

export function TierFormModal({ initial, onSave, onDelete, onClose }: Props) {
  const init = getInitialValues(initial);
  const [name, setName] = useState(init.name);
  const [price, setPrice] = useState(init.price);
  const [description, setDescription] = useState(init.description);
  const [benefits, setBenefits] = useState<string[]>(init.benefits);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEscapeKey(onClose);

  const handleSubmit = async () => {
    if (!isValidTier(name, price)) return;
    setSaving(true);
    try {
      await onSave(buildTierData(initial, name, price, description, benefits));
      onClose();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]">
      <div className="w-full max-w-[460px] rounded-[22px] bg-card p-[24px]">
        <TierModalHeader isEdit={!!initial} onClose={onClose} />
        <TierFormFields
          name={name}
          price={price}
          description={description}
          benefits={benefits}
          onNameChange={setName}
          onPriceChange={setPrice}
          onDescChange={setDescription}
          onBenefitsChange={setBenefits}
        />
        <TierFormFooter
          isEdit={!!initial}
          saving={saving}
          deleting={deleting}
          disabled={saving || !name.trim() || !price}
          onSubmit={handleSubmit}
          onDelete={initial && onDelete ? handleDelete : undefined}
        />
      </div>
    </div>
  );
}
