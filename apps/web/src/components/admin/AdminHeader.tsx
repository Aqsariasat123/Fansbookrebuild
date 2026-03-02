import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';

interface Props {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: Props) {
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
    <header className="flex h-[60px] items-center justify-between bg-[#f8f8f8] px-[16px] md:h-[95px] md:justify-end md:px-[30px]">
      {/* Hamburger - mobile only */}
      <button onClick={onMenuToggle} className="flex items-center lg:hidden">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#15191c">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-[8px]">
          <img
            src={user?.avatar || '/icons/admin/admin-avatar.png'}
            alt=""
            className="size-[32px] rounded-full object-cover md:size-[39px]"
          />
          <span className="hidden font-outfit text-[16px] font-normal text-black md:inline md:text-[20px]">
            Admin Fanbook
          </span>
          <img
            src="/icons/admin/arrow-dd-header.svg"
            alt=""
            className="hidden h-[5px] w-[10px] md:inline"
          />
        </button>
        {open && (
          <div className="absolute right-0 top-[44px] z-50 w-[180px] rounded-[12px] bg-white py-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] md:top-[52px] md:w-[200px]">
            <button
              onClick={() => {
                setOpen(false);
                navigate('/admin/profile');
              }}
              className="w-full px-[16px] py-[10px] text-left font-outfit text-[14px] font-normal text-black hover:bg-[#f5f5f5] md:text-[16px]"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-[16px] py-[10px] text-left font-outfit text-[14px] font-normal text-red-500 hover:bg-[#f5f5f5] md:text-[16px]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
