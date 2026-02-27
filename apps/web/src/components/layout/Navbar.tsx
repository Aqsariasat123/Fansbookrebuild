import { Link } from 'react-router-dom';
import { NavbarSearch } from './NavbarSearch';
import { NavbarUserMenu } from './NavbarUserMenu';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-[26px] pt-[26px] pb-[10px] bg-[#15191c]">
      <div className="flex h-[74px] items-center justify-between rounded-[181px] bg-[#0e1012] pl-[40px] pr-[6px]">
        {/* Logo */}
        <Link to="/feed" className="shrink-0">
          <img
            src="/icons/dashboard/fansbook-logo.webp"
            alt="Fansbook"
            className="h-[44px] w-auto"
          />
        </Link>

        <div className="flex items-center gap-[60px]">
          {/* Search + Icons */}
          <div className="hidden items-center gap-[6px] md:flex">
            <NavbarSearch />
            <Link to="/notifications" className="shrink-0" aria-label="Notifications">
              <img src="/icons/dashboard/bell-icon.svg" alt="" className="h-[44px] w-[44px]" />
            </Link>
            <Link to="/messages" className="shrink-0" aria-label="Messages">
              <img src="/icons/dashboard/message-icon.svg" alt="" className="h-[44px] w-[44px]" />
            </Link>
          </div>

          {/* User */}
          <NavbarUserMenu />
        </div>
      </div>
    </header>
  );
}
