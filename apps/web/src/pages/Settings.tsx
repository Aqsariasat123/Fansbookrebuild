import { useState } from 'react';
import { SettingsAccount } from './settings/SettingsAccount';
import { SettingsNotifications } from './settings/SettingsNotifications';
import { SettingsPrivacy } from './settings/SettingsPrivacy';
import { SettingsSecurity } from './settings/SettingsSecurity';
import { SettingsDisplay } from './settings/SettingsDisplay';
import { SettingsSessions } from './settings/SettingsSessions';
import { SettingsProfile } from './settings/SettingsProfile';
import { SettingsBecomeCreator } from './settings/SettingsBecomeCreator';
import { useAuthStore } from '../stores/authStore';

const BASE_TABS = [
  { key: 'account', label: 'Account' },
  { key: 'profile', label: 'Profile' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'security', label: 'Security' },
  { key: 'display', label: 'Display' },
  { key: 'sessions', label: 'Sessions' },
] as const;

type TabKey = (typeof BASE_TABS)[number]['key'] | 'become-creator';

function SettingsTabContent({ tab }: { tab: TabKey }) {
  const map: Record<TabKey, React.ReactNode> = {
    account: <SettingsAccount />,
    profile: <SettingsProfile />,
    notifications: <SettingsNotifications />,
    privacy: <SettingsPrivacy />,
    security: <SettingsSecurity />,
    display: <SettingsDisplay />,
    sessions: <SettingsSessions />,
    'become-creator': <SettingsBecomeCreator />,
  };
  return <>{map[tab]}</>;
}

export default function Settings() {
  const [tab, setTab] = useState<TabKey>('account');
  const user = useAuthStore((s) => s.user);
  const isFan = user?.role === 'FAN';

  const tabs = isFan
    ? [...BASE_TABS, { key: 'become-creator' as const, label: 'Become Creator' }]
    : BASE_TABS;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-foreground">Settings</p>

      <div className="flex flex-col rounded-[22px] bg-card px-[20px] py-[20px]">
        {/* Tab Navigation */}
        <div className="mb-[20px] flex gap-[4px] overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-[12px] px-[14px] py-[8px] text-[13px] transition-colors ${
                tab === t.key
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <SettingsTabContent tab={tab} />
      </div>
    </div>
  );
}
