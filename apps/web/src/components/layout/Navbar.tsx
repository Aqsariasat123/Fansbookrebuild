import { Link } from 'react-router-dom';
import { NavbarSearch } from './NavbarSearch';
import { NavbarUserMenu } from './NavbarUserMenu';

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
          <Link to="/notifications" className="shrink-0" aria-label="Notifications">
            <img src="/icons/dashboard/bell-icon.svg" alt="" className="h-[30px] w-[30px]" />
          </Link>
          <Link to="/messages" className="shrink-0" aria-label="Messages">
            <img src="/icons/dashboard/message-icon.svg" alt="" className="h-[30px] w-[30px]" />
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
              <Link to="/notifications" className="shrink-0" aria-label="Notifications">
                <img src="/icons/dashboard/bell-icon.svg" alt="" className="h-[44px] w-[44px]" />
              </Link>
              <Link to="/messages" className="shrink-0" aria-label="Messages">
                <img src="/icons/dashboard/message-icon.svg" alt="" className="h-[44px] w-[44px]" />
              </Link>
            </div>
            <NavbarUserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
