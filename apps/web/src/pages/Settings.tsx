import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { CoverSection } from '../components/settings/CoverSection';
import { AvatarSection } from '../components/settings/AvatarSection';
import { EmailSection } from '../components/settings/EmailSection';
import { PasswordSection } from '../components/settings/PasswordSection';
import { LogoutIcon, DeleteIcon } from '../components/settings/SettingsIcons';
import { FieldInput, Divider } from '../components/settings/SettingsShared';

function useTimedMessage(): [string, (msg: string, ms?: number) => void] {
  const [msg, setMsg] = useState('');
  const set = (m: string, ms = 3000) => {
    setMsg(m);
    setTimeout(() => setMsg(''), ms);
  };
  return [msg, set];
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [nameMsg, setNameMsg] = useTimedMessage();
  const [pwdMsg, setPwdMsg] = useTimedMessage();
  const [coverMsg, setCoverMsg] = useTimedMessage();
  const [avatarMsg, setAvatarMsg] = useTimedMessage();
  const [emailMsg, setEmailMsg] = useTimedMessage();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const displayName = [firstName, lastName].filter(Boolean).join(' ') || undefined;
      const { data: r } = await api.put('/profile', { firstName, lastName, displayName });
      if (r.success) {
        setUser(r.data);
        setNameMsg('Profile updated successfully');
      }
    } catch {
      setNameMsg('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) {
      setPwdMsg('Both fields are required');
      return;
    }
    try {
      const { data: r } = await api.put('/profile/password', {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      if (r.success) setPwdMsg('Password changed successfully');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setPwdMsg(e.response?.data?.error || 'Failed to change password');
    }
  };

  const handleUpload = async (
    field: 'avatar' | 'cover',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setMsg = field === 'avatar' ? setAvatarMsg : setCoverMsg;
    setMsg('Uploading...');
    const fd = new FormData();
    fd.append(field, file);
    try {
      const { data: r } = await api.post(`/profile/${field}`, fd);
      if (r.success) {
        setUser(r.data);
        setMsg(`${field === 'avatar' ? 'Avatar' : 'Cover'} updated`);
      }
    } catch {
      setMsg('Upload failed');
    }
  };

  const handleDelete = async (field: 'avatar' | 'cover') => {
    const setMsg = field === 'avatar' ? setAvatarMsg : setCoverMsg;
    try {
      const { data: r } = await api.delete(`/profile/${field}`);
      if (r.success) {
        setUser(r.data);
        setMsg(`${field === 'avatar' ? 'Avatar' : 'Cover'} removed`);
      }
    } catch {
      setMsg('Failed to delete');
    }
  };

  const handleAddEmail = async (email: string) => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailMsg('Please enter a valid email');
      return;
    }
    try {
      const { data: r } = await api.put('/profile/secondary-email', { email: email.trim() });
      if (r.success) {
        setUser(r.data);
        setEmailMsg('Email added');
      }
    } catch {
      setEmailMsg('Failed to add email');
    }
  };

  const handleDeleteEmail = async () => {
    try {
      const { data: r } = await api.delete('/profile/secondary-email');
      if (r.success) {
        setUser(r.data);
        setEmailMsg('Email removed');
      }
    } catch {
      setEmailMsg('Failed to remove');
    }
  };

  const secondaryEmail = (user as unknown as Record<string, unknown>)?.secondaryEmail as
    | string
    | null
    | undefined;

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">Settings</p>

      <div className="flex flex-col rounded-[11px] bg-[#0e1012] px-[16px] py-[16px] md:rounded-[22px] md:px-[20px] md:py-[20px]">
        <p className="text-[16px] text-[#f8f8f8] mb-[16px]">Account Setting</p>

        <CoverSection
          cover={user?.cover}
          coverMsg={coverMsg}
          onUpload={(e) => handleUpload('cover', e)}
          onDelete={() => handleDelete('cover')}
        />
        <Divider />
        <AvatarSection
          avatar={user?.avatar}
          avatarMsg={avatarMsg}
          onUpload={(e) => handleUpload('avatar', e)}
          onDelete={() => handleDelete('avatar')}
        />

        <p className="text-[16px] text-[#5d5d5d] mt-[8px]">Full name</p>
        <div className="mt-[8px] flex flex-col gap-[8px] md:flex-row md:gap-[20px]">
          <FieldInput label="First name" value={firstName} onChange={setFirstName} />
          <FieldInput label="Last name" value={lastName} onChange={setLastName} />
        </div>
        <div className="flex items-center gap-[12px] mt-[12px]">
          <button
            onClick={handleSaveName}
            disabled={saving}
            className="bg-[#01adf1] hover:bg-[#0195cc] text-[#f8f8f8] text-[12px] font-medium px-[20px] py-[10px] rounded-[9px] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
          {nameMsg && <span className="text-[12px] text-[#01adf1]">{nameMsg}</span>}
        </div>

        <Divider />
        <EmailSection
          email={user?.email}
          secondaryEmail={secondaryEmail}
          emailMsg={emailMsg}
          onAdd={handleAddEmail}
          onDelete={handleDeleteEmail}
        />
        <Divider />
        <PasswordSection pwdMsg={pwdMsg} onChangePassword={handleChangePassword} />
        <Divider />

        <p className="text-[16px] text-[#f8f8f8] mb-[12px]">Account Security</p>
        <div className="flex items-center gap-[15px]">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-[#15191c] rounded-[9px] p-[10px] flex items-center gap-[10px] hover:opacity-80 transition-opacity"
          >
            <LogoutIcon />
            <span className="text-[12px] text-[#f8f8f8]">Logout</span>
          </button>
          <button className="bg-[#15191c] rounded-[9px] p-[10px] flex items-center gap-[10px] hover:opacity-80 transition-opacity">
            <DeleteIcon />
            <span className="text-[12px] text-[#f8f8f8]">Delete my account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
