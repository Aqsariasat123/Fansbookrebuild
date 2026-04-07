import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';
import { fanNavItems, creatorNavItems, fallbackLabels, REVERSE_LANG } from './navItems';

function VerifyBadge({ status }: { status: string }) {
  if (status === 'APPROVED') {
    return (
      <span className="rounded-full bg-green-500/20 px-[8px] py-[2px] text-[10px] font-semibold text-green-400">
        ✓
      </span>
    );
  }
  const cls =
    status === 'PENDING' || status === 'MANUAL_REVIEW'
      ? 'bg-blue-500/20 text-blue-400'
      : status === 'REJECTED'
        ? 'bg-red-500/20 text-red-400'
        : 'bg-amber-500/20 text-amber-400';
  return (
    <span className={`rounded-full px-[8px] py-[2px] text-[10px] font-semibold ${cls}`}>
      {status === 'MANUAL_REVIEW' ? 'REVIEW' : status}
    </span>
  );
}

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLangName = REVERSE_LANG[i18n.language] || 'English';
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
                <img src={icon} alt="" className="h-[20px] w-[20px]" style={undefined} />
                <span className="flex-1">{label(labelKey)}</span>
                {to === '/verify-identity' && user?.verificationStatus && (
                  <VerifyBadge status={user.verificationStatus} />
                )}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => navigate('/language')}
            className="flex items-center gap-[15px] text-[16px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <img src="/icons/dashboard/language.svg" alt="" className="h-[20px] w-[20px]" />
            {currentLangName}
            <img
              src="/icons/dashboard/chevron-forward.svg"
              alt=""
              className="h-[24px] w-[24px] rotate-90"
            />
          </button>

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
