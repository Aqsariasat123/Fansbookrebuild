import { useState, useEffect, useRef } from 'react';
import { api } from '../../../lib/api';
import { GeneralTab, SectionTab, HowItWorkTab } from './MakeMoneySettingTabs';

const TABS = [
  'GENERAL',
  'GENERATE INCOME SECTION',
  'FEATURE SECTION',
  'HOW IT WORK SECTION',
] as const;

export default function MakeMoneySetting() {
  const [tab, setTab] = useState<string>(TABS[0]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const original = useRef<Record<string, string>>({});

  useEffect(() => {
    api
      .get('/admin/settings/home')
      .then(({ data: r }) => {
        const d = r.data?.makeMoney || {};
        setForm(d);
        original.current = d;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));
  const handleSave = async () => {
    await api.put('/admin/settings/home', { makeMoney: form });
  };

  const inputCls =
    'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-black outline-none';
  const textCls = `${inputCls} min-h-[80px] resize-y`;
  const fileCls =
    'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-[#5d5d5d]';
  const tabProps = { form, update, inputCls, textCls, fileCls };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Settings {'>'} Make Money
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex overflow-x-auto rounded-t-[22px] bg-[#01adf1]">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-[16px] py-[14px] font-outfit text-[13px] font-normal ${tab === t ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="p-[32px]">
          {tab === 'GENERAL' && <GeneralTab {...tabProps} />}
          {(tab === 'GENERATE INCOME SECTION' || tab === 'FEATURE SECTION') && (
            <SectionTab {...tabProps} tab={tab} />
          )}
          {tab === 'HOW IT WORK SECTION' && <HowItWorkTab {...tabProps} />}
          <div className="mt-[24px] flex justify-center gap-[16px]">
            <button
              onClick={handleSave}
              className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[48px] py-[12px] font-outfit text-[16px] text-white"
            >
              Update
            </button>
            <button
              onClick={() => setForm({ ...original.current })}
              className="rounded-[80px] border border-[#15191c] px-[48px] py-[12px] font-outfit text-[16px] text-[#15191c]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
