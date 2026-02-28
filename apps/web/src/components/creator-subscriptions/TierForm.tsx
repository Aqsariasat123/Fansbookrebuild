export interface TierFormData {
  name: string;
  price: string;
  description: string;
  benefits: string[];
  newBenefit: string;
}

export const emptyForm: TierFormData = {
  name: '',
  price: '',
  description: '',
  benefits: [],
  newBenefit: '',
};

interface TierFormProps {
  form: TierFormData;
  setForm: (f: TierFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}

export function TierForm({ form, setForm, onSave, onCancel, saving, title }: TierFormProps) {
  const addBenefit = () => {
    const trimmed = form.newBenefit.trim();
    if (!trimmed) return;
    setForm({ ...form, benefits: [...form.benefits, trimmed], newBenefit: '' });
  };

  const removeBenefit = (idx: number) => {
    setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== idx) });
  };

  return (
    <div className="rounded-[22px] bg-card p-[20px] md:p-[26px]">
      <p className="mb-[16px] text-[18px] font-semibold text-foreground">{title}</p>
      <div className="flex flex-col gap-[14px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-foreground">Tier Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Gold, Platinum, VIP"
            className="h-[42px] rounded-[8px] border border-border bg-transparent px-[12px] text-[14px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-foreground">Price (USD / month)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="9.99"
            className="h-[42px] rounded-[8px] border border-border bg-transparent px-[12px] text-[14px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-foreground">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what subscribers get with this tier..."
            rows={3}
            className="rounded-[8px] border border-border bg-transparent px-[12px] py-[10px] text-[14px] text-foreground placeholder-muted-foreground outline-none resize-none focus:border-[#01adf1]"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-foreground">Benefits</label>
          {form.benefits.length > 0 && (
            <ul className="flex flex-col gap-[6px]">
              {form.benefits.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-[6px] bg-muted px-[12px] py-[8px]"
                >
                  <span className="text-[13px] text-foreground">{b}</span>
                  <button
                    onClick={() => removeBenefit(i)}
                    className="ml-[8px] text-[16px] text-red-400 hover:text-red-300"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-[8px]">
            <input
              type="text"
              value={form.newBenefit}
              onChange={(e) => setForm({ ...form, newBenefit: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBenefit();
                }
              }}
              placeholder="Add a benefit and press Enter"
              className="h-[38px] flex-1 rounded-[8px] border border-border bg-transparent px-[12px] text-[13px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]"
            />
            <button
              onClick={addBenefit}
              className="h-[38px] rounded-[8px] bg-muted px-[14px] text-[13px] text-foreground hover:bg-[#1e2328] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-[8px] flex gap-[12px]">
          <button
            onClick={onSave}
            disabled={saving}
            className="h-[42px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[28px] text-[14px] font-medium text-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Tier'}
          </button>
          <button
            onClick={onCancel}
            className="h-[42px] rounded-[80px] border border-border px-[28px] text-[14px] text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
