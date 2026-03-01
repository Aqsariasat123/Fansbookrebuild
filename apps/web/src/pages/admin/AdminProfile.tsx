import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function AdminProfile() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div>
      <p className="mb-[20px] font-outfit text-[32px] font-bold capitalize text-black">
        My Profile
      </p>
      <div className="rounded-[22px] bg-[#f8f8f8] px-[26px] py-[40px]">
        {/* Avatar + Name centered */}
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

        {/* Menu items */}
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
            onClick={() => navigate('/admin/profile/change-password')}
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
    </div>
  );
}
