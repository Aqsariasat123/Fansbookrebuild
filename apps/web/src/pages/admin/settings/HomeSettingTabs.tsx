interface Props {
  form: Record<string, string>;
  update: (key: string, val: string) => void;
  inputCls: string;
  textCls: string;
  fileCls: string;
}

function val(form: Record<string, string>, key: string) {
  return form[key] ?? '';
}

function Field({
  label,
  value,
  onChange,
  cls,
  type,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  cls: string;
  type?: string;
  placeholder?: string;
}) {
  const ph = placeholder || `Enter ${label}`;
  return (
    <div>
      <label className="mb-[4px] block font-outfit text-[14px] text-black">{label}</label>
      {type === 'file' ? (
        <input type="file" className={cls} />
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={ph}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={ph}
          className={cls}
        />
      )}
    </div>
  );
}

export function HomePageTab({ form, update, inputCls, textCls, fileCls }: Props) {
  const v = (k: string) => val(form, k);
  return (
    <div className="flex max-w-[600px] flex-col gap-[16px]">
      <h3 className="font-outfit text-[18px] font-medium text-black">1. Logo Section</h3>
      <Field label="Logo" cls={fileCls} type="file" />
      <Field label="Favicon Icon" cls={fileCls} type="file" />
      <h3 className="font-outfit text-[18px] font-medium text-black">2. Footer Section</h3>
      <Field label="Footer Logo" cls={fileCls} type="file" />
      <Field
        label="Footer Description"
        value={v('footerDescription')}
        onChange={(x) => update('footerDescription', x)}
        cls={textCls}
        type="textarea"
      />
      <h3 className="font-outfit text-[18px] font-medium text-black">3. Contact Us</h3>
      <Field
        label="Contact Us Title"
        value={v('contactTitle')}
        onChange={(x) => update('contactTitle', x)}
        cls={inputCls}
      />
      <Field
        label="Address"
        value={v('address')}
        onChange={(x) => update('address', x)}
        cls={textCls}
        type="textarea"
      />
      <Field
        label="Mobile No"
        value={v('mobile')}
        onChange={(x) => update('mobile', x)}
        cls={inputCls}
      />
      <Field
        label="Email Id"
        value={v('contactEmail')}
        onChange={(x) => update('contactEmail', x)}
        cls={inputCls}
      />
      <h3 className="font-outfit text-[18px] font-medium text-black">4. Footer Social Links</h3>
      <Field
        label="Facebook Link"
        value={v('facebookLink')}
        onChange={(x) => update('facebookLink', x)}
        cls={inputCls}
      />
      <Field
        label="Instagram Link"
        value={v('instagramLink')}
        onChange={(x) => update('instagramLink', x)}
        cls={inputCls}
      />
      <Field
        label="Twitter Link"
        value={v('twitterLink')}
        onChange={(x) => update('twitterLink', x)}
        cls={inputCls}
      />
      <h3 className="font-outfit text-[18px] font-medium text-black">5. Seo</h3>
      <Field
        label="Seo Title"
        value={v('seoTitle')}
        onChange={(x) => update('seoTitle', x)}
        cls={inputCls}
      />
      <Field
        label="Seo Description"
        value={v('seoDescription')}
        onChange={(x) => update('seoDescription', x)}
        cls={textCls}
        type="textarea"
      />
      <Field
        label="Copyright"
        value={v('copyright')}
        onChange={(x) => update('copyright', x)}
        cls={inputCls}
      />
    </div>
  );
}

export function ContactUsTab({ form, update, inputCls, textCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[600px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Contact Us Email
        </label>
        <input
          value={val(form, 'contactEmail')}
          onChange={(e) => update('contactEmail', e.target.value)}
          placeholder="fanbook@mailinator.com"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Contact Us Title
        </label>
        <input
          value={form.contactTitle || ''}
          onChange={(e) => update('contactTitle', e.target.value)}
          placeholder="Contact Us"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Contact Us Description
        </label>
        <textarea
          value={form.contactDescription || ''}
          onChange={(e) => update('contactDescription', e.target.value)}
          placeholder="If you are unsure of anything, please drop us a line and our team will be more than happy to assist you."
          className={textCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Title</label>
        <input
          value={form.contactSeoTitle || ''}
          onChange={(e) => update('contactSeoTitle', e.target.value)}
          placeholder="Fansbook.vip"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Description</label>
        <textarea
          value={form.contactSeoDesc || ''}
          onChange={(e) => update('contactSeoDesc', e.target.value)}
          placeholder="If you are unsure of anything, please drop us a line and our team will be more than happy to assist you."
          className={textCls}
        />
      </div>
    </div>
  );
}
