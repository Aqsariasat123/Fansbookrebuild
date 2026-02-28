import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'SUBSCRIBERS' | 'PRIVATE';
  allowDMs: 'EVERYONE' | 'SUBSCRIBERS' | 'NOBODY';
  showOnlineStatus: boolean;
}

const defaults: PrivacySettings = {
  profileVisibility: 'PUBLIC',
  allowDMs: 'EVERYONE',
  showOnlineStatus: true,
};

export function SettingsPrivacy() {
  const [settings, setSettings] = useState<PrivacySettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        const s = res.data.data?.privacySettings;
        if (s && typeof s === 'object') setSettings({ ...defaults, ...s });
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings/privacy', settings);
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
      <p className="text-[16px] text-foreground">Privacy Settings</p>

      <div className="rounded-[12px] bg-muted p-[14px]">
        <p className="mb-2 text-[14px] text-foreground">Profile Visibility</p>
        <select
          value={settings.profileVisibility}
          onChange={(e) =>
            setSettings((p) => ({
              ...p,
              profileVisibility: e.target.value as PrivacySettings['profileVisibility'],
            }))
          }
          className="w-full rounded-[12px] bg-card px-3 py-2 text-[14px] text-foreground outline-none"
        >
          <option value="PUBLIC">Public</option>
          <option value="SUBSCRIBERS">Subscribers Only</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      <div className="rounded-[12px] bg-muted p-[14px]">
        <p className="mb-2 text-[14px] text-foreground">Who Can DM You</p>
        <select
          value={settings.allowDMs}
          onChange={(e) =>
            setSettings((p) => ({ ...p, allowDMs: e.target.value as PrivacySettings['allowDMs'] }))
          }
          className="w-full rounded-[12px] bg-card px-3 py-2 text-[14px] text-foreground outline-none"
        >
          <option value="EVERYONE">Everyone</option>
          <option value="SUBSCRIBERS">Subscribers Only</option>
          <option value="NOBODY">Nobody</option>
        </select>
      </div>

      <div className="flex items-center justify-between rounded-[12px] bg-muted p-[14px]">
        <div>
          <p className="text-[14px] text-foreground">Show Online Status</p>
          <p className="text-[12px] text-muted-foreground">
            Let others see when you&apos;re online
          </p>
        </div>
        <button
          onClick={() => setSettings((p) => ({ ...p, showOnlineStatus: !p.showOnlineStatus }))}
          className={`h-[26px] w-[46px] rounded-full transition-colors ${settings.showOnlineStatus ? 'bg-[#01adf1]' : 'bg-muted-foreground'}`}
        >
          <div
            className={`h-[22px] w-[22px] rounded-full bg-card transition-transform ${settings.showOnlineStatus ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
          />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {msg && <span className="text-[12px] text-primary">{msg}</span>}
      </div>
    </div>
  );
}
