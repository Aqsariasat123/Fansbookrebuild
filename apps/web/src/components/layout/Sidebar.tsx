import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';
import { fanNavItems, creatorNavItems, fallbackLabels, REVERSE_LANG } from './navItems';

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const currentLangName = REVERSE_LANG[i18n.language] || 'English';
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
      <nav className="sticky top-[122px] rounded-[22px] bg-[#0e1012] p-[32px]">
        <div className="flex flex-col gap-[55px]">
          <div className="flex flex-col gap-[32px]">
            {navItems.map(({ to, icon, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-[15px] text-[16px] transition-colors ${
                    isActive ? 'text-[#f8f8f8]' : 'text-[#5d5d5d] hover:text-[#f8f8f8]'
                  }`
                }
              >
                <img src={icon} alt="" className="h-[20px] w-[20px]" />
                {label(labelKey)}
              </NavLink>
            ))}

            <button
              onClick={() => navigate('/language')}
              className="flex items-center gap-[15px] text-[16px] text-[#5d5d5d] transition-colors hover:text-[#f8f8f8]"
            >
              <img src="/icons/dashboard/language.svg" alt="" className="h-[20px] w-[20px]" />
              {currentLangName}
              <img
                src="/icons/dashboard/chevron-forward.svg"
                alt=""
                className="h-[24px] w-[24px] rotate-90"
              />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-[15px] text-[16px] text-[#5d5d5d] transition-colors hover:text-[#f8f8f8]"
          >
            <img src="/icons/dashboard/logout.svg" alt="" className="h-[20px] w-[20px]" />
            {label('nav.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
}
