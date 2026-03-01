import { Link } from 'react-router-dom';

const WHITE = 'brightness(0) invert(1)';

export function CTASection() {
  return (
    <section className="bg-card px-[20px] pt-[40px] md:px-[76px] md:pt-[70px]">
      <div className="flex flex-col items-start gap-[24px] rounded-[9px] bg-muted px-[16px] py-[16px] text-left md:flex-row md:items-center md:justify-between md:rounded-[22px] md:px-[40px] md:py-[40px]">
        <div>
          <h2 className="text-[20px] font-semibold leading-[1.1] md:text-[48px]">
            <span className="text-foreground">Interested? </span>
            <span className="text-[#a61651]">Let&apos;s Talk.</span>
          </h2>
          <p className="mt-[8px] text-[12px] font-normal leading-[1.3] text-foreground md:mt-[12px] md:max-w-[400px] md:text-[16px]">
            Whether you&apos;re a creator ready to monetize your passion or a fan looking for
            exclusive content — we&apos;d love to hear from you.
          </p>
        </div>
        <Link
          to="/register"
          className="flex items-center gap-[4px] rounded-[32px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[28px] py-[8px] text-[8px] font-medium text-white shadow-[0px_2.5px_4px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 md:gap-[10px] md:rounded-[80px] md:px-[40px] md:py-[17px] md:text-[20px] md:shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)]"
        >
          Join Now
          <img
            src="/icons/landing/arrow_forward.svg"
            alt=""
            className="h-[10px] w-[10px] md:h-[24px] md:w-[24px]"
            style={{ filter: WHITE }}
          />
        </Link>
      </div>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <footer className="bg-card px-[20px] pt-[40px] pb-[24px] md:px-[76px] md:pt-[60px] md:pb-[30px]">
      {/* Footer content */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-[32px] sm:grid-cols-2 lg:flex lg:items-start lg:justify-between lg:gap-0">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <img
            src="/images/landing/footer-logo.webp"
            alt="Fansbook"
            className="h-[80px] w-[86px] object-contain lg:h-[109px] lg:w-[118px]"
          />
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[18px] font-semibold text-foreground lg:text-[20px]">Quick Links</h4>
          <div className="mt-[12px] grid grid-cols-2 gap-x-[32px] gap-y-[10px] lg:mt-[16px] lg:gap-x-[48px] lg:gap-y-[12px]">
            {[
              { label: 'How It Works', to: '/how-it-works' },
              { label: 'About Us', to: '/about' },
              { label: 'Contact Us', to: '/contact' },
              { label: 'Help', to: '/faq' },
              { label: 'Make Money', to: '/make-money' },
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Cookie Policy', to: '/cookies' },
              { label: 'Complaints Policy', to: '/complaints' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[14px] font-normal text-foreground hover:text-primary lg:text-[16px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Services */}
        <div>
          <h4 className="text-[18px] font-semibold text-foreground lg:text-[20px]">
            Quick Services
          </h4>
          <a
            href="mailto:info@fansbook.vip"
            className="mt-[12px] flex items-center gap-[10px] text-[14px] font-normal text-foreground hover:text-primary lg:mt-[16px] lg:text-[16px]"
          >
            <img src="/icons/landing/mail.svg" alt="" className="h-[20px] w-[20px]" />
            info@fansbook.vip
          </a>
        </div>

        {/* Follow us */}
        <div>
          <h4 className="text-[18px] font-semibold text-foreground lg:text-[20px]">Follow us</h4>
          <div className="mt-[12px] flex gap-[16px] lg:mt-[16px]">
            <a
              href="https://www.facebook.com/FansBookVip"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/landing/facebook.svg" alt="Facebook" className="h-[25px] w-[25px]" />
            </a>
            <a
              href="https://www.instagram.com/fansbook.vip/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/landing/instagram.svg"
                alt="Instagram"
                className="h-[25px] w-[25px]"
              />
            </a>
            <a href="https://x.com/FansBook__" target="_blank" rel="noopener noreferrer">
              <img src="/icons/landing/twitter.svg" alt="Twitter" className="h-[25px] w-[25px]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-[30px] max-w-[1078px] md:mt-[40px]">
        <div className="h-[1px] w-full bg-foreground/20" />
        <p className="mt-[16px] text-center text-[14px] font-normal text-foreground md:mt-[22px] md:text-[16px]">
          Copyright 2025@ all rights reserved.
        </p>
      </div>
    </footer>
  );
}
