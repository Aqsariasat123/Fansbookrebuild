import { Link } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';
import { CreatorsSection, FeaturesSection } from '../components/landing/CreatorsSection';
import { MemberFeaturesSection, FAQSection } from '../components/landing/MemberFeaturesSection';
import { ReviewsSection, TrendingSection } from '../components/landing/ReviewsTrendingSection';

/* ─── CSS filter to turn any SVG white ─── */
const WHITE = 'brightness(0) invert(1)';

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative min-h-[420px] w-full overflow-hidden md:h-[615px]">
      {/* BG image */}
      <img
        src="/images/landing/hero-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(24,21,28,0.94)' }} />

      <MarketingNav />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-[20px] pt-[100px] pb-[40px] md:pt-[40px] md:pb-0">
        <h1 className="max-w-[580px] text-center text-[28px] font-medium leading-[1.2] text-white sm:text-[36px] md:text-[48px]">
          Connect with Creators.
          <br />
          Watch. Subscribe. Support.
        </h1>
        <p className="mt-[12px] text-center text-[14px] font-medium text-white md:mt-[16px] md:text-[16px]">
          Get in here and help your favorite creators do thier thing!
        </p>
        <Link
          to="/register"
          className="mt-[32px] flex items-center gap-[10px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[40px] py-[14px] text-[16px] font-medium text-white shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 md:mt-[48px] md:px-[70px] md:py-[17px] md:text-[20px]"
        >
          Join Now
          <img
            src="/icons/landing/arrow_forward.svg"
            alt=""
            className="h-[24px] w-[24px]"
            style={{ filter: WHITE }}
          />
        </Link>
      </div>
    </section>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden font-outfit scrollbar-hide">
      <HeroSection />
      <CreatorsSection />
      <FeaturesSection />
      <MemberFeaturesSection />
      <FAQSection />
      <ReviewsSection />
      <TrendingSection />
      <CTASection />
      <MarketingFooter />
    </div>
  );
}
