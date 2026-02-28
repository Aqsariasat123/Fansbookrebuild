import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';

const IMG = '/icons/dashboard';

function getDisplayName(
  user: { firstName?: string | null; lastName?: string | null; displayName?: string | null } | null,
): string {
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
  return user?.displayName || 'User';
}

function AvatarSection({
  avatar,
  displayName,
  onAvatarChange,
  uploading,
}: {
  avatar: string | null;
  displayName: string;
  onAvatarChange: (file: File) => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const initial = displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="relative inline-block">
      <div className="size-[100px] md:size-[158px] rounded-full border-[3px] md:border-[4px] border-[#2e80c8] flex items-center justify-center">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="size-[94px] md:size-[150px] rounded-full object-cover"
          />
        ) : (
          <div className="size-[94px] md:size-[150px] rounded-full bg-[#2e4882] flex items-center justify-center">
            <span className="text-[32px] md:text-[48px] font-medium text-foreground">
              {initial}
            </span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onAvatarChange(f);
          e.target.value = '';
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-[6px] right-[6px] size-[30px] rounded-[20px] bg-[#2e4882] flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        <img src={`${IMG}/camera-edit.svg`} alt="Edit avatar" className="size-[20px]" />
      </button>
    </div>
  );
}

function ActionRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-[10px] md:gap-[15px]">
        <div className="size-[24px] md:size-[30px] rounded-[20px] bg-[#2e4882] flex items-center justify-center shrink-0">
          <img src={icon} alt="" className="size-[12px] md:size-[15px]" />
        </div>
        <span className="text-[14px] md:text-[20px] font-normal text-foreground">{label}</span>
      </div>
      <img src={`${IMG}/arrow-forward-ios.svg`} alt="" className="size-[16px] md:size-[20px]" />
    </button>
  );
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const displayName = getDisplayName(user);
  const username = user?.username || 'unknown';
  const avatar = user?.avatar || null;

  async function handleAvatarChange(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data: res } = await api.post('/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data) setUser({ ...user!, ...res.data });
    } catch {
      /* user sees no change */
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-[12px] md:gap-[22px]">
      <p className="text-[20px] font-normal text-foreground capitalize">my profile</p>
      <div className="rounded-[11px] md:rounded-[22px] bg-card px-[16px] py-[24px] md:px-[27px] md:py-[44px] flex flex-col items-center">
        <AvatarSection
          avatar={avatar}
          displayName={displayName}
          onAvatarChange={handleAvatarChange}
          uploading={uploading}
        />
        <div className="flex flex-col items-center mt-[10px] md:mt-[13px]">
          <p className="text-[18px] md:text-[24px] font-normal text-foreground">{displayName}</p>
          <p className="text-[14px] md:text-[20px] font-normal text-muted-foreground">
            @{username}
          </p>
        </div>
        <div className="w-full mt-[30px] md:mt-[50px] flex flex-col">
          <ActionRow
            icon={`${IMG}/edit-property.svg`}
            label="Edit Profile"
            onClick={() => navigate('/profile/edit')}
          />
          <div className="w-full h-px bg-[#2a2d30] my-[12px] md:my-[16px]" />
          <ActionRow
            icon={`${IMG}/password-lock.svg`}
            label="Change Password"
            onClick={() => setPasswordOpen(true)}
          />
          <div className="w-full h-px bg-[#2a2d30] my-[12px] md:my-[16px]" />
        </div>
      </div>
      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  );
}
