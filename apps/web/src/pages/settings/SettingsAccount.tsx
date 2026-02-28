import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

export function SettingsAccount() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [timezone, setTimezone] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivatePwd, setDeactivatePwd] = useState('');
  const [deactivateMsg, setDeactivateMsg] = useState('');

  const saveAccount = async () => {
    setSaving(true);
    try {
      await api.put('/settings/account', { timezone });
      setMsg('Saved');
      setTimeout(() => setMsg(''), 2000);
    } catch {
      setMsg('Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatePwd) {
      setDeactivateMsg('Password required');
      return;
    }
    try {
      await api.delete('/settings/account', { data: { password: deactivatePwd } });
      logout();
      navigate('/login');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setDeactivateMsg(e.response?.data?.error || 'Failed');
    }
  };

  const inputCls =
    'w-full rounded-[12px] bg-[#15191c] px-3 py-[10px] text-[14px] text-[#f8f8f8] outline-none border border-[#5d5d5d]/30';

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-[#f8f8f8]">Account Settings</p>

      <div className="rounded-[12px] bg-[#15191c] p-[14px]">
        <p className="mb-2 text-[14px] text-[#f8f8f8]">Timezone</p>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
          <option value="">Auto-detect</option>
          {[
            'UTC',
            'America/New_York',
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Asia/Tokyo',
            'Asia/Karachi',
            'Australia/Sydney',
          ].map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={saveAccount}
          disabled={saving}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {msg && <span className="text-[12px] text-[#01adf1]">{msg}</span>}
      </div>

      <div className="mt-4 rounded-[12px] border border-red-500/30 bg-[#15191c] p-[14px]">
        <p className="text-[14px] text-red-400">Danger Zone</p>
        <p className="mt-1 text-[12px] text-[#5d5d5d]">
          Deactivating your account is irreversible.
        </p>
        {!showDeactivate ? (
          <button
            onClick={() => setShowDeactivate(true)}
            className="mt-3 rounded-[8px] bg-red-500/20 px-4 py-2 text-[12px] text-red-400 hover:bg-red-500/30"
          >
            Deactivate Account
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="password"
              placeholder="Enter your password"
              value={deactivatePwd}
              onChange={(e) => setDeactivatePwd(e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeactivate}
                className="rounded-[8px] bg-red-500 px-4 py-2 text-[12px] text-white"
              >
                Confirm Deactivate
              </button>
              <button
                onClick={() => {
                  setShowDeactivate(false);
                  setDeactivatePwd('');
                }}
                className="rounded-[8px] bg-[#0e1012] px-4 py-2 text-[12px] text-[#5d5d5d]"
              >
                Cancel
              </button>
            </div>
            {deactivateMsg && <p className="text-[12px] text-red-400">{deactivateMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
