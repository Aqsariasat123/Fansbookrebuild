import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { GeneralTab, ItemsTab, type CmsItem } from './MakeMoneySettingTabs';

interface ItemsState {
  earn: CmsItem[];
  why: CmsItem[];
  how: CmsItem[];
}

const DEFAULT_EARN: CmsItem[] = [
  {
    id: '1',
    title: 'Subscriptions',
    desc: 'Charge fans monthly for exclusive content.',
    iconName: 'subscriptions',
  },
  {
    id: '2',
    title: 'Tips & Donations',
    desc: 'Receive instant tips on your posts.',
    iconName: 'tips',
  },
  { id: '3', title: 'Pay-Per-View (PPV)', desc: 'Lock premium photos & videos.', iconName: 'ppv' },
  {
    id: '4',
    title: 'Bookings',
    desc: 'Offer shout outs, video calls, or private content.',
    iconName: 'bookings',
  },
  {
    id: '5',
    title: 'Referrals',
    desc: 'Invite creators & earn commission.',
    iconName: 'referrals',
  },
  { id: '6', title: 'Live Streaming', desc: 'Go live, earn from coins & gifts.', iconName: 'live' },
];
const DEFAULT_WHY: CmsItem[] = [
  { id: '1', title: 'Secure Payments', iconName: 'secure_payments' },
  { id: '2', title: 'Global Reach', iconName: 'global_reach' },
  { id: '3', title: 'Flexible Withdrawals', iconName: 'flexible_withdrawals' },
  { id: '4', title: 'Security & Privacy', iconName: 'security_privacy' },
];
const DEFAULT_HOW: CmsItem[] = [
  { id: '1', title: 'Create Account', iconName: 'create_account' },
  { id: '2', title: 'Upload Content', iconName: 'upload_content' },
  { id: '3', title: 'Set Price', iconName: 'set_price' },
  { id: '4', title: 'Earn & Withdraw', iconName: 'earn_withdraw' },
];

const TABS = ['GENERAL', 'EARN IN MULTIPLE WAYS', 'WHY INSCRIO?', 'HOW TO START'] as const;
type Tab = (typeof TABS)[number];

const inputCls =
  'w-full rounded-[6px] border border-[#ddd] bg-white px-[12px] py-[10px] font-outfit text-[16px] text-black outline-none';
const textCls = `${inputCls} min-h-[80px] resize-y`;

export default function MakeMoneySetting() {
  const [tab, setTab] = useState<Tab>('GENERAL');
  const [generalForm, setGeneralForm] = useState<Record<string, string>>({});
  const [items, setItems] = useState<ItemsState>({
    earn: DEFAULT_EARN,
    why: DEFAULT_WHY,
    how: DEFAULT_HOW,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    Promise.all([
      api.get('/admin/settings/home').then(({ data: r }) => r.data?.makeMoney ?? {}),
      api.get('/admin/settings/make-money').then(({ data: r }) => r.data),
    ])
      .then(([general, cmsData]) => {
        setGeneralForm(general as Record<string, string>);
        if (cmsData) {
          setItems({
            earn: (cmsData as ItemsState).earn?.length
              ? (cmsData as ItemsState).earn
              : DEFAULT_EARN,
            why: (cmsData as ItemsState).why?.length ? (cmsData as ItemsState).why : DEFAULT_WHY,
            how: (cmsData as ItemsState).how?.length ? (cmsData as ItemsState).how : DEFAULT_HOW,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateGeneral = (key: string, val: string) => setGeneralForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setStatus('saving');
    try {
      await Promise.all([
        api.put('/admin/settings/home', { makeMoney: generalForm }),
        api.put('/admin/settings/make-money', items),
      ]);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <p className="mb-[12px] font-outfit text-[20px] font-normal text-black md:mb-[16px] md:text-[32px]">
        Settings {'>'} Make Money
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex overflow-x-auto rounded-t-[22px] bg-gradient-to-r from-[#01adf1] to-[#a61651]">
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
          {tab === 'GENERAL' && (
            <GeneralTab
              form={generalForm}
              update={updateGeneral}
              inputCls={inputCls}
              textCls={textCls}
            />
          )}
          {tab === 'EARN IN MULTIPLE WAYS' && (
            <ItemsTab
              items={items.earn}
              showDesc
              onChange={(earn) => setItems((p) => ({ ...p, earn }))}
            />
          )}
          {tab === 'WHY INSCRIO?' && (
            <ItemsTab
              items={items.why}
              showDesc={false}
              onChange={(why) => setItems((p) => ({ ...p, why }))}
            />
          )}
          {tab === 'HOW TO START' && (
            <ItemsTab
              items={items.how}
              showDesc={false}
              onChange={(how) => setItems((p) => ({ ...p, how }))}
            />
          )}
          {status === 'saved' && (
            <p className="mt-[12px] text-center font-outfit text-[14px] text-green-600">
              Saved successfully.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-[12px] text-center font-outfit text-[14px] text-red-600">
              Save failed. Please try again.
            </p>
          )}
          <div className="mt-[24px] flex justify-center gap-[16px]">
            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[48px] py-[12px] font-outfit text-[16px] text-white disabled:opacity-60"
            >
              {status === 'saving' ? 'Saving…' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
