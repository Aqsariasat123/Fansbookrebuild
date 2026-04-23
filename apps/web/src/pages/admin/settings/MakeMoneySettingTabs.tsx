export interface CmsItem {
  id: string;
  title: string;
  desc?: string;
  iconName: string;
}

const ICON_NAMES = [
  'bookings',
  'create_account',
  'earn_withdraw',
  'flexible_withdrawals',
  'global_reach',
  'live',
  'ppv',
  'referrals',
  'secure_payments',
  'security_privacy',
  'set_price',
  'subscriptions',
  'tips',
  'upload_content',
] as const;

interface GeneralTabProps {
  form: Record<string, string>;
  update: (key: string, val: string) => void;
  inputCls: string;
  textCls: string;
}

export function GeneralTab({ form, update, inputCls, textCls }: GeneralTabProps) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Make Money Title
        </label>
        <input
          value={form.title || ''}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Make Money With Inscrio"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Title</label>
        <input
          value={form.seoTitle || ''}
          onChange={(e) => update('seoTitle', e.target.value)}
          placeholder="Inscrio.vip"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Description</label>
        <textarea
          value={form.seoDesc || ''}
          onChange={(e) => update('seoDesc', e.target.value)}
          placeholder="Start earning with Inscrio today."
          className={textCls}
        />
      </div>
    </div>
  );
}

interface ItemsTabProps {
  items: CmsItem[];
  showDesc: boolean;
  onChange: (items: CmsItem[]) => void;
}

export function ItemsTab({ items, showDesc, onChange }: ItemsTabProps) {
  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next);
  };

  const update = (index: number, field: keyof CmsItem, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () =>
    onChange([...items, { id: Date.now().toString(), title: '', iconName: 'subscriptions' }]);

  const inputCls =
    'rounded-[6px] border border-[#ddd] bg-white px-[10px] py-[8px] font-outfit text-[14px] text-black outline-none';
  const btnCls =
    'rounded-[6px] border border-[#ddd] px-[8px] py-[6px] font-outfit text-[13px] text-black hover:bg-gray-100';

  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center gap-[8px] rounded-[8px] border border-[#ddd] bg-white p-[12px]"
        >
          <img
            src={`/icons/make-money/${item.iconName}.svg`}
            alt=""
            className="h-[36px] w-[36px] shrink-0"
          />
          <input
            value={item.title}
            onChange={(e) => update(i, 'title', e.target.value)}
            placeholder="Title"
            className={`${inputCls} min-w-[140px] flex-1`}
          />
          {showDesc && (
            <input
              value={item.desc ?? ''}
              onChange={(e) => update(i, 'desc', e.target.value)}
              placeholder="Description"
              className={`${inputCls} min-w-[180px] flex-[2]`}
            />
          )}
          <select
            value={item.iconName}
            onChange={(e) => update(i, 'iconName', e.target.value)}
            className={`${inputCls} min-w-[150px]`}
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button onClick={() => move(i, -1)} disabled={i === 0} className={btnCls}>
            ↑
          </button>
          <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className={btnCls}>
            ↓
          </button>
          <button
            onClick={() => remove(i)}
            className={`${btnCls} border-red-300 text-red-600 hover:bg-red-50`}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-[4px] self-start rounded-[8px] border border-[#01adf1] px-[20px] py-[10px] font-outfit text-[14px] text-[#01adf1] hover:bg-[#01adf1]/10"
      >
        + Add Item
      </button>
    </div>
  );
}
