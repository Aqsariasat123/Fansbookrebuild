import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5d5d5d]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        {show ? (
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        ) : (
          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C11.74 7.13 12.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
        )}
      </svg>
    </button>
  );

  const inputCls =
    'w-full rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] pr-[40px] font-outfit text-[16px] text-black outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[480px] rounded-[22px] bg-white p-[32px]"
      >
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] flex size-[32px] items-center justify-center rounded-full bg-[#15191c] text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <p className="mb-[24px] text-center font-outfit text-[24px] font-bold text-black">
          Change Password
        </p>
        {error && (
          <p className="mb-[12px] rounded-[8px] bg-red-50 px-[12px] py-[8px] font-outfit text-[14px] text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-[12px] rounded-[8px] bg-green-50 px-[12px] py-[8px] font-outfit text-[14px] text-green-600">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <label className="flex flex-col gap-[6px]">
            <span className="font-outfit text-[16px] font-bold text-black">Old Password</span>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className={inputCls}
              />
              {eyeBtn(showCurrent, () => setShowCurrent(!showCurrent))}
            </div>
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="font-outfit text-[16px] font-bold text-black">New Password</span>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                className={inputCls}
              />
              {eyeBtn(showNew, () => setShowNew(!showNew))}
            </div>
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="font-outfit text-[16px] font-bold text-black">Confirm Password</span>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className={inputCls}
              />
              {eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
            </div>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="mx-auto mt-[8px] w-[240px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] font-outfit text-[16px] text-white"
          >
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminProfile() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [showPwModal, setShowPwModal] = useState(false);

  return (
    <div>
      <p className="mb-[20px] font-outfit text-[32px] font-bold capitalize text-black">
        My Profile
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] px-[26px] py-[40px]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex size-[158px] items-center justify-center rounded-full border-[3px] border-[#2e4882]">
              <img
                src={user?.avatar || '/icons/admin/admin-avatar.png'}
                alt=""
                className="size-[150px] rounded-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 flex size-[30px] items-center justify-center rounded-[20px] bg-[#2e4882]">
              <img
                src="/icons/dashboard/camera-edit.svg"
                alt=""
                className="size-[20px] brightness-0 invert"
              />
            </button>
          </div>
          <p className="mt-[16px] font-outfit text-[24px] font-normal text-black">
            {user?.displayName || 'Admin Fanbook'}
          </p>
          <p className="font-outfit text-[20px] font-normal text-[#5d5d5d]">
            {user?.email || 'admin@fansbook.com'}
          </p>
        </div>
        <div className="mx-auto mt-[40px] max-w-[819px]">
          <button
            onClick={() => navigate('/admin/profile/edit')}
            className="flex w-full items-center justify-between border-b border-[#ddd] py-[20px]"
          >
            <div className="flex items-center gap-[15px]">
              <div className="flex size-[30px] items-center justify-center rounded-[20px] bg-[#2e4882]">
                <img
                  src="/icons/dashboard/edit-property.svg"
                  alt=""
                  className="size-[15px] brightness-0 invert"
                />
              </div>
              <span className="font-outfit text-[20px] font-medium text-black">Edit Profile</span>
            </div>
            <img src="/icons/dashboard/chevron-forward.svg" alt="" className="size-[15px]" />
          </button>
          <button
            onClick={() => setShowPwModal(true)}
            className="flex w-full items-center justify-between py-[20px]"
          >
            <div className="flex items-center gap-[15px]">
              <div className="flex size-[30px] items-center justify-center rounded-[20px] bg-[#2e4882]">
                <img
                  src="/icons/dashboard/password-lock.svg"
                  alt=""
                  className="size-[15px] brightness-0 invert"
                />
              </div>
              <span className="font-outfit text-[20px] font-medium text-black">
                Change Password
              </span>
            </div>
            <img src="/icons/dashboard/chevron-forward.svg" alt="" className="size-[15px]" />
          </button>
        </div>
      </div>
      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </div>
  );
}
