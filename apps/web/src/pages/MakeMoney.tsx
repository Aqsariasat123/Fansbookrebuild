import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* BG image */}
      <img
        src="/images/landing/hero-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />

      <MarketingNav />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-[20px] pt-[120px] pb-[40px] md:px-[76px] md:pt-[140px] md:pb-[60px] lg:px-[210px]">
        <h1 className="w-full max-w-[864px] text-center font-outfit text-[24px] md:text-[40px] font-medium leading-normal text-foreground">
          Make Money on FansBook
        </h1>
        <p className="mt-[12px] w-full max-w-[864px] text-center font-outfit text-[10px] md:text-[16px] font-medium leading-[1.6] text-foreground md:mt-[16px]">
          On FansBook, you can monetize your content creation skills through subscriptions, tips,
          and paid shoutouts. Creators also benefit from the referral program, where bringing in new
          users earns them commissions. The more you engage with your audience and share exclusive
          content, the greater your earning potential. FansBook simple and transparent system gives
          you the opportunity to turn your passion into income.
        </p>
      </div>
    </section>
  );
}

/* ─── Earn in Multiple Ways ─── */
const earnItems = [
  {
    icon: 'subscriptions',
    title: 'Subscriptions',
    desc: 'Charge fans monthly for exclusive content.',
  },
  {
    icon: 'tips',
    title: 'Tips & Donations',
    desc: 'Receive instant tips on your posts.',
  },
  {
    icon: 'ppv',
    title: 'Pay-Per-View (PPV)',
    desc: 'Lock premium photos & videos.',
  },
  {
    icon: 'bookings',
    title: 'Bookings',
    desc: 'Offer shout outs, video calls, or private content.',
  },
  {
    icon: 'referrals',
    title: 'Referrals',
    desc: 'Invite creators & earn commission.',
  },
  {
    icon: 'live',
    title: 'Live Streaming',
    desc: 'Go live, earn from coins & gifts.',
  },
];

function EarnSection() {
  return (
    <section className="bg-muted px-[20px] pt-[40px] pb-[40px] md:px-[60px] md:pt-[70px] md:pb-[70px]">
      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-white">
        Earn in Multiple Ways
      </p>

      <div className="mt-[30px] grid grid-cols-2 gap-x-[16px] gap-y-[30px] md:mt-[50px] md:grid-cols-3 md:gap-y-[40px]">
        {earnItems.map((item) => (
          <div key={item.title} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.icon}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] w-full max-w-[215px] text-center font-outfit text-[10px] md:text-[16px] leading-normal text-foreground md:mt-[18px]">
              <span className="font-medium">{item.title} –</span>{' '}
              <span className="font-light">{item.desc}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Why FansBook? ─── */
const whyItems = [
  { icon: 'secure_payments', title: 'Secure Payments' },
  { icon: 'global_reach', title: 'Global Reach' },
  { icon: 'flexible_withdrawals', title: 'Flexible Withdrawals' },
  { icon: 'security_privacy', title: 'Security & Privacy' },
];

function WhySection() {
  return (
    <section className="bg-muted px-[20px] pb-[40px] md:px-[60px] md:pb-[70px]">
      {/* Divider */}
      <div className="mb-[40px] h-[1px] w-full max-w-[1160px] bg-muted-foreground/30 md:mb-[70px]" />

      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-white">
        Why FansBook?
      </p>

      <div className="mt-[30px] grid grid-cols-2 gap-[20px] md:mt-[50px] md:flex md:items-start md:justify-around md:gap-[30px]">
        {whyItems.map((item) => (
          <div key={item.title} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.icon}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] text-center font-outfit text-[10px] md:text-[16px] font-normal leading-normal text-foreground md:mt-[18px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── How to Start ─── */
const howItems = [
  { icon: 'create_account', title: 'Create Account' },
  { icon: 'upload_content', title: 'Upload Content' },
  { icon: 'set_price', title: 'Set Price' },
  { icon: 'earn_withdraw', title: 'Earn & Withdraw' },
];

function HowToStartSection() {
  return (
    <section className="bg-muted px-[20px] pb-[40px] md:px-[60px] md:pb-[70px]">
      {/* Divider */}
      <div className="mb-[40px] h-[1px] w-full max-w-[1160px] bg-muted-foreground/30 md:mb-[70px]" />

      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-white">
        How to start
      </p>

      <div className="mt-[30px] grid grid-cols-2 gap-[20px] md:mt-[50px] md:flex md:items-start md:justify-around md:gap-[30px]">
        {howItems.map((item) => (
          <div key={item.title} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.icon}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] text-center font-outfit text-[10px] md:text-[16px] font-medium leading-normal text-foreground md:mt-[18px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main Make Money Page ─── */
export default function MakeMoney() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden font-outfit scrollbar-hide">
      <HeroSection />
      <EarnSection />
      <WhySection />
      <HowToStartSection />
      <MarketingFooter />
    </div>
  );
}
