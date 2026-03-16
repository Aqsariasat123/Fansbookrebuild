import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';
import { fanNavItems, creatorNavItems, fallbackLabels } from './navItems';

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navItems = user?.role === 'CREATOR' ? creatorNavItems : fanNavItems;

  function label(key: string) {
    const translated = t(key);
    return translated === key ? fallbackLabels[key] || key : translated;
  }

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
    <aside className="hidden shrink-0 lg:block">
      <nav className="sticky top-[122px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-[22px] bg-card p-[32px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20">
        <div className="flex flex-col gap-[55px]">
          <div className="flex flex-col gap-[32px]">
            {navItems.map(({ to, icon, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-[15px] text-[16px] transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <img src={icon} alt="" className="h-[20px] w-[20px]" />
                {label(labelKey)}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-[15px] text-[16px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <img src="/icons/dashboard/logout.svg" alt="" className="h-[20px] w-[20px]" />
            {label('nav.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
}
