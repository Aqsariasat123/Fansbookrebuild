import { useState, useEffect } from 'react';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface Props {
  open: boolean;
  title: string;
  fields: FieldDef[];
  initialData?: Record<string, string>;
  onSave: (data: Record<string, string>) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

export function MasterFormModal({
  open,
  title,
  fields,
  initialData,
  onSave,
  onClose,
  saving,
}: Props) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {};
      fields.forEach((f) => {
        init[f.key] = initialData?.[f.key] ?? '';
      });
      setForm(init);
    }
  }, [open, initialData, fields]);

  if (!open) return null;

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-[480px] rounded-[22px] bg-[#f8f8f8] p-[32px] shadow-lg"
      >
        <p className="mb-[20px] font-outfit text-[20px] font-normal text-black">{title}</p>
        <div className="flex flex-col gap-[14px]">
          {fields.map((f) => (
            <label key={f.key} className="flex flex-col gap-[4px]">
              <span className="font-outfit text-[14px] text-black">
                {f.label}
                {f.required !== false && ' *'}
              </span>
              {f.type === 'textarea' ? (
                <textarea
                  value={form[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  required={f.required !== false}
                  rows={3}
                  className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  required={f.required !== false}
                  className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
                >
                  <option value="">Select...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={form[f.key] ?? ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  required={f.required !== false}
                  className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-[24px] flex justify-end gap-[12px]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-[80px] border border-[#15191c] px-[24px] py-[8px] font-outfit text-[14px] text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] font-outfit text-[14px] text-white"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
