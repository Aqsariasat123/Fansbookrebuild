import { useState } from 'react';
import { api, extractError, inputClass, labelClass, saveButtonClass } from './shared';

interface ChangePasswordTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function ChangePasswordTab({ onToast }: ChangePasswordTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (newPassword !== confirmPassword) {
      onToast('error', 'Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      onToast('success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  const eyeBtn =
    'absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5d5d5d] hover:text-[#f8f8f8] text-[13px] transition-colors';

  return (
    <div className="flex flex-col gap-[20px] max-w-[600px]">
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Current Password</label>
        <div className="relative">
          <input
            type={showCurrentPw ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className={inputClass}
          />
          <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className={eyeBtn}>
            {showCurrentPw ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>New Password</label>
        <div className="relative">
          <input
            type={showNewPw ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={inputClass}
          />
          <button type="button" onClick={() => setShowNewPw(!showNewPw)} className={eyeBtn}>
            {showNewPw ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPw ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={inputClass}
          />
          <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className={eyeBtn}>
            {showConfirmPw ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-[10px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
