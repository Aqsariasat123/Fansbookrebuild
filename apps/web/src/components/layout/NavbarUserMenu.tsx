import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';

function getDisplayName(
  user: { firstName?: string | null; lastName?: string | null; displayName?: string | null } | null,
): string {
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
  return user?.displayName || 'User';
}

export function NavbarUserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      /* best-effort */
    }
    logout();
    navigate('/login');
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-[6px]"
      >
        <div className="hidden text-right lg:block">
          <p className="text-[16px] text-[#f8f8f8] leading-tight">{getDisplayName(user)}</p>
          <p className="text-[12px] text-[#5d5d5d] leading-tight">@{user?.username || 'user'}</p>
        </div>
        <div className="h-[34px] w-[34px] lg:h-[44px] lg:w-[44px] shrink-0 overflow-hidden rounded-full">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[14px] lg:text-[16px] font-medium text-white">
              {(user?.firstName || user?.displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <img
          src="/icons/dashboard/arrow-drop-down.svg"
          alt=""
          className="hidden h-[24px] w-[24px] lg:block"
        />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-[4px] w-[101px] rounded-[10px] bg-[#f8f8f8] py-[10px] shadow-[0px_-5px_20px_0px_rgba(0,0,0,0.1)]">
          <Link
            to="/profile"
            onClick={() => setDropdownOpen(false)}
            className="block px-[15px] py-[4px] text-[16px] text-[#15191c] hover:bg-black/5"
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-[15px] py-[4px] text-left text-[16px] text-[#15191c] hover:bg-black/5"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
