import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';
import { fanNavItems, creatorNavItems, fallbackLabels, REVERSE_LANG } from './navItems';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
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
    onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-black/12 backdrop-blur-[3.4px]" onClick={onClose} />
      <div
        className={`absolute left-0 top-[50px] h-[calc(100%-50px)] w-[242px] rounded-br-[22px] rounded-tr-[22px] bg-[#15191c] shadow-[4px_8px_27.2px_0px_rgba(0,0,0,0.42)] transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-[32px] pt-[20px]">
          <img
            src="/icons/dashboard/fansbook-logo.webp"
            alt="Fansbook"
            className="h-[43px] w-[158px] object-contain"
          />
        </div>

        <div className="flex flex-col gap-[55px] px-[32px] pt-[60px]">
          <div className="flex flex-col gap-[32px]">
            {navItems.map(({ to, icon, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-[15px] text-[12px] transition-colors ${
                    isActive ? 'text-[#f8f8f8]' : 'text-[#5d5d5d] hover:text-[#f8f8f8]'
                  }`
                }
              >
                <img src={icon} alt="" className="h-[20px] w-[20px]" />
                {label(labelKey)}
              </NavLink>
            ))}

            <button
              onClick={() => {
                navigate('/language');
                onClose();
              }}
              className="flex items-center gap-[15px] text-[12px] text-[#5d5d5d] transition-colors hover:text-[#f8f8f8]"
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
      </div>
    </div>
  );
}
