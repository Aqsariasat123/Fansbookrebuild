import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface NotifPref {
  type: string;
  inApp: boolean;
  email: boolean;
}

const TYPE_LABELS: Record<string, { label: string; desc: string }> = {
  LIKE: { label: 'Likes', desc: 'When someone likes your content' },
  COMMENT: { label: 'Comments', desc: 'When someone comments on your post' },
  FOLLOW: { label: 'Follows', desc: 'When someone follows you' },
  SUBSCRIBE: { label: 'Subscriptions', desc: 'When someone subscribes to you' },
  TIP: { label: 'Tips', desc: 'When you receive a tip' },
  MESSAGE: { label: 'Messages', desc: 'When you receive a new message' },
  LIVE: { label: 'Live Streams', desc: 'When a creator goes live' },
  STORY: { label: 'Stories', desc: 'When someone posts a story' },
  MENTION: { label: 'Mentions', desc: 'When someone mentions you' },
  POST: { label: 'Posts', desc: 'When a creator publishes a post' },
  SYSTEM: { label: 'System', desc: 'Platform announcements and updates' },
  BADGE: { label: 'Badges', desc: 'When you earn a badge' },
  MARKETPLACE: { label: 'Marketplace', desc: 'Marketplace activity updates' },
};

export function SettingsNotifications() {
  const [prefs, setPrefs] = useState<NotifPref[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/settings/notification-preferences')
      .then((res) => {
        if (res.data.data) setPrefs(res.data.data);
      })
      .catch(() => {});
  }, []);

  const toggle = (type: string, field: 'inApp' | 'email') => {
    setPrefs((prev) => prev.map((p) => (p.type === type ? { ...p, [field]: !p[field] } : p)));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings/notification-preferences', { preferences: prefs });
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
      <p className="text-[16px] text-foreground">Notification Preferences</p>
      <div className="grid grid-cols-[1fr_60px_60px] gap-[8px] text-[12px] text-muted-foreground px-[14px]">
        <span>Type</span>
        <span className="text-center">In-App</span>
        <span className="text-center">Email</span>
      </div>
      {prefs.map((p) => {
        const info = TYPE_LABELS[p.type];
        if (!info) return null;
        return (
          <div
            key={p.type}
            className="grid grid-cols-[1fr_60px_60px] items-center gap-[8px] rounded-[12px] bg-muted p-[14px]"
          >
            <div>
              <p className="text-[14px] text-foreground">{info.label}</p>
              <p className="text-[12px] text-muted-foreground">{info.desc}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => toggle(p.type, 'inApp')}
                className={`h-[26px] w-[46px] rounded-full transition-colors ${p.inApp ? 'bg-[#01adf1]' : 'bg-muted-foreground/40'}`}
              >
                <div
                  className={`h-[22px] w-[22px] rounded-full bg-card transition-transform ${p.inApp ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
                />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => toggle(p.type, 'email')}
                className={`h-[26px] w-[46px] rounded-full transition-colors ${p.email ? 'bg-[#01adf1]' : 'bg-muted-foreground/40'}`}
              >
                <div
                  className={`h-[22px] w-[22px] rounded-full bg-card transition-transform ${p.email ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
                />
              </button>
            </div>
          </div>
        );
      })}
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
