import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const STORAGE_KEY = 'age_verified';
const READABLE_PATHS = ['/privacy', '/terms'];
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/creators',
  '/creators-live',
  '/make-money',
  '/how-it-works',
  '/about',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/cookies',
  '/complaints',
  '/verify-identity',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

export function AgeVerification({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const [accepted, setAccepted] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Disabled for testing — re-enable before launch
  const showPopup = false && !accepted && !READABLE_PATHS.includes(pathname);

  useEffect(() => {
    document.body.style.overflow = showPopup ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  useEffect(() => {
    if (!accepted || !authUser) return;
    if (authUser.role === 'ADMIN') return;
    if (authUser.verificationStatus === 'APPROVED') return;
    // Only redirect on app routes, not marketing/public pages
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (isPublic) return;
    // ID verification redirect disabled for testing — re-enable before launch
    // if (authUser.verificationStatus === 'UNVERIFIED') {
    //   const accountAge = Date.now() - new Date(authUser.createdAt ?? Date.now()).getTime();
    //   const gracePeriodMs = 24 * 60 * 60 * 1000;
    //   if (accountAge > gracePeriodMs) {
    //     navigate('/verify-identity');
    //   }
    // }
  }, [accepted, authUser, navigate, pathname]);

  const handleEnter = () => {
    if (!privacyChecked || !termsChecked) return;
    localStorage.setItem(STORAGE_KEY, 'true');
    setAccepted(true);
  };

  return (
    <>
      {children}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-[16px]">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[16px] bg-[#2a2d32] shadow-2xl">
            <div className="bg-[#1e2126] px-[24px] py-[20px] md:px-[32px] md:py-[24px]">
              <img
                src="/images/landing/logo.webp"
                alt="Inscrio"
                className="h-[50px] object-contain md:h-[65px]"
              />
            </div>
            <div className="h-[3px] bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
            <div className="px-[24px] py-[24px] md:px-[32px] md:py-[28px]">
              <p className="text-[15px] leading-[1.5] text-white/90 md:text-[17px]">
                &quot;INSCRIO.COM&quot; contains ADULT CONTENT. BY ENTERING THIS SITE YOU CONSENT
                THAT YOU HAVE REACHED Full 18 years of age at this point.
              </p>
              <div className="mt-[20px] flex flex-col gap-[12px] md:mt-[24px]">
                <label className="flex cursor-pointer items-center gap-[10px]">
                  <input
                    type="checkbox"
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className="size-[18px] shrink-0 accent-[#01adf1]"
                  />
                  <span className="text-[14px] text-white/80 md:text-[15px]">
                    Agree{' '}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#01adf1] underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-[10px]">
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="size-[18px] shrink-0 accent-[#01adf1]"
                  />
                  <span className="text-[14px] text-white/80 md:text-[15px]">
                    Agree{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#01adf1] underline"
                    >
                      Terms &amp; Condition
                    </a>
                  </span>
                </label>
              </div>
              <div className="mt-[24px] flex justify-end gap-[12px] md:mt-[28px]">
                <button
                  onClick={handleEnter}
                  disabled={!privacyChecked || !termsChecked}
                  className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[28px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:px-[36px] md:py-[12px] md:text-[16px]"
                >
                  Enter
                </button>
                <button
                  onClick={() => {
                    window.location.href = 'https://google.com';
                  }}
                  className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[28px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 md:px-[36px] md:py-[12px] md:text-[16px]"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
