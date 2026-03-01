import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function AdminProfile() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div>
      <p className="mb-[20px] font-outfit text-[32px] font-normal text-black">My Profile</p>
      <div className="rounded-[22px] bg-[#f8f8f8] p-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-[20px]">
          <img
            src={user?.avatar || '/icons/admin/admin-avatar.png'}
            alt=""
            className="size-[80px] rounded-full object-cover"
          />
          <div>
            <p className="font-outfit text-[24px] font-normal text-black">
              {user?.displayName || 'Admin'}
            </p>
            <p className="font-outfit text-[16px] font-normal text-[#5d5d5d]">
              {user?.email || 'admin@fansbook.com'}
            </p>
          </div>
        </div>
        <div className="mt-[24px] flex gap-[16px]">
          <button
            onClick={() => navigate('/admin/profile/edit')}
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] font-outfit text-[16px] font-normal text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)]"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/admin/profile/change-password')}
            className="rounded-[80px] border border-[#15191c] px-[24px] py-[10px] font-outfit text-[16px] font-normal text-[#15191c]"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
