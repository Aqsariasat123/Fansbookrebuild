import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

function FormField({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <p className="capitalize font-medium text-[20px] text-[#f8f8f8]">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`h-[46px] rounded-[6px] border border-[#5d5d5d] bg-transparent px-[12px] py-[14px] text-[13px] font-extralight outline-none transition-colors ${
          readOnly ? 'text-[#5d5d5d] cursor-not-allowed' : 'text-[#f8f8f8] focus:border-[#2e80c8]'
        }`}
      />
    </div>
  );
}

export default function ProfileEdit() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setMobileNumber(user.mobileNumber ?? '');
    }
  }, [user]);

  async function handleUpdate() {
    setSaving(true);
    setError('');
    try {
      const { data: res } = await api.put('/profile', {
        firstName,
        lastName,
        mobileNumber,
      });
      if (res.success && res.data) {
        setUser({ ...user!, ...res.data });
        navigate('/profile');
      }
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { error?: string } } };
      setError(axErr?.response?.data?.error ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <p className="text-[32px] font-bold text-[#f8f8f8] capitalize">my profile</p>
      <div className="rounded-[22px] bg-[#0e1012] px-[26px] py-[35px]">
        <div className="flex flex-col gap-[20px] items-center">
          <FormField
            label="First Name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Enter first name"
          />
          <FormField
            label="Last Name"
            value={lastName}
            onChange={setLastName}
            placeholder="Enter last name"
          />
          <FormField label="User Name" value={user?.username ?? ''} readOnly />
          <FormField
            label="Mobile Number"
            value={mobileNumber}
            onChange={setMobileNumber}
            placeholder="Enter mobile Number"
          />
          <FormField label="Email" value={user?.email ?? ''} readOnly />
          {error && <p className="text-[14px] text-red-500 w-full">{error}</p>}
          <div className="flex flex-col items-center w-[306px] mt-[10px]">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full h-[45px] rounded-[80px] bg-gradient-to-l from-[#a61651] to-[#01adf1] text-[20px] text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full h-[45px] mt-[25px] rounded-[80px] border border-[#2e4882] bg-[#f8f8f8] text-[20px] text-black shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
