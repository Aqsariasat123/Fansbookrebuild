import { useRef, useState } from 'react';
import { api } from '../../../lib/api';

export default function BannerSetting() {
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setSaving(true);
    await api.put('/admin/settings/home', { bannerUpdated: true }).catch(() => {});
    setSaving(false);
  };

  const fileCls =
    'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-[#5d5d5d] outline-none';

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Settings {'>'} Banner Image Setting
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] p-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div ref={formRef} className="flex max-w-[500px] flex-col gap-[20px]">
          <div>
            <h3 className="mb-[8px] font-outfit text-[18px] font-medium text-black">
              1. Login Banner Section
            </h3>
            <label className="mb-[4px] block font-outfit text-[14px] text-black">Image</label>
            <input type="file" className={fileCls} placeholder="Upload Your Banner" />
          </div>
          <div>
            <h3 className="mb-[8px] font-outfit text-[18px] font-medium text-black">
              2. Register Banner
            </h3>
            <label className="mb-[4px] block font-outfit text-[14px] text-black">Image</label>
            <input type="file" className={fileCls} placeholder="Upload Your Banner" />
          </div>
        </div>
        <div className="mt-[24px] flex justify-center gap-[16px]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[48px] py-[12px] font-outfit text-[16px] text-white disabled:opacity-60"
          >
            {saving ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={() =>
              formRef.current?.querySelectorAll('input').forEach((i) => {
                i.value = '';
              })
            }
            className="rounded-[80px] border border-[#15191c] px-[48px] py-[12px] font-outfit text-[16px] text-[#15191c]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
