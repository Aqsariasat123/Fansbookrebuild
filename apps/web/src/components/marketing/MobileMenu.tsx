import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/creators', label: 'Creators' },
  { to: '/creators-live', label: 'Creators Live' },
  { to: '/make-money', label: 'Make Money' },
];

interface MobileMenuProps {
  onClose: () => void;
  linkColor: (path: string) => string;
}

export function MobileMenu({ onClose, linkColor }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] font-outfit lg:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
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

        <div className="h-[2px] bg-gradient-to-r from-[#01adf1] to-[#a61651]" />

        {/* Links */}
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
            className="flex-1 rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-center text-[16px] font-medium text-white"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
