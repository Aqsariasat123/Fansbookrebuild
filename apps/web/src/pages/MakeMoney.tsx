import { useState, useEffect } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';

interface CmsItem {
  id: string;
  title: string;
  desc?: string;
  iconName: string;
}

interface MakeMoneyItems {
  earn: CmsItem[];
  why: CmsItem[];
  how: CmsItem[];
}

const DEFAULT_EARN: CmsItem[] = [
  {
    id: '1',
    title: 'Subscriptions',
    desc: 'Charge fans monthly for exclusive content.',
    iconName: 'subscriptions',
  },
  {
    id: '2',
    title: 'Tips & Donations',
    desc: 'Receive instant tips on your posts.',
    iconName: 'tips',
  },
  { id: '3', title: 'Pay-Per-View (PPV)', desc: 'Lock premium photos & videos.', iconName: 'ppv' },
  {
    id: '4',
    title: 'Bookings',
    desc: 'Offer shout outs, video calls, or private content.',
    iconName: 'bookings',
  },
  {
    id: '5',
    title: 'Referrals',
    desc: 'Invite creators & earn commission.',
    iconName: 'referrals',
  },
  { id: '6', title: 'Live Streaming', desc: 'Go live, earn from coins & gifts.', iconName: 'live' },
];
const DEFAULT_WHY: CmsItem[] = [
  { id: '1', title: 'Secure Payments', iconName: 'secure_payments' },
  { id: '2', title: 'Global Reach', iconName: 'global_reach' },
  { id: '3', title: 'Flexible Withdrawals', iconName: 'flexible_withdrawals' },
  { id: '4', title: 'Security & Privacy', iconName: 'security_privacy' },
];
const DEFAULT_HOW: CmsItem[] = [
  { id: '1', title: 'Create Account', iconName: 'create_account' },
  { id: '2', title: 'Upload Content', iconName: 'upload_content' },
  { id: '3', title: 'Set Price', iconName: 'set_price' },
  { id: '4', title: 'Earn & Withdraw', iconName: 'earn_withdraw' },
];
const DEFAULTS: MakeMoneyItems = { earn: DEFAULT_EARN, why: DEFAULT_WHY, how: DEFAULT_HOW };

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <img
        src="/images/landing/hero-bg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
      <MarketingNav />
      <div className="relative z-10 flex flex-col items-center px-[20px] pt-[120px] pb-[40px] md:px-[76px] md:pt-[140px] md:pb-[60px] lg:px-[210px]">
        <h1 className="w-full max-w-[864px] text-center font-outfit text-[24px] md:text-[40px] font-medium leading-normal text-white">
          Make Money on Inscrio
        </h1>
        <p className="mt-[12px] w-full max-w-[864px] text-center font-outfit text-[14px] md:text-[16px] font-medium leading-[1.6] text-white md:mt-[16px]">
          On Inscrio, you can monetize your content creation skills through subscriptions, tips, and
          paid shoutouts. Creators also benefit from the referral program, where bringing in new
          users earns them commissions. The more you engage with your audience and share exclusive
          content, the greater your earning potential. Inscrio simple and transparent system gives
          you the opportunity to turn your passion into income.
        </p>
      </div>
    </section>
  );
}

function EarnSection({ items }: { items: CmsItem[] }) {
  return (
    <section className="bg-muted px-[20px] pt-[40px] pb-[40px] md:px-[60px] md:pt-[70px] md:pb-[70px]">
      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-foreground">
        Earn in Multiple Ways
      </p>
      <div className="mt-[30px] grid grid-cols-2 gap-x-[16px] gap-y-[30px] md:mt-[50px] md:grid-cols-6 md:gap-x-[24px] md:gap-y-[40px]">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.iconName}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] w-full max-w-[215px] text-center font-outfit text-[14px] md:text-[16px] leading-normal text-foreground md:mt-[18px]">
              <span className="font-medium">{item.title} –</span>{' '}
              <span className="font-light">{item.desc}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection({ items }: { items: CmsItem[] }) {
  return (
    <section className="bg-muted px-[20px] pb-[40px] md:px-[60px] md:pb-[70px]">
      <div className="mb-[40px] h-[1px] w-full max-w-[1160px] bg-muted-foreground/30 md:mb-[70px]" />
      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-foreground">
        Why Inscrio?
      </p>
      <div className="mt-[30px] grid grid-cols-2 gap-[20px] md:mt-[50px] md:grid-cols-4 md:gap-x-[24px]">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.iconName}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] text-center font-outfit text-[14px] md:text-[16px] font-normal leading-normal text-foreground md:mt-[18px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowToStartSection({ items }: { items: CmsItem[] }) {
  return (
    <section className="bg-muted px-[20px] pb-[40px] md:px-[60px] md:pb-[70px]">
      <div className="mb-[40px] h-[1px] w-full max-w-[1160px] bg-muted-foreground/30 md:mb-[70px]" />
      <p className="font-outfit text-[16px] md:text-[20px] font-medium leading-normal text-foreground">
        How to start
      </p>
      <div className="mt-[30px] grid grid-cols-2 gap-[20px] md:mt-[50px] md:grid-cols-4 md:gap-x-[24px]">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <img
              src={`/icons/make-money/${item.iconName}.svg`}
              alt=""
              className="h-[50px] w-[50px] md:h-[104px] md:w-[104px]"
            />
            <p className="mt-[12px] text-center font-outfit text-[14px] md:text-[16px] font-medium leading-normal text-foreground md:mt-[18px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MakeMoney() {
  const [data, setData] = useState<MakeMoneyItems>(DEFAULTS);

  useEffect(() => {
    fetch('/api/make-money')
      .then((r) => r.json())
      .then((r: { success: boolean; data: MakeMoneyItems | null }) => {
        if (r.success && r.data) {
          setData({
            earn: r.data.earn?.length ? r.data.earn : DEFAULTS.earn,
            why: r.data.why?.length ? r.data.why : DEFAULTS.why,
            how: r.data.how?.length ? r.data.how : DEFAULTS.how,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden font-outfit scrollbar-hide">
      <HeroSection />
      <EarnSection items={data.earn} />
      <WhySection items={data.why} />
      <HowToStartSection items={data.how} />
      <MarketingFooter />
    </div>
  );
}
