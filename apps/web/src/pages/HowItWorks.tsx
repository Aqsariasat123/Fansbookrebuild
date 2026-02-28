import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

export default function HowItWorks() {
  return (
    <div className="min-h-screen font-outfit">
      {/* Hero Section — 355px, same style as About/Contact */}
      <div className="relative h-[280px] md:h-[355px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/landing/hero-bg.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[10px] px-[20px] md:top-[115px] md:gap-[14px] md:px-[76px] lg:px-[200px] text-white">
          <h1 className="text-center text-[32px] font-medium md:text-[48px]">How It Works</h1>
          <p className="max-w-[680px] text-center text-[16px] font-normal leading-[1.5] md:text-[20px]">
            Discover how our platform connects fans and creators in a seamless, interactive
            experience. Follow the steps below to get started and make the most out of your journey
            with us.
          </p>
        </div>
      </div>

      {/* Main Content — dark bg */}
      <div className="bg-muted px-[20px] py-[40px] md:px-[76px] md:py-[80px] lg:px-[142px]">
        <div className="mx-auto max-w-[900px] text-[16px] leading-[1.8] text-foreground">
          {/* Intro heading */}
          <h2 className="mb-[24px] text-[28px] font-medium md:text-[36px]">How It Works</h2>
          <p className="mb-[32px]">
            FansBook accepts creators from a wide range of genres. The platform empowers you to
            monetize your content. FansBook is an excellent method for you, as a content creator or
            influencer, to generate money from your passions, interests, and abilities, while also
            engaging closely with your fans in an exclusive and unique manner.
          </p>
          <p className="mb-[24px]">
            You may generate money on FansBook regardless of the amount of your following by using
            the site's monetisation capabilities. These are some of them:
          </p>

          {/* Monetization features list */}
          <ul className="mb-[48px] list-none space-y-[16px] pl-0">
            <li className="flex items-start gap-[12px]">
              <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
              <span>
                <strong>Subscription packages</strong> that allow you to charge for access to your
                content.
              </span>
            </li>
            <li className="flex items-start gap-[12px]">
              <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
              <span>
                <strong>Paid postings</strong> give your work more exclusivity.
              </span>
            </li>
            <li className="flex items-start gap-[12px]">
              <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
              <span>
                <strong>Tipping</strong> is a feature that allows your followers to express their
                gratitude for your postings.
              </span>
            </li>
            <li className="flex items-start gap-[12px]">
              <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
              <span>
                <strong>Live streaming</strong> is a function that allows you to show off your
                skills in real time to your audience. Receiving tips from followers or putting up a
                payment-gated broadcast are two ways to make money from live streaming.
              </span>
            </li>
          </ul>

          {/* Content Creation */}
          <h2 className="mb-[24px] text-[28px] font-medium md:text-[36px]">
            Content creation on FansBook
          </h2>
          <p className="mb-[48px]">
            You may share a variety of material on your FansBook page, including 'how to' videos,
            behind-the-scenes footage, lessons, masterclasses, live broadcasts, new releases, vlogs,
            and creative projects.
          </p>

          {/* Promoting */}
          <h2 className="mb-[24px] text-[28px] font-medium md:text-[36px]">
            Promoting your FansBook account
          </h2>
          <p className="mb-[48px]">
            There are a variety of strategies to advertise your FansBook account and grow your
            following on the site. You may advertise your FansBook account on all of your social
            media networks and internet platforms, and you can team up with other FansBook producers
            to get the word out about it. Promoting your account is advantageous since it helps you
            to attract new subscribers as well as bring your existing fans over to FansBook.
          </p>

          {/* Conclusion highlight box */}
          <div className="rounded-[22px] bg-card px-[20px] py-[24px] md:px-[40px] md:py-[32px]">
            <p className="text-[18px] font-medium leading-[1.7]">
              Overall, FansBook is a platform with a lot of built-in tools to assist you in
              presenting your original material in the best possible light — and earning money!
            </p>
          </div>
        </div>
      </div>

      {/* CTA + Footer — same as landing page */}
      <CTASection />
      <MarketingFooter />
    </div>
  );
}
