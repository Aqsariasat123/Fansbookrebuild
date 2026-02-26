import { useState } from 'react';
import { api } from '../../lib/api';

function EyeIcon({ off }: { off: boolean }) {
  if (off) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <p className="font-medium text-[16px] text-black">{label}</p>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••"
          className="w-full h-[46px] rounded-[6px] border border-[#ccc] bg-white px-[12px] pr-[44px] text-[14px] text-black outline-none focus:border-[#2e80c8] transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-[12px] top-1/2 -translate-y-1/2"
        >
          <EyeIcon off={!visible} />
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function resetForm() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  }

  async function handleSubmit() {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data: res } = await api.put('/profile/password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      }
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { error?: string } } };
      setError(axErr?.response?.data?.error ?? 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const disabled = saving || !currentPassword || !newPassword || !confirmPassword;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[22px] bg-white p-[32px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] size-[36px] rounded-full bg-[#333] flex items-center justify-center hover:bg-[#555] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <h2 className="text-[20px] font-bold text-black text-center mb-[24px]">Change Password</h2>

        <div className="flex flex-col gap-[16px]">
          <PasswordField
            label="Old Password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} />
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          {error && <p className="text-[14px] text-red-500">{error}</p>}
          {success && <p className="text-[14px] text-green-600">Password changed!</p>}

          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="w-full h-[45px] mt-[8px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] text-[18px] text-white font-medium shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
