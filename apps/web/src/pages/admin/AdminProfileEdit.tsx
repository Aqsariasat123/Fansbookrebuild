import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { ProfileField } from './AdminProfileEditField';

function str(v: string | null | undefined) {
  return v ?? '';
}

function initForm(user: ReturnType<typeof useAuthStore.getState>['user']) {
  return {
    firstName: str(user?.firstName),
    lastName: str(user?.lastName),
    username: str(user?.username),
    mobileNumber: str(user?.mobileNumber),
    email: str(user?.email),
  };
}

export default function AdminProfileEdit() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [form, setForm] = useState(() => initForm(user));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: r } = await api.put('/admin/profile', form);
      setUser(r.data as never);
      navigate('/admin/profile');
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const up = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));
  const cls =
    'w-full rounded-[6px] border border-[#15191c] bg-transparent px-[12px] py-[10px] font-outfit text-[16px] font-normal text-black outline-none placeholder:text-[#5d5d5d]';

  return (
    <div>
      <p className="mb-[20px] font-outfit text-[32px] font-normal text-black">
        My Profile {'>'} Edit
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] p-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <form onSubmit={handleSubmit} className="flex max-w-[500px] flex-col gap-[16px]">
          <ProfileField
            label="First Name"
            value={form.firstName}
            onChange={(v) => up('firstName', v)}
            placeholder="Enter First Name"
            inputCls={cls}
          />
          <ProfileField
            label="Last Name"
            value={form.lastName}
            onChange={(v) => up('lastName', v)}
            placeholder="Enter Last Name"
            inputCls={cls}
          />
          <ProfileField label="Username" value={form.username} readOnly inputCls={cls} />
          <ProfileField
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={(v) => up('mobileNumber', v)}
            placeholder="Enter Mobile Number"
            inputCls={cls}
          />
          <ProfileField label="Email" value={form.email} readOnly inputCls={cls} />
          <div className="mt-[8px] flex gap-[16px]">
            <button
              type="submit"
              disabled={loading}
              className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] font-outfit text-[16px] text-[#f8f8f8] disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="rounded-[80px] border border-[#15191c] px-[32px] py-[10px] font-outfit text-[16px] text-[#15191c]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
