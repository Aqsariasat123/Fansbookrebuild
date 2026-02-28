import { useState } from 'react';
import { SettingsAccount } from './settings/SettingsAccount';
import { SettingsNotifications } from './settings/SettingsNotifications';
import { SettingsPrivacy } from './settings/SettingsPrivacy';
import { SettingsSecurity } from './settings/SettingsSecurity';
import { SettingsDisplay } from './settings/SettingsDisplay';
import { SettingsSessions } from './settings/SettingsSessions';

const TABS = [
  { key: 'account', label: 'Account' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'security', label: 'Security' },
  { key: 'display', label: 'Display' },
  { key: 'sessions', label: 'Sessions' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function Settings() {
  const [tab, setTab] = useState<TabKey>('account');

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-foreground">Settings</p>

      <div className="flex flex-col rounded-[22px] bg-card px-[20px] py-[20px]">
        {/* Tab Navigation */}
        <div className="mb-[20px] flex gap-[4px] overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
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
        {tab === 'account' && <SettingsAccount />}
        {tab === 'notifications' && <SettingsNotifications />}
        {tab === 'privacy' && <SettingsPrivacy />}
        {tab === 'security' && <SettingsSecurity />}
        {tab === 'display' && <SettingsDisplay />}
        {tab === 'sessions' && <SettingsSessions />}
      </div>
    </div>
  );
}
