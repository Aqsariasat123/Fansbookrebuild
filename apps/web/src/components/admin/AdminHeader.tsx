import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';

export function AdminHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="flex h-[95px] items-center justify-end bg-[#f8f8f8] px-[30px]">
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-[10px]">
          <img
            src={user?.avatar || '/icons/admin/admin-avatar.png'}
            alt=""
            className="size-[39px] rounded-full object-cover"
          />
          <span className="font-outfit text-[20px] font-normal text-black">Admin Fanbook</span>
          <img src="/icons/admin/arrow-dd-header.svg" alt="" className="h-[5px] w-[10px]" />
        </button>
        {open && (
          <div className="absolute right-0 top-[52px] z-50 w-[200px] rounded-[12px] bg-white py-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/admin/profile');
              }}
              className="w-full px-[16px] py-[10px] text-left font-outfit text-[16px] font-normal text-black hover:bg-[#f5f5f5]"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-[16px] py-[10px] text-left font-outfit text-[16px] font-normal text-red-500 hover:bg-[#f5f5f5]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
