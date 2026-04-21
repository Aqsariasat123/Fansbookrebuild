import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';

function UserAvatar({
  user,
}: {
  user: { avatar?: string | null; firstName?: string | null; displayName?: string | null } | null;
}) {
  if (user?.avatar) {
    return <img src={user.avatar} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[14px] font-medium text-white lg:text-[16px]">
      {(user?.firstName || user?.displayName || 'U').charAt(0).toUpperCase()}
    </div>
  );
}

function getProfilePath(role?: string) {
  return role === 'CREATOR' ? '/creator/profile' : '/profile';
}

function getEditProfilePath(role?: string) {
  return role === 'CREATOR' ? '/creator/profile/edit' : '/profile/edit';
}

function getDisplayName(
  user: { firstName?: string | null; lastName?: string | null; displayName?: string | null } | null,
): string {
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
  return user?.displayName || 'User';
}

const itemCls =
  'flex w-full items-center gap-[10px] px-[16px] py-[8px] text-left text-[14px] text-foreground hover:bg-muted transition-colors';

export function NavbarUserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((p) => !p)} className="flex items-center gap-[6px]">
        <div className="hidden text-right lg:block">
          <p className="text-[16px] leading-tight text-foreground">{getDisplayName(user)}</p>
          <p className="text-[12px] leading-tight text-muted-foreground">
            @{user?.username || 'user'}
          </p>
        </div>
        <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full lg:h-[44px] lg:w-[44px]">
          <UserAvatar user={user} />
        </div>
        <img
          src="/icons/dashboard/arrow-drop-down.svg"
          alt=""
          className="hidden h-[24px] w-[24px] lg:block"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-[6px] w-[180px] overflow-hidden rounded-[12px] bg-card shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]">
          {/* Header */}
          <div className="border-b border-border px-[16px] py-[12px]">
            <p className="text-[14px] font-semibold text-foreground">{getDisplayName(user)}</p>
            <p className="text-[12px] text-muted-foreground">@{user?.username || 'user'}</p>
          </div>

          {/* Menu items */}
          <div className="py-[6px]">
            <Link
              to={getProfilePath(user?.role)}
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px] shrink-0">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              My Profile
            </Link>
            <Link
              to={getEditProfilePath(user?.role)}
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px] shrink-0">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              Edit Profile
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className={itemCls}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[16px] shrink-0">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
              Settings
            </Link>
            <div className="my-[4px] border-t border-border" />
            <button onClick={handleLogout} className={itemCls}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-[16px] shrink-0 text-red-400"
              >
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <span className="text-red-400">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
