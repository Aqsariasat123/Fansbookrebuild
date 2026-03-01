import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

export function SettingsSecurity() {
  return (
    <div className="flex flex-col gap-[24px]">
      <ChangePasswordSection />
      <div className="border-t border-border" />
      <TwoFactorSection />
    </div>
  );
}

function TwoFactorSection() {
  const user = useAuthStore((s) => s.user);
  const [enabled, setEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ otpAuthUrl: string; backupCodes: string[] } | null>(
    null,
  );
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Check from user data if 2FA is enabled
    if (user && 'twoFactorEnabled' in user)
      setEnabled(!!(user as Record<string, unknown>).twoFactorEnabled);
  }, [user]);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/2fa/setup');
      setSetupData(res.data.data);
    } catch {
      setMsg('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (verifyCode.length !== 6) return;
    setLoading(true);
    try {
      await api.post('/auth/2fa/verify-setup', { code: verifyCode });
      setEnabled(true);
      setSetupData(null);
      setMsg('2FA enabled!');
    } catch {
      setMsg('Invalid code');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await api.post('/auth/2fa/disable');
      setEnabled(false);
      setMsg('2FA disabled');
    } catch {
      setMsg('Failed to disable');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] text-foreground">Two-Factor Authentication</p>
      <p className="text-[13px] text-muted-foreground">
        Add an extra layer of security to your account.
      </p>

      {!enabled && !setupData && (
        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-fit rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Enable 2FA'}
        </button>
      )}

      {setupData && (
        <div className="flex flex-col gap-[12px] rounded-[12px] bg-muted p-[16px]">
          <p className="text-[14px] font-medium text-foreground">
            Scan this QR code with your authenticator app:
          </p>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.otpAuthUrl)}`}
              alt="QR Code"
              className="size-[200px] rounded-[8px]"
            />
          </div>
          <div>
            <p className="text-[13px] font-medium text-foreground">Backup Codes (save these!):</p>
            <div className="mt-[4px] grid grid-cols-2 gap-[4px]">
              {setupData.backupCodes.map((code) => (
                <span
                  key={code}
                  className="rounded-[4px] bg-card px-[8px] py-[4px] text-center font-mono text-[12px] text-foreground"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
          <input
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="rounded-[8px] bg-card px-[12px] py-[10px] text-center text-[16px] tracking-widest text-foreground outline-none"
          />
          <button
            onClick={handleVerifySetup}
            disabled={loading || verifyCode.length !== 6}
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] text-white disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </button>
        </div>
      )}

      {enabled && (
        <div className="flex items-center gap-[12px]">
          <span className="rounded-[50px] bg-green-500/20 px-[12px] py-[4px] text-[12px] text-green-400">
            Enabled
          </span>
          <button
            onClick={handleDisable}
            disabled={loading}
            className="text-[13px] text-red-400 hover:underline"
          >
            {loading ? 'Disabling...' : 'Disable 2FA'}
          </button>
        </div>
      )}

      {msg && <p className="text-[12px] text-[#01adf1]">{msg}</p>}
    </div>
  );
}

function ChangePasswordSection() {
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
