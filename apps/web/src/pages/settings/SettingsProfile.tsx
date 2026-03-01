import { useNavigate } from 'react-router-dom';

export function SettingsProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Profile</p>
      <p className="text-[13px] text-muted-foreground">
        Manage your display name, bio, avatar, and other profile details.
      </p>
      <button
        onClick={() => navigate('/profile/edit')}
        className="w-fit rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
      >
        Edit Profile
      </button>
    </div>
  );
}
