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

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [coverMsg, setCoverMsg] = useState('');
  const [avatarMsg, setAvatarMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSaveName = async () => {
    setSaving(true);
    setNameMsg('');
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
      setTimeout(() => setNameMsg(''), 3000);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) {
      setPwdMsg('Both fields are required');
      return;
    }
    setPwdMsg('');
    try {
      const { data: r } = await api.put('/profile/password', {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      if (r.success) {
        setPwdMsg('Password changed successfully');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setPwdMsg(e.response?.data?.error || 'Failed to change password');
    }
    setTimeout(() => setPwdMsg(''), 4000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarMsg('Uploading...');
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data: r } = await api.post('/profile/avatar', fd);
      if (r.success) {
        setUser(r.data);
        setAvatarMsg('Avatar updated');
      }
    } catch {
      setAvatarMsg('Upload failed');
    }
    setTimeout(() => setAvatarMsg(''), 3000);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverMsg('Uploading...');
    const fd = new FormData();
    fd.append('cover', file);
    try {
      const { data: r } = await api.post('/profile/cover', fd);
      if (r.success) {
        setUser(r.data);
        setCoverMsg('Cover updated');
      }
    } catch {
      setCoverMsg('Upload failed');
    }
    setTimeout(() => setCoverMsg(''), 3000);
  };

  const handleDeleteAvatar = async () => {
    try {
      const { data: r } = await api.delete('/profile/avatar');
      if (r.success) {
        setUser(r.data);
        setAvatarMsg('Avatar removed');
      }
    } catch {
      setAvatarMsg('Failed to delete');
    }
    setTimeout(() => setAvatarMsg(''), 3000);
  };

  const handleDeleteCover = async () => {
    try {
      const { data: r } = await api.delete('/profile/cover');
      if (r.success) {
        setUser(r.data);
        setCoverMsg('Cover removed');
      }
    } catch {
      setCoverMsg('Failed to delete');
    }
    setTimeout(() => setCoverMsg(''), 3000);
  };

  const handleAddEmail = async (email: string) => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailMsg('Please enter a valid email');
      return;
    }
    setEmailMsg('');
    try {
      const { data: r } = await api.put('/profile/secondary-email', { email: email.trim() });
      if (r.success) {
        setUser(r.data);
        setEmailMsg('Email added');
      }
    } catch {
      setEmailMsg('Failed to add email');
    }
    setTimeout(() => setEmailMsg(''), 3000);
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
    setTimeout(() => setEmailMsg(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const secondaryEmail = (user as unknown as Record<string, unknown>)?.secondaryEmail as
    | string
    | null
    | undefined;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">Settings</p>

      <div className="bg-[#0e1012] rounded-[22px] px-[20px] py-[20px] flex flex-col">
        <p className="text-[16px] text-[#f8f8f8] mb-[16px]">Account Setting</p>

        {/* Cover Photo */}
        <CoverSection
          cover={user?.cover}
          coverMsg={coverMsg}
          onUpload={handleCoverUpload}
          onDelete={handleDeleteCover}
        />

        <Divider />

        {/* Profile picture */}
        <AvatarSection
          avatar={user?.avatar}
          avatarMsg={avatarMsg}
          onUpload={handleAvatarUpload}
          onDelete={handleDeleteAvatar}
        />

        {/* Full name */}
        <p className="text-[16px] text-[#5d5d5d] mt-[8px]">Full name</p>
        <div className="flex gap-[20px] mt-[8px]">
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

        {/* Contact Email */}
        <EmailSection
          email={user?.email}
          secondaryEmail={secondaryEmail}
          emailMsg={emailMsg}
          onAdd={handleAddEmail}
          onDelete={handleDeleteEmail}
        />

        <Divider />

        {/* Password */}
        <PasswordSection pwdMsg={pwdMsg} onChangePassword={handleChangePassword} />

        <Divider />

        {/* Account Security */}
        <p className="text-[16px] text-[#f8f8f8] mb-[12px]">Account Security</p>
        <div className="flex items-center gap-[15px]">
          <button
            onClick={handleLogout}
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
