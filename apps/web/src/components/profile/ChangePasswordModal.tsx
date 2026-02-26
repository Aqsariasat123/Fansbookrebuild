import { useState } from 'react';
import { api } from '../../lib/api';
import { Modal, Field, parseApiError } from './Modal';

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

  async function handleSave() {
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
      setError(parseApiError(err, 'Failed to change password'));
    } finally {
      setSaving(false);
    }
  }

  const disabled = saving || !currentPassword || !newPassword || !confirmPassword;

  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <div className="flex flex-col gap-[16px]">
        <Field
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
        <Field
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min 8 chars, uppercase, lowercase, number"
        />
        <Field
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
        />
        {error && <p className="text-[14px] text-red-500">{error}</p>}
        {success && <p className="text-[14px] text-green-500">Password changed successfully!</p>}
        <div className="flex gap-[12px] mt-[8px]">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[12px] border border-[#2a2d30] text-[16px] text-[#5d5d5d] hover:text-[#f8f8f8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={disabled}
            className="flex-1 h-[44px] rounded-[12px] bg-[#2e4882] text-[16px] text-[#f8f8f8] hover:bg-[#3a5a9e] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Change Password'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
