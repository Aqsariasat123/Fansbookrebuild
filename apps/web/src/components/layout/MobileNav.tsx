import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const mobileItems = [
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
  { to: '/explore', icon: '/icons/dashboard/search.svg', labelKey: 'nav.explore' },
  { to: '/messages', icon: '/icons/dashboard/chat.svg', labelKey: 'nav.messages' },
  { to: '/notifications', icon: '/icons/dashboard/notifications.svg', labelKey: 'nav.notifications' },
  { to: '/profile', icon: '/icons/dashboard/person.svg', labelKey: 'nav.profile' },
];

const fallbackLabels: Record<string, string> = {
  'nav.home': 'Home',
  'nav.explore': 'Explore',
  'nav.messages': 'Messages',
  'nav.notifications': 'Alerts',
  'nav.profile': 'Profile',
};

export function MobileNav() {
  const { t } = useTranslation();

  function label(key: string) {
    const translated = t(key);
    return translated === key ? fallbackLabels[key] || key : translated;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#0e1012] bg-[#0e1012] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileItems.map(({ to, icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 text-[10px] transition-colors ${
                isActive ? 'text-[#f8f8f8]' : 'text-[#5d5d5d]'
              }`
            }
          >
            <img src={icon} alt="" className="h-5 w-5" />
            <span>{label(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
