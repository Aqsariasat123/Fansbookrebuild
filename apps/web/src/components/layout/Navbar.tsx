import { Link } from 'react-router-dom';
import { NavbarSearch } from './NavbarSearch';
import { NavbarUserMenu } from './NavbarUserMenu';

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 19V17H6V10C6 8.61667 6.41667 7.3875 7.25 6.3125C8.08333 5.2375 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.6458 2.72917 10.9375 2.4375C11.2292 2.14583 11.5833 2 12 2C12.4167 2 12.7708 2.14583 13.0625 2.4375C13.3542 2.72917 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.2375 16.75 6.3125C17.5833 7.3875 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9792 21.8042 10.5875 21.4125C10.1958 21.0208 10 20.55 10 20H14C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 14H14V12H6V14ZM6 11H18V9H6V11ZM6 8H18V6H6V8ZM2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6L2 22ZM5.15 16H20V4H4V17.125L5.15 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

const iconCircle =
  'flex items-center justify-center size-[44px] rounded-full bg-muted text-foreground hover:bg-muted-foreground/20';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-muted">
      {/* Mobile header */}
      <div className="flex items-center justify-between px-[14px] py-[10px] lg:hidden">
        <button onClick={onMenuToggle} className="shrink-0" aria-label="Menu">
          <img src="/icons/dashboard/menu.svg" alt="" className="size-[30px]" />
        </button>
        <div className="flex items-center gap-[6px]">
          <Link to="/notifications" className={`shrink-0 ${iconCircle}`} aria-label="Notifications">
            <BellIcon className="size-[22px]" />
          </Link>
          <Link to="/messages" className={`shrink-0 ${iconCircle}`} aria-label="Messages">
            <MessageIcon className="size-[22px]" />
          </Link>
          <NavbarUserMenu />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden px-[26px] pt-[26px] pb-[10px] lg:block">
        <div className="flex h-[74px] items-center justify-between rounded-[181px] bg-card pl-[40px] pr-[6px]">
          <Link to="/feed" className="shrink-0">
            <img
              src="/icons/dashboard/fansbook-logo.webp"
              alt="Fansbook"
              className="h-[44px] w-auto"
            />
          </Link>
          <div className="flex items-center gap-[60px]">
            <div className="flex items-center gap-[6px]">
              <NavbarSearch />
              <Link
                to="/notifications"
                className={`shrink-0 ${iconCircle}`}
                aria-label="Notifications"
              >
                <BellIcon className="size-[22px]" />
              </Link>
              <Link to="/messages" className={`shrink-0 ${iconCircle}`} aria-label="Messages">
                <MessageIcon className="size-[22px]" />
              </Link>
            </div>
            <NavbarUserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
