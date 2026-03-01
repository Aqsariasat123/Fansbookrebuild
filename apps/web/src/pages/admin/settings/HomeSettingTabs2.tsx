interface Props {
  form: Record<string, string>;
  update: (key: string, val: string) => void;
  inputCls: string;
  textCls: string;
}

export function FaqTab({ form, update, inputCls, textCls }: Props) {
  return (
    <div className="flex max-w-[600px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Faq Title</label>
        <input
          value={form.faqTitle || ''}
          onChange={(e) => update('faqTitle', e.target.value)}
          placeholder="Frequently Asked Questions"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Faq Description</label>
        <textarea
          value={form.faqDescription || ''}
          onChange={(e) => update('faqDescription', e.target.value)}
          placeholder="Find answers to common questions about our platform."
          className={textCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Title</label>
        <input
          value={form.faqSeoTitle || ''}
          onChange={(e) => update('faqSeoTitle', e.target.value)}
          placeholder="Fansbook.vip"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Description</label>
        <textarea
          value={form.faqSeoDesc || ''}
          onChange={(e) => update('faqSeoDesc', e.target.value)}
          placeholder="If you are unsure of anything, please drop us a line and our team will be more than happy to assist you."
          className={textCls}
        />
      </div>
    </div>
  );
}

export function EmailTab({ form, update, inputCls, textCls }: Props) {
  return (
    <div className="flex max-w-[600px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Footer Description
        </label>
        <textarea
          value={form.emailFooterDesc || ''}
          onChange={(e) => update('emailFooterDesc', e.target.value)}
          placeholder="Enter footer description for emails"
          className={textCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Copyright</label>
        <input
          value={form.emailCopyright || ''}
          onChange={(e) => update('emailCopyright', e.target.value)}
          placeholder="© 2026 Fansbook. All rights reserved."
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Send To Admin Mail
        </label>
        <input
          value={form.adminMail || ''}
          onChange={(e) => update('adminMail', e.target.value)}
          placeholder="admin@fansbook.com"
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function SeoSettingsTab({ form, update, inputCls, textCls }: Props) {
  return (
    <div className="flex max-w-[600px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Title</label>
        <input
          value={form.seoSettingsTitle || ''}
          onChange={(e) => update('seoSettingsTitle', e.target.value)}
          placeholder="Fansbook.vip"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Seo Description</label>
        <textarea
          value={form.seoSettingsDesc || ''}
          onChange={(e) => update('seoSettingsDesc', e.target.value)}
          placeholder="If you are unsure of anything, please drop us a line and our team will be more than happy to assist you."
          className={textCls}
        />
      </div>
    </div>
  );
}
