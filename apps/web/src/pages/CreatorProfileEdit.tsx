import { useState } from 'react';
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
  { key: 'basic', label: 'Basic Info' },
  { key: 'stats', label: 'Stats' },
  { key: 'social', label: 'Social Links' },
  { key: 'password', label: 'Change Password' },
  { key: 'bank', label: 'Bank Details' },
  { key: 'countries', label: 'Country Block' },
  { key: 'deactivate', label: 'Deactivate' },
];

export default function CreatorProfileEdit() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-[24px] right-[24px] z-50 px-[20px] py-[12px] rounded-[12px] text-[14px] font-medium shadow-lg transition-all ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Page Title */}
      <p className="text-[32px] font-bold text-[#f8f8f8] capitalize">Creator Profile</p>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-[8px]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-[16px] py-[10px] rounded-[10px] text-[13px] font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#a61651] to-[#8b32c7] text-[#f8f8f8]'
                : 'bg-transparent text-[#5d5d5d] hover:text-[#f8f8f8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Card */}
      <div className="rounded-[22px] bg-[#0e1012] px-[26px] py-[35px]">
        {activeTab === 'basic' && <BasicInfoTab onToast={showToast} />}
        {activeTab === 'stats' && <StatsTab onToast={showToast} />}
        {activeTab === 'social' && <SocialLinksTab onToast={showToast} />}
        {activeTab === 'password' && <ChangePasswordTab onToast={showToast} />}
        {activeTab === 'bank' && <BankDetailsTab onToast={showToast} />}
        {activeTab === 'countries' && <CountryBlockTab onToast={showToast} />}
        {activeTab === 'deactivate' && <DeactivateTab onToast={showToast} />}
      </div>
    </div>
  );
}
