import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const WHITE = 'brightness(0) invert(1)';

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/creators', label: 'Creators' },
  { to: '/creators-live', label: 'Creators Live' },
  { to: '/make-money', label: 'Make Money' },
];

function MobileMenu({
  onClose,
  linkColor,
}: {
  onClose: () => void;
  linkColor: (path: string) => string;
}) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] font-outfit lg:hidden" onClick={onClose}>
      {/* Dim overlay behind menu — website still visible */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Menu panel — top portion only */}
      <div
        className="relative flex flex-col rounded-b-[16px] bg-muted shadow-[0px_8px_30px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: logo + close */}
        <div className="flex items-center justify-between px-[24px] pt-[24px] pb-[20px]">
          <img
            src="/images/landing/logo.webp"
            alt="Fansbook"
            className="h-[36px] w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-[#01adf1]"
            aria-label="Close menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Gradient accent line */}
        <div className="h-[2px] bg-gradient-to-r from-[#01adf1] to-[#a61651]" />

        {/* Links — left-aligned with dividers */}
        <div className="flex flex-col px-[24px] pt-[8px]">
          {menuLinks.map((link) => (
            <div key={link.to}>
              <Link
                to={link.to}
                onClick={onClose}
                className={`block py-[20px] text-[18px] font-normal ${linkColor(link.to)}`}
              >
                {link.label}
              </Link>
              <div className="h-[1px] bg-foreground/10" />
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-[16px] px-[24px] pt-[24px] pb-[28px]">
          <Link
            to="/login"
            onClick={onClose}
            className="flex-1 rounded-[80px] border border-foreground py-[14px] text-center text-[16px] font-medium text-foreground"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="flex-1 rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-center text-[16px] font-medium text-foreground"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function MarketingNav() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkColor = (path: string) => (pathname === path ? 'text-primary' : 'text-foreground');

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
              style={{ filter: WHITE }}
            />
            Make Money
          </Link>
          <Link
            to="/login"
            className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[14px] text-[18px] font-normal text-foreground shadow-[0px_2px_18px_rgba(34,34,34,0.25)]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-[80px] border border-[#01adf1] px-[24px] py-[14px] text-[18px] font-normal text-foreground shadow-[0px_2px_18px_rgba(34,34,34,0.25)]"
          >
            Signup
          </Link>
        </div>

        {/* Mobile: Login button + hamburger */}
        <div className="ml-auto flex items-center gap-[26px] lg:hidden">
          <Link
            to="/login"
            className="rounded-[53px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[9px] text-[12px] font-medium text-foreground shadow-[0px_1.3px_12px_rgba(34,34,34,0.25)]"
          >
            Login
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-[30px] w-[30px] flex-col items-center justify-center gap-[6px]"
            aria-label="Open menu"
          >
            <span className="h-[2px] w-[22px] bg-foreground" />
            <span className="h-[2px] w-[22px] bg-foreground" />
            <span className="h-[2px] w-[22px] bg-foreground" />
          </button>
        </div>
      </nav>

      {/* Mobile menu - rendered via portal to body */}
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} linkColor={linkColor} />}
    </>
  );
}
