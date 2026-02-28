import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { MobileMenu } from './MobileMenu';

const WHITE = 'brightness(0) invert(1)';

function ThemeSwitch({ onDark = true }: { onDark?: boolean }) {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark' || theme === 'system';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex size-[40px] items-center justify-center rounded-full border transition-colors ${onDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-foreground/20 text-foreground hover:bg-foreground/10'}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-[20px]">
          <path d="M12 17q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm18 0q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287.288.288.288.713t-.288.712Q22.425 13 22 13ZM12 5q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm0 18q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05 4.575 6q-.3-.275-.288-.7.013-.425.288-.725.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7 0 .4-.275.7-.275.3-.687.287-.413-.012-.713-.287ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712 0-.413.275-.688.275-.3.688-.287.412.012.712.287L19.425 18q.3.275.288.7-.013.425-.288.725-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.287-.688.012-.412.287-.712L18 4.575q.275-.3.7-.288.425.013.725.288.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275-.4 0-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.713-.275.412 0 .687.275.3.275.288.688-.013.412-.288.712L6 19.425q-.275.3-.7.287-.425-.012-.725-.287Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-[20px]">
          <path d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025.337.025.662.075-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613 1.15-.612 1.875-1.637.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Z" />
        </svg>
      )}
    </button>
  );
}

export function MarketingNav({ onDark = true }: { onDark?: boolean }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkColor = (path: string) =>
    pathname === path ? 'text-primary' : onDark ? 'text-white' : 'text-foreground';

  return (
    <>
      <nav className="absolute top-[20px] left-[20px] right-[20px] z-20 flex items-center font-outfit lg:top-[34px] lg:left-[37px] lg:right-[37px]">
        {/* Logo */}
        <img
          src="/images/landing/logo.webp"
          alt="Fansbook"
          className="h-[40px] w-auto object-contain lg:h-[56px] lg:w-[205px]"
        />

        {/* Desktop Nav links */}
        <div className="ml-[147px] hidden items-center gap-[45px] lg:flex">
          <Link to="/" className={`text-[18px] font-normal ${linkColor('/')}`}>
            Home
          </Link>
          <Link to="/creators" className={`text-[18px] font-normal ${linkColor('/creators')}`}>
            Creators
          </Link>
          <Link
            to="/creators-live"
            className={`text-[18px] font-normal ${linkColor('/creators-live')}`}
          >
            Creators Live
          </Link>
        </div>

        {/* Desktop Right section */}
        <div className="ml-auto hidden items-center gap-[25px] lg:flex">
          <Link
            to="/make-money"
            className={`flex items-center gap-[10px] text-[18px] font-normal ${linkColor('/make-money')}`}
          >
            <img
              src="/icons/landing/home_filled.svg"
              alt=""
              className="h-[26px] w-[26px]"
              style={onDark ? { filter: WHITE } : undefined}
            />
            Make Money
          </Link>
          <ThemeSwitch onDark={onDark} />
          <Link
            to="/login"
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[14px] text-[18px] font-normal text-white shadow-[0px_2px_18px_rgba(34,34,34,0.25)]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`rounded-[80px] border border-[#01adf1] px-[24px] py-[14px] text-[18px] font-normal shadow-[0px_2px_18px_rgba(34,34,34,0.25)] ${onDark ? 'text-white' : 'text-foreground'}`}
          >
            Signup
          </Link>
        </div>

        {/* Mobile: Theme + Login button + hamburger */}
        <div className="ml-auto flex items-center gap-[16px] lg:hidden">
          <ThemeSwitch onDark={onDark} />
          <Link
            to="/login"
            className="rounded-[53px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[9px] text-[12px] font-medium text-white shadow-[0px_1.3px_12px_rgba(34,34,34,0.25)]"
          >
            Login
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-[30px] w-[30px] flex-col items-center justify-center gap-[6px]"
            aria-label="Open menu"
          >
            <span className={`h-[2px] w-[22px] ${onDark ? 'bg-white' : 'bg-foreground'}`} />
            <span className={`h-[2px] w-[22px] ${onDark ? 'bg-white' : 'bg-foreground'}`} />
            <span className={`h-[2px] w-[22px] ${onDark ? 'bg-white' : 'bg-foreground'}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <MobileMenu
          onClose={() => setMenuOpen(false)}
          linkColor={(p) => (pathname === p ? 'text-primary' : 'text-foreground')}
        />
      )}
    </>
  );
}
