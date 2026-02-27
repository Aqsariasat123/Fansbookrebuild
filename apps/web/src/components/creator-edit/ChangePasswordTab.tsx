import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  labelClass,
  saveButtonClass,
  cancelButtonClass,
} from './shared';

interface ChangePasswordTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function ChangePasswordTab({ onToast }: ChangePasswordTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState([false, false, false]);
  const [saving, setSaving] = useState(false);

  const toggle = (i: number) => setShowPw((p) => p.map((v, j) => (j === i ? !v : v)));

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

  const fields = [
    { label: 'Old Password', value: currentPassword, set: setCurrentPassword, idx: 0 },
    { label: 'New Password', value: newPassword, set: setNewPassword, idx: 1 },
    { label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword, idx: 2 },
  ];

  return (
    <div className="flex flex-col gap-[20px]">
      {fields.map((f) => (
        <div key={f.idx} className="flex flex-col gap-[10px]">
          <label className={labelClass}>{f.label}</label>
          <div className="relative">
            <input
              type={showPw[f.idx] ? 'text' : 'password'}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder="............"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => toggle(f.idx)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5d5d5d] hover:text-[#f8f8f8] transition-colors"
            >
              <EyeIcon show={showPw[f.idx]} />
            </button>
          </div>
        </div>
      ))}
      <div className="mt-[20px] flex flex-col items-center gap-[16px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Update'}
        </button>
        <button className={cancelButtonClass}>Cancel</button>
      </div>
    </div>
  );
}
