interface Props {
  form: Record<string, string>;
  update: (key: string, val: string) => void;
  inputCls: string;
  textCls: string;
  fileCls: string;
}

export function GeneralTab({ form, update, inputCls, textCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Make Money Title
        </label>
        <input
          value={form.title || ''}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Make Money With Fansbook"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Title</label>
        <input
          value={form.seoTitle || ''}
          onChange={(e) => update('seoTitle', e.target.value)}
          placeholder="Fansbook.vip"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Description</label>
        <textarea
          value={form.seoDesc || ''}
          onChange={(e) => update('seoDesc', e.target.value)}
          placeholder="Start earning with Fansbook today."
          className={textCls}
        />
      </div>
    </div>
  );
}

export function SectionTab({ form, update, inputCls, fileCls, tab }: Props & { tab: string }) {
  const sections = Array.from({ length: 9 }, (_, i) => i + 1);
  const isIncome = tab === 'GENERATE INCOME SECTION';
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          {isIncome ? 'Generate Income Title' : 'Feature Title'}
        </label>
        <input
          value={form[`${tab}_title`] || ''}
          onChange={(e) => update(`${tab}_title`, e.target.value)}
          placeholder={isIncome ? 'Enter generate income title' : 'Enter feature title'}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          {isIncome ? 'Generate Income Description' : 'Feature Description'}
        </label>
        <textarea
          value={form[`${tab}_desc`] || ''}
          onChange={(e) => update(`${tab}_desc`, e.target.value)}
          placeholder={isIncome ? 'Enter generate income description' : 'Enter feature description'}
          className={`${inputCls} min-h-[80px] resize-y`}
        />
      </div>
      {sections.map((n) => (
        <div key={n}>
          <label className="mb-[4px] block font-outfit text-[14px] text-black">
            Section {n} Title
          </label>
          <input
            value={form[`${tab}_s${n}_title`] || ''}
            onChange={(e) => update(`${tab}_s${n}_title`, e.target.value)}
            placeholder={`Enter section ${n} title`}
            className={inputCls}
          />
          <label className="mb-[4px] mt-[8px] block font-outfit text-[14px] text-black">
            Section {n} Image (Recommended Size 100x100 Px)
          </label>
          <input type="file" className={fileCls} />
        </div>
      ))}
    </div>
  );
}

export function HowItWorkTab({ form, update, inputCls, textCls }: Omit<Props, 'fileCls'>) {
  const sections = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          How It Works Title
        </label>
        <input
          value={form.howTitle || ''}
          onChange={(e) => update('howTitle', e.target.value)}
          placeholder="How It Works"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          How It Works Description
        </label>
        <textarea
          value={form.howDesc || ''}
          onChange={(e) => update('howDesc', e.target.value)}
          placeholder="Learn how Fansbook works for creators."
          className={textCls}
        />
      </div>
      {sections.map((n) => (
        <div key={n}>
          <label className="mb-[4px] block font-outfit text-[14px] text-black">
            Section {n} Title
          </label>
          <input
            value={form[`how_s${n}_title`] || ''}
            onChange={(e) => update(`how_s${n}_title`, e.target.value)}
            placeholder={`Enter section ${n} title`}
            className={inputCls}
          />
          <label className="mb-[4px] mt-[8px] block font-outfit text-[14px] text-black">
            Section {n} Description
          </label>
          <textarea
            value={form[`how_s${n}_desc`] || ''}
            onChange={(e) => update(`how_s${n}_desc`, e.target.value)}
            placeholder={`Enter section ${n} description`}
            className={textCls}
          />
        </div>
      ))}
    </div>
  );
}
