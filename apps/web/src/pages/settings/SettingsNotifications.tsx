import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface NotifSettings {
  emailNotifs: boolean;
  pushNotifs: boolean;
  inAppNotifs: boolean;
  dmNotifs: boolean;
}

const defaults: NotifSettings = {
  emailNotifs: true,
  pushNotifs: true,
  inAppNotifs: true,
  dmNotifs: true,
};

export function SettingsNotifications() {
  const [settings, setSettings] = useState<NotifSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        const s = res.data.data?.notifSettings;
        if (s && typeof s === 'object') setSettings({ ...defaults, ...s });
      })
      .catch(() => {});
  }, []);

  const toggle = (key: keyof NotifSettings) => {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings/notifications', settings);
      setMsg('Saved');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-[#f8f8f8]">Notification Preferences</p>
      {(
        [
          ['emailNotifs', 'Email Notifications', 'Receive updates via email'],
          ['pushNotifs', 'Push Notifications', 'Browser push notifications'],
          ['inAppNotifs', 'In-App Notifications', 'Show notification badge'],
          ['dmNotifs', 'DM Notifications', 'Notify for new messages'],
        ] as const
      ).map(([key, label, desc]) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-[12px] bg-[#15191c] p-[14px]"
        >
          <div>
            <p className="text-[14px] text-[#f8f8f8]">{label}</p>
            <p className="text-[12px] text-[#5d5d5d]">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className={`h-[26px] w-[46px] rounded-full transition-colors ${settings[key] ? 'bg-[#01adf1]' : 'bg-[#5d5d5d]'}`}
          >
            <div
              className={`h-[22px] w-[22px] rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
            />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {msg && <span className="text-[12px] text-[#01adf1]">{msg}</span>}
      </div>
    </div>
  );
}
