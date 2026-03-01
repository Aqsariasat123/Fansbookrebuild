import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminChangePassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPass.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPass !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/admin/profile/password', { currentPassword: current, newPassword: newPass });
      setSuccess('Password changed successfully');
      setCurrent('');
      setNewPass('');
      setConfirm('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="mb-[20px] font-outfit text-[32px] font-bold capitalize text-black">
        Change Password
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] p-[32px]">
        <form onSubmit={handleSubmit} className="flex max-w-[480px] flex-col gap-[16px]">
          {error && (
            <p className="rounded-[8px] bg-red-50 px-[12px] py-[8px] font-outfit text-[14px] text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-[8px] bg-green-50 px-[12px] py-[8px] font-outfit text-[14px] text-green-600">
              {success}
            </p>
          )}
          <label className="flex flex-col gap-[4px]">
            <span className="font-outfit text-[14px] text-black">Current Password *</span>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
            />
          </label>
          <label className="flex flex-col gap-[4px]">
            <span className="font-outfit text-[14px] text-black">New Password *</span>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
            />
          </label>
          <label className="flex flex-col gap-[4px]">
            <span className="font-outfit text-[14px] text-black">Confirm New Password *</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[14px] text-black outline-none"
            />
          </label>
          <div className="mt-[8px] flex gap-[12px]">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] font-outfit text-[16px] text-white"
            >
              {saving ? 'Saving...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="rounded-[80px] border border-[#15191c] px-[32px] py-[10px] font-outfit text-[16px] text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
