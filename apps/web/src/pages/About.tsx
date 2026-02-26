import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

export default function About() {
  return (
    <div className="min-h-screen font-outfit">
      {/* Hero Section — 355px, dark overlay on bg image */}
      <div className="relative h-[323px] md:h-[355px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/about/hero-bg.webp"
            alt=""
            className="absolute left-0 w-full max-w-none"
            style={{ height: '239.44%', top: '-4.26%' }}
          />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] md:top-[135px] flex flex-col items-center gap-[14px] px-[20px] md:px-[76px] text-[#f8f8f8]">
          <h1 className="w-full text-center text-[30px] md:text-[48px] font-medium">About FansBook</h1>
          <p className="w-full text-center text-[10px] md:text-[20px] font-normal">
            A modern platform for fans and creators to connect.
          </p>
        </div>
      </div>

      {/* About Content — dark section, text left + tilted image right */}
      <div className="w-full bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[67px] lg:px-[142px]">
        <div className="relative flex flex-col items-center lg:block">
          {/* Mobile: overlapping images */}
          <div className="relative mb-[24px] h-[264px] w-[260px] lg:hidden">
            <img
              src="/images/about/content-photo.webp"
              alt="Creators"
              className="absolute right-0 top-0 h-[264px] w-[260px] rounded-[8px] object-cover"
            />
            <div className="absolute left-0 top-[6px] h-[252px] w-[257px] rounded-[8px] border-[4px] border-white/30" />
          </div>
          {/* Text block — 470px width, positioned left */}
          <div className="w-full text-center lg:w-[470px] lg:text-left text-[12px] md:text-[16px] font-normal leading-normal text-[#f8f8f8]">
            <p className="mb-[16px]">
              FansBook is a next-generation fan engagement platform that allows creators to live
              stream, share exclusive content, and interact with their fans in real time.
            </p>
            <p className="mb-[16px]">
              Our goal is to create a space where creators are empowered and fans feel more
              connected than ever. FansBook is a next-generation fan engagement platform that
              allows creators to live stream, share exclusive content, and interact with their
              fans in real time.
            </p>
            <p className="mb-[16px]">
              Our goal is to create a space where creators are empowered and fans feel more
              connected than ever. FansBook.vip is a next-generation fan engagement platform
              that allows creators to live stream, share exclusive content, and interact with
              their fans in real time.
            </p>
            <p>
              Our goal is to create a space where creators are empowered and fans feel more
              connected than ever.
            </p>
          </div>

          {/* Tilted image — positioned right, overlapping */}
          <div className="hidden lg:block absolute right-0 top-0 h-[386px] w-[398px]">
            <div className="absolute right-0 top-0 h-[386px] w-[380px] rotate-[4deg] rounded-[12px] border-[6px] border-white" />
            <img
              src="/images/about/content-photo.webp"
              alt="Creators"
              className="absolute left-0 top-[9px] h-[368px] w-[376px] rounded-[8px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Our Purpose Section — light bg */}
      <div className="flex flex-col items-center bg-[#f8f8f8] px-[28px] pt-[60px] pb-[80px]">
        {/* Heading */}
        <div className="flex w-full max-w-[335px] flex-col items-center gap-[20px] text-center text-[#15191c]">
          <h2 className="w-full text-[30px] md:text-[48px] font-medium">Our Purpose</h2>
          <p className="w-full text-[10px] md:text-[16px] font-medium">
            Empowering creators and connecting fans through a bold and exclusive digital
            experience.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-[40px] flex w-full max-w-[1225px] flex-col items-center gap-[30px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          {/* Mission */}
          <div className="flex w-full max-w-[603px] flex-col items-center">
            {/* Pink tab — 327px centered above card */}
            <div className="flex h-[56px] w-[190px] md:h-[96px] md:w-[327px] items-center justify-center rounded-t-[12px] md:rounded-t-[22px] bg-[#a61651]">
              <span className="text-[20px] md:text-[36px] font-medium text-[#f8f8f8]">Mission</span>
            </div>
            {/* Card body */}
            <div className="flex h-auto min-h-[200px] lg:h-[323px] w-full rounded-[13px] md:rounded-[22px] bg-[#15191c] px-[16px] py-[24px] md:px-[34px] md:py-[82px]">
              <div className="flex flex-col items-center gap-[24px] md:flex-row md:gap-[47px]">
                <img src="/icons/about/goal.svg" alt="" className="h-[60px] w-[60px] md:h-[132px] md:w-[132px] shrink-0" />
                <p className="w-full md:w-[356px] text-[10px] md:text-[16px] font-medium leading-normal text-[#f8f8f8]">
                  To create a safe, powerful, and direct platform where creators can earn,
                  express, and connect with their fans without limitations — live, personal,
                  and on their own terms.
                  <br /><br />
                  To create a safe, powerful, and direct platform where creators can earn,
                  express, and connect with their fans without limitations — live, personal,
                  and on their own terms.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="flex w-full max-w-[603px] flex-col items-center">
            {/* Pink tab — 327px centered above card */}
            <div className="flex h-[56px] w-[190px] md:h-[96px] md:w-[327px] items-center justify-center rounded-t-[12px] md:rounded-t-[22px] bg-[#a61651]">
              <span className="text-[20px] md:text-[36px] font-medium text-[#f8f8f8]">Vision</span>
            </div>
            {/* Card body */}
            <div className="flex h-auto min-h-[200px] lg:h-[323px] w-full rounded-[13px] md:rounded-[22px] bg-[#15191c] px-[16px] py-[24px] md:px-[34px] md:py-[72px]">
              <div className="flex flex-col items-center gap-[24px] md:flex-row md:gap-[47px]">
                <img src="/icons/about/light_on.svg" alt="" className="h-[60px] w-[60px] md:h-[132px] md:w-[132px] shrink-0" />
                <p className="w-full md:w-[356px] text-[10px] md:text-[16px] font-medium leading-normal text-[#f8f8f8]">
                  To be the leading global fan-engagement platform where creators feel in
                  control, fans feel valued, and connections feel real.
                  <br /><br />
                  To be the leading global fan-engagement platform where creators feel in
                  control, fans feel valued, and connections feel real.
                  <br /><br />
                  To be the leading global fan-engagement platform where creators feel in
                  control, fans feel valued, and connections feel real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA + Footer — same as landing page */}
      <CTASection />
      <MarketingFooter />
    </div>
  );
}
