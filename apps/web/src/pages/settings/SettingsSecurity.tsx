import { useState } from 'react';
import { api } from '../../lib/api';

export function SettingsSecurity() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd) {
      setMsg('All fields required');
      return;
    }
    if (newPwd !== confirmPwd) {
      setMsg('Passwords do not match');
      return;
    }
    if (newPwd.length < 8) {
      setMsg('Min 8 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/profile/password', {
        currentPassword: currentPwd,
        newPassword: newPwd,
        confirmPassword: confirmPwd,
      });
      setMsg('Password changed');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setMsg(e.response?.data?.error || 'Failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const inputCls =
    'w-full rounded-[12px] bg-muted px-3 py-[10px] text-[14px] text-foreground outline-none border border-border/30';

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-foreground">Change Password</p>
      <div className="relative">
        <input
          type={showCurrent ? 'text' : 'password'}
          placeholder="Current Password"
          value={currentPwd}
          onChange={(e) => setCurrentPwd(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground"
        >
          {showCurrent ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="relative">
        <input
          type={showNew ? 'text' : 'password'}
          placeholder="New Password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground"
        >
          {showNew ? 'Hide' : 'Show'}
        </button>
      </div>
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
        className={inputCls}
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Password'}
        </button>
        {msg && <span className="text-[12px] text-primary">{msg}</span>}
      </div>
    </div>
  );
}
