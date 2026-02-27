import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import type { Toast } from '../components/creator-edit/shared';
import { BasicInfoTab } from '../components/creator-edit/BasicInfoTab';
import { StatsTab } from '../components/creator-edit/StatsTab';
import { SocialLinksTab } from '../components/creator-edit/SocialLinksTab';
import { ChangePasswordTab } from '../components/creator-edit/ChangePasswordTab';
import { BankDetailsTab } from '../components/creator-edit/BankDetailsTab';
import { CountryBlockTab } from '../components/creator-edit/CountryBlockTab';
import { DeactivateTab } from '../components/creator-edit/DeactivateTab';

type Tab = 'basic' | 'stats' | 'social' | 'password' | 'bank' | 'countries' | 'deactivate';

const TABS: { key: Tab; label: string }[] = [
  { key: 'basic', label: 'Basic  Info' },
  { key: 'stats', label: 'Stats' },
  { key: 'social', label: 'Social Links' },
  { key: 'password', label: 'Change Password' },
  { key: 'bank', label: 'Bank Details' },
  { key: 'countries', label: 'Country Block List' },
  { key: 'deactivate', label: 'Deactivate Account' },
];

type ToastFn = (type: 'success' | 'error', message: string) => void;

const TAB_COMPONENTS: Record<Tab, React.FC<{ onToast: ToastFn }>> = {
  basic: BasicInfoTab,
  stats: StatsTab,
  social: SocialLinksTab,
  password: ChangePasswordTab,
  bank: BankDetailsTab,
  countries: CountryBlockTab,
  deactivate: DeactivateTab,
};

function CoverAvatar({
  cover,
  avatar,
  initial,
}: {
  cover: string | null;
  avatar: string | null;
  initial: string;
}) {
  return (
    <div className="relative mb-[0px]">
      <div className="h-[140px] w-full overflow-hidden rounded-t-[22px] md:h-[200px]">
        {cover ? (
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#2e4882] to-[#a61651]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0e1012]" />
      </div>
      <div className="-mt-[40px] relative ml-[20px] inline-block md:-mt-[50px] md:ml-[40px]">
        <div className="size-[80px] overflow-hidden rounded-full border-[4px] border-[#0e1012] bg-[#0e1012] md:size-[96px]">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#2e4882] text-[28px] font-medium text-white md:text-[36px]">
              {initial}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorProfileEdit() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [toast, setToast] = useState<Toast | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.username) return;
    api
      .get(`/creator-profile/${user.username}`)
      .then((res) => {
        if (res.data.success) {
          setCover(res.data.data.cover);
          setAvatar(res.data.data.avatar);
        }
      })
      .catch(() => {});
  }, [user?.username]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const initial = (user?.displayName ?? 'C').charAt(0).toUpperCase();
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="flex flex-col gap-[0px]">
      {toast && (
        <div
          className={`fixed right-[24px] top-[24px] z-50 rounded-[12px] px-[20px] py-[12px] text-[14px] font-medium shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {toast.message}
        </div>
      )}

      <CoverAvatar cover={cover} avatar={avatar} initial={initial} />

      {/* Tab Bar */}
      <div className="mt-[16px] overflow-x-auto md:mt-[20px]">
        <div className="flex min-w-max items-center gap-[0px] rounded-[70px] bg-[#0e1012] px-[16px] py-[12px] md:px-[24px] md:py-[14px]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-[70px] px-[14px] py-[8px] text-[13px] font-normal transition-all md:px-[18px] md:py-[10px] md:text-[16px] ${
                activeTab === tab.key ? 'text-[#01adf1]' : 'text-[#f8f8f8] hover:text-[#01adf1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-[0px] rounded-[22px] bg-[#0e1012] px-[20px] py-[28px] md:px-[50px] md:py-[35px]">
        <ActiveTabComponent onToast={showToast} />
      </div>
    </div>
  );
}
