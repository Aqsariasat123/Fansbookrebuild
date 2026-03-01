import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import {
  WithdrawalTab,
  ReferralBonusTab,
  UserTokenTab,
  BroadcastingTab,
  WithdrawFormTab,
  OthersTab,
} from './GeneralSettingTabs';

const TABS = [
  'WITHDRAWAL',
  'MODEL REFERRAL BONUS',
  'USER TOKEN',
  'ONE TO ONE BROADCASTING',
  'WITHDRAW FORM',
  'OTHERS',
] as const;

export default function GeneralSetting() {
  const [tab, setTab] = useState<string>(TABS[0]);
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/settings/general')
      .then(({ data: r }) => setForm(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, val: string | number | boolean) =>
    setForm((p) => ({ ...p, [key]: val }));
  const handleSave = async () => {
    await api.put('/admin/settings/general', form);
  };

  const inputCls =
    'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-black outline-none';
  const fileCls =
    'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-[#5d5d5d] outline-none';
  const tabProps = { form, update, inputCls, fileCls };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  const tabContent: Record<string, React.ReactNode> = {
    WITHDRAWAL: <WithdrawalTab {...tabProps} />,
    'MODEL REFERRAL BONUS': <ReferralBonusTab {...tabProps} />,
    'USER TOKEN': <UserTokenTab {...tabProps} />,
    'ONE TO ONE BROADCASTING': <BroadcastingTab {...tabProps} />,
    'WITHDRAW FORM': <WithdrawFormTab {...tabProps} />,
    OTHERS: <OthersTab {...tabProps} />,
  };

  return (
    <div>
      <p className="mb-[16px] font-outfit text-[32px] font-normal text-black">
        Settings {'>'} General Setting
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
          {tabContent[tab]}
          <div className="mt-[24px] flex justify-center gap-[16px]">
            <button
              onClick={handleSave}
              className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[48px] py-[12px] font-outfit text-[16px] text-white"
            >
              Update
            </button>
            <button className="rounded-[80px] border border-[#15191c] px-[48px] py-[12px] font-outfit text-[16px] text-[#15191c]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
