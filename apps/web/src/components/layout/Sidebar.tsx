import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';

const navItems = [
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
  { to: '/profile', icon: '/icons/dashboard/person.svg', labelKey: 'nav.myProfile' },
  { to: '/messages', icon: '/icons/dashboard/chat.svg', labelKey: 'nav.messages' },
  { to: '/wallet', icon: '/icons/dashboard/account-balance-wallet.svg', labelKey: 'nav.myWallet' },
  { to: '/followers', icon: '/icons/dashboard/person-heart.svg', labelKey: 'nav.myFollowersModel' },
  { to: '/subscription', icon: '/icons/dashboard/workspace-premium.svg', labelKey: 'nav.mySubscription' },
  { to: '/notifications', icon: '/icons/dashboard/notifications.svg', labelKey: 'nav.notifications' },
  { to: '/settings', icon: '/icons/dashboard/settings.svg', labelKey: 'nav.settings' },
  { to: '/help', icon: '/icons/dashboard/help-center.svg', labelKey: 'nav.helpSupport' },
];

const fallbackLabels: Record<string, string> = {
  'nav.home': 'Home',
  'nav.myProfile': 'My Profile',
  'nav.messages': 'Messages',
  'nav.myWallet': 'My wallet',
  'nav.myFollowersModel': 'My Followers Model',
  'nav.mySubscription': 'My Subscription',
  'nav.notifications': 'Notifications',
  'nav.settings': 'Settings',
  'nav.helpSupport': 'Help & Support',
  'nav.english': 'English',
  'nav.logout': 'Logout',
};

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

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
          {/* Nav items */}
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
                <img
                  src={icon}
                  alt=""
                  className="h-[20px] w-[20px]"
                />
                {label(labelKey)}
              </NavLink>
            ))}

            {/* Language */}
            <button className="flex items-center gap-[15px] text-[16px] text-[#5d5d5d] transition-colors hover:text-[#f8f8f8]">
              <img
                src="/icons/dashboard/language.svg"
                alt=""
                className="h-[20px] w-[20px]"
              />
              {label('nav.english')}
              <img
                src="/icons/dashboard/chevron-forward.svg"
                alt=""
                className="h-[24px] w-[24px] rotate-90"
              />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-[15px] text-[16px] text-[#5d5d5d] transition-colors hover:text-[#f8f8f8]"
          >
            <img
              src="/icons/dashboard/logout.svg"
              alt=""
              className="h-[20px] w-[20px]"
            />
            {label('nav.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
}
