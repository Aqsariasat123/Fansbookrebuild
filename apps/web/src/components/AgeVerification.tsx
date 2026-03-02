import { useState, useEffect } from 'react';

const STORAGE_KEY = 'age_verified';

export function AgeVerification({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    if (verified) document.body.style.overflow = '';
    else document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [verified]);

  if (verified) return <>{children}</>;

  const canEnter = privacyChecked && termsChecked;

  const handleEnter = () => {
    if (!canEnter) return;
    localStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  };

  const handleLeave = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <>
      {children}
      {/* Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-[16px] backdrop-blur-sm">
        <div className="w-full max-w-[520px] overflow-hidden rounded-[16px] bg-[#2a2d32] shadow-2xl">
          {/* Logo header */}
          <div className="bg-[#1e2126] px-[24px] py-[20px] md:px-[32px] md:py-[24px]">
            <img
              src="/images/landing/logo.webp"
              alt="Fansbook"
              className="h-[50px] object-contain md:h-[65px]"
            />
          </div>

          {/* Gradient divider */}
          <div className="h-[3px] bg-gradient-to-r from-[#01adf1] to-[#a61651]" />

          {/* Content */}
          <div className="px-[24px] py-[24px] md:px-[32px] md:py-[28px]">
            <p className="text-[15px] leading-[1.5] text-white/90 md:text-[17px]">
              &quot;FANSBOOK.VIP&quot; contains ADULT CONTENT. BY ENTERING THIS SITE YOU CONSENT
              THAT YOU HAVE REACHED Full 18 years of age at this point.
            </p>

            {/* Checkboxes */}
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

            {/* Buttons */}
            <div className="mt-[24px] flex justify-end gap-[12px] md:mt-[28px]">
              <button
                onClick={handleEnter}
                disabled={!canEnter}
                className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#01adf1]/80 px-[28px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:px-[36px] md:py-[12px] md:text-[16px]"
              >
                Enter
              </button>
              <button
                onClick={handleLeave}
                className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[28px] py-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 md:px-[36px] md:py-[12px] md:text-[16px]"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
