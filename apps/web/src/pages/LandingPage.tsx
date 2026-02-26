import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

/* ─── CSS filter to turn any SVG white ─── */
const WHITE = 'brightness(0) invert(1)';

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative min-h-[420px] w-full overflow-hidden md:h-[615px]">
      {/* BG image */}
      <img src="/images/landing/hero-bg.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(24,21,28,0.94)' }} />

      <MarketingNav />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-[20px] pt-[100px] pb-[40px] md:pt-[40px] md:pb-0">
        <h1 className="max-w-[580px] text-center text-[28px] font-medium leading-[1.2] text-[#f8f8f8] sm:text-[36px] md:text-[48px]">
          Connect with Creators.<br />Watch. Subscribe. Support.
        </h1>
        <p className="mt-[12px] text-center text-[14px] font-medium text-[#f8f8f8] md:mt-[16px] md:text-[16px]">
          Get in here and help your favorite creators do thier thing!
        </p>
        <Link
          to="/register"
          className="mt-[32px] flex items-center gap-[10px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[40px] py-[14px] text-[16px] font-medium text-[#f8f8f8] shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 md:mt-[48px] md:px-[70px] md:py-[17px] md:text-[20px]"
        >
          Join Now
          <img src="/icons/landing/arrow_forward.svg" alt="" className="h-[24px] w-[24px]" style={{ filter: WHITE }} />
        </Link>
      </div>
    </section>
  );
}

/* ─── Open to all creators ─── */
function CreatorsSection() {
  return (
    <section className="w-full bg-[#15191c]">
      <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden">
        {/* Desktop: 8 creator avatars — absolute positioned cascade */}
        <div className="hidden lg:block">
          <img src="/images/landing/pos-1.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: -84, top: 120, width: 200, height: 202, zIndex: 7 }} />
          <img src="/images/landing/pos-2.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 104, top: 135, width: 170, height: 172, zIndex: 5 }} />
          <img src="/images/landing/pos-3.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 262, top: 146, width: 148, height: 150, zIndex: 3 }} />
          <img src="/images/landing/pos-4.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 398, top: 159, width: 122, height: 124, zIndex: 1 }} />
          <img src="/images/landing/pos-5.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 759, top: 159, width: 122, height: 124, zIndex: 2 }} />
          <img src="/images/landing/pos-6.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 869, top: 146, width: 148, height: 150, zIndex: 4, transform: 'scaleX(-1)' }} />
          <img src="/images/landing/pos-7.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 1005, top: 135, width: 170, height: 172, zIndex: 6 }} />
          <img src="/images/landing/pos-8.webp" alt="" className="absolute rounded-[12px] object-cover"
            style={{ left: 1163, top: 120, width: 200, height: 202, zIndex: 8, transform: 'scaleX(-1)' }} />
        </div>

        {/* Mobile: cascade images + text + button */}
        <div className="relative h-[212px] overflow-hidden lg:hidden">
          {/* Left side images (outside → inside) */}
          <img src="/images/landing/pos-1.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ left: '-25%', top: 55, width: 91, height: 92 }} />
          <img src="/images/landing/pos-2.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ left: '-5.5%', top: 61, width: 77, height: 78 }} />
          <img src="/images/landing/pos-3.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ left: '10.9%', top: 66, width: 67, height: 68 }} />
          <img src="/images/landing/pos-4.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ left: '25%', top: 72, width: 55, height: 56 }} />
          {/* Right side images (inside → outside) */}
          <img src="/images/landing/pos-5.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ right: '25%', top: 72, width: 55, height: 56 }} />
          <img src="/images/landing/pos-6.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ right: '10.9%', top: 66, width: 67, height: 68, transform: 'scaleX(-1)' }} />
          <img src="/images/landing/pos-7.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ right: '-5.5%', top: 61, width: 77, height: 78 }} />
          <img src="/images/landing/pos-8.webp" alt="" className="absolute rounded-[5px] object-cover"
            style={{ right: '-25%', top: 55, width: 91, height: 92, transform: 'scaleX(-1)' }} />

          {/* Center text */}
          <div className="absolute inset-x-0 top-[33px] z-[10] flex flex-col items-center">
            <h2 className="w-[106px] text-center text-[20px] font-medium leading-[1.26] text-[#f8f8f8]">
              Open to all creators
            </h2>
            <p className="mt-[10px] w-[91px] text-center text-[10px] font-normal leading-[1.26] text-[#f8f8f8]">
              enjoying the freedom to express their creativity and earn more
            </p>
          </div>

          {/* Button */}
          <Link
            to="/register"
            className="absolute left-1/2 top-[163px] z-[10] flex -translate-x-1/2 items-center gap-[4px] rounded-[36px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[8px] text-[12px] font-medium text-[#f8f8f8] shadow-[0px_3px_5px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
          >
            Start Your Journey
            <img src="/icons/landing/arrow_forward.svg" alt="" className="h-[11px] w-[11px]" style={{ filter: WHITE }} />
          </Link>
        </div>

        {/* Desktop: center content */}
        <div className="relative z-[10] hidden flex-col items-center lg:flex lg:h-[466px]">
          <div className="flex h-full flex-col items-center pt-[66px]">
            <h2 className="w-[232px] text-center text-[48px] font-medium leading-[1.26] text-[#f8f8f8]">
              Open to all creators
            </h2>
            <p className="mt-[17px] w-[151px] text-center text-[16px] font-normal leading-[1.26] text-[#f8f8f8]">
              enjoying the freedom to express their creativity and earn more
            </p>
            <Link
              to="/register"
              className="mt-[55px] flex items-center gap-[10px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[15px] text-[20px] font-medium text-[#f8f8f8] shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
            >
              Start Your Journey
              <img src="/icons/landing/arrow_forward.svg" alt="" className="h-[24px] w-[24px]" style={{ filter: WHITE }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { icon: 'volunteer_activism', title: 'Tipping System', desc: 'Empower your fans to support you instantly during streams or posts with direct tips — every moment can turn into earnings.' },
  { icon: 'video_chat', title: 'One-to-One Video Streaming', desc: 'Connect privately with your fans through high-quality, real-time video sessions — exclusive, personal, and fully secure.', highlight: true },
  { icon: 'sell', title: 'Personal Market', desc: 'Sell your custom content, merch, or fan exclusives directly from your profile. Your space, your rules, your earnings.' },
  { icon: 'duo', title: 'Welcome Video', desc: 'Make a killer first impression with a short intro video. Greet visitors and turn them into loyal followers.' },
  { icon: 'support_agent', title: 'Great Customer Service', desc: 'Have questions or issues? Our support team is fast, friendly, and always ready to help — 24/7.' },
  { icon: 'feature_search', title: 'New Added', desc: "We're always evolving. Expect regular updates, tools, and exciting features that keep Fansbook ahead of the game." },
  { icon: 'diversity_1', title: 'Public Video Streaming', desc: 'Go live for the world — interact, grow your fanbase, and share your moments with a wider audience in real-time.' },
  { icon: 'vpn_lock', title: 'IP Block', desc: 'Stay in control by blocking unwanted regions. Your privacy and content safety are always a priority.' },
  { icon: 'chat', title: 'Full Feature Chat', desc: 'From emojis to media sharing — enjoy smooth, modern messaging with all the features creators need to stay connected.' },
];

function FeaturesSection() {
  return (
    <section className="bg-[#0e1012] px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="mb-[12px] h-[1px] w-[80px] bg-[#f8f8f8] md:w-[117px]" />
        <h2 className="text-[32px] font-semibold text-[#f8f8f8] md:text-[48px]">Features</h2>
        <p className="mt-[8px] text-[14px] font-normal text-[#f8f8f8] md:text-[16px]">Features tailored to your needs!</p>
      </div>

      {/* Grid */}
      <div className="mx-auto mt-[32px] grid max-w-[1128px] grid-cols-1 gap-[20px] sm:grid-cols-2 md:mt-[60px] md:gap-[30px] lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className={`rounded-[22px] border border-[#5d5d5d] ${f.highlight ? 'bg-[#15191c]' : 'bg-[#0e1012]'}`}
          >
            {/* Icon container */}
            <div
              className="flex h-[90px] w-[110px] items-center justify-center shadow-[2px_2px_15.7px_rgba(93,93,93,0.25)] md:h-[131px] md:w-[153px]"
              style={{ borderRadius: '22px 0 50px 0', background: f.highlight ? '#15191c' : '#0e1012' }}
            >
              <img src={`/icons/landing/${f.icon}.svg`} alt="" className="h-[50px] w-[50px] md:h-[70px] md:w-[70px]" />
            </div>
            {/* Text */}
            <div className="px-[20px] pb-[28px] md:px-[30px] md:pb-[40px]">
              <h3 className="mt-[12px] text-[18px] font-medium text-[#f8f8f8] md:mt-[16px] md:text-[22px]">{f.title}</h3>
              <p className="mt-[8px] text-[14px] font-normal leading-[1.5] text-[#f8f8f8] md:mt-[12px] md:text-[16px]">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Member Features ─── */
const memberContent: Record<string, Record<string, string[]>> = {
  creators: {
    Payouts: [
      'Creators earn 90% on all sales',
      'Weekly payouts direct to your bank account',
      'PCI compliant to keep your sensitive info safe',
    ],
    'Custom Offers': [
      'Create custom offers for your fans',
      'Set your own prices and terms',
      'Manage all offers from your dashboard',
    ],
    'Uploading Content': [
      'Upload high-quality content easily',
      'Multiple file format support',
      'Content scheduling and management',
    ],
  },
  subscribers: {
    'Premium Access': [
      'Access exclusive content from creators',
      'High-quality streaming and downloads',
      'Mobile and desktop access',
    ],
    Interaction: [
      'Direct messaging with creators',
      'Live chat during broadcasts',
      'Custom requests and interactions',
    ],
    Support: [
      '24/7 customer support',
      'Secure payment processing',
      'Privacy protection guaranteed',
    ],
  },
};

function MemberFeaturesSection() {
  const [tab, setTab] = useState<'creators' | 'subscribers'>('creators');
  const [subTab, setSubTab] = useState('Payouts');

  const subTabs = Object.keys(memberContent[tab]);
  const activeSubTab = subTabs.includes(subTab) ? subTab : subTabs[0];
  const items = memberContent[tab][activeSubTab];

  function switchTab(newTab: 'creators' | 'subscribers') {
    setTab(newTab);
    setSubTab(Object.keys(memberContent[newTab])[0]);
  }

  return (
    <section className="bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <h2 className="text-center text-[32px] font-medium text-[#f8f8f8] md:text-[48px]">Member Features</h2>

      {/* Toggle */}
      <div className="mx-auto mt-[24px] flex w-fit rounded-[57px] bg-[#a61651] p-[6px] md:mt-[30px] md:p-[8px]">
        <button
          onClick={() => switchTab('creators')}
          className={`rounded-[59px] px-[28px] py-[8px] text-[14px] font-medium transition-colors sm:px-[40px] sm:text-[16px] md:px-[52px] md:py-[10px] md:text-[18px] ${tab === 'creators' ? 'bg-[#f8f8f8] text-[#15191c]' : 'text-[#f8f8f8]'}`}
        >
          Creators
        </button>
        <button
          onClick={() => switchTab('subscribers')}
          className={`rounded-[59px] px-[28px] py-[8px] text-[14px] font-medium transition-colors sm:px-[40px] sm:text-[16px] md:px-[52px] md:py-[10px] md:text-[18px] ${tab === 'subscribers' ? 'bg-[#f8f8f8] text-[#15191c]' : 'text-[#f8f8f8]'}`}
        >
          Subscribers
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="mx-auto mt-[20px] flex w-fit border-b-[2px] border-[#b4b4b4] md:mt-[30px]">
        {subTabs.map((t) => {
          const active = t === activeSubTab;
          return (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-[12px] pb-[10px] text-[14px] font-medium sm:px-[16px] md:px-[22px] md:pb-[12px] md:text-[20px] ${active ? 'border-b-[2px] border-[#a61651] text-[#f8f8f8]' : 'text-[#b4b4b4]'}`}
              style={active ? { borderRadius: '4px 4px 0 0', background: '#252d32' } : {}}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Content box */}
      <div className="mx-auto mt-[20px] flex max-w-[781px] flex-col items-center gap-[24px] rounded-[12px] bg-[#f8f8f8] px-[24px] py-[24px] md:mt-[24px] md:flex-row md:gap-[40px] md:px-[35px] md:py-[30px]">
        <ul className="flex-1 space-y-[18px] md:space-y-[26px]">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-[12px] text-[14px] font-normal text-[#15191c] md:text-[16px]">
              <span className="mt-[4px] inline-block h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#a61651]" />
              {item}
            </li>
          ))}
        </ul>
        <img src="/images/landing/member-features.webp" alt="" className="h-[160px] w-[200px] object-contain md:h-[213px] md:w-[262px]" />
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqData = [
  { q: 'What is FansBook?', a: 'Fansbook is a creator-first social platform that empowers all creators to share, earn and connect with their fans. We are built for creators and optimized for fans.' },
  { q: 'Who can create on FansBook?', a: 'Anyone who is 18 years or older can create content on FansBook. We welcome creators from all backgrounds and industries.' },
  { q: 'How much can I make on FansBook?', a: 'Earnings vary based on your content, audience size, and engagement. Creators keep 85% of their earnings with weekly payouts.' },
  { q: 'How long does it take to become a creator?', a: 'The verification process typically takes 24-48 hours once you submit all required documents and information.' },
];

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <h2 className="text-center text-[28px] font-medium text-[#f8f8f8] sm:text-[36px] md:text-[48px]">Frequently asked questions</h2>
      <div className="mx-auto mt-[24px] max-w-[900px] space-y-[16px] md:mt-[40px] md:space-y-[26px]">
        {faqData.map((item, i) => (
          <div key={i} className="rounded-[8px] bg-[#0e1012] px-[16px] py-[16px] md:px-[23px] md:py-[20px]">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center gap-[12px] text-left md:gap-[16px]"
            >
              {/* Circle icon with chevron */}
              <span className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-full border border-[#5d5d5d] md:h-[36px] md:w-[36px]">
                <img
                  src="/icons/landing/expand_more.svg"
                  alt=""
                  className="h-[18px] w-[18px] transition-transform md:h-[20px] md:w-[20px]"
                  style={{ filter: WHITE, transform: open === i ? 'rotate(180deg)' : undefined }}
                />
              </span>
              <span className="text-[15px] font-semibold text-[#f8f8f8] md:text-[18px]">{item.q}</span>
            </button>
            {open === i && item.a && (
              <p className="mt-[10px] pl-[44px] text-[13px] font-normal leading-[1.6] text-[#b4b4b4] md:mt-[12px] md:pl-[52px] md:text-[16px]">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Reviews ─── */
const reviews = [
  { name: 'Kayla', role: 'Creator', img: 1, text: 'Fansbook completely changed the way I connect with my audience. The tipping system and video calls make every interaction feel personal. I doubled my earnings in the first month!' },
  { name: 'Alex zin', role: 'Fan', img: 2, text: 'As a fan, I love how easy it is to support my favorite creators directly. The platform feels safe, the content is exclusive, and the chat features are next level.' },
  { name: 'Sipama', role: 'Creator', img: 3, text: 'The 90% payout rate is unbeatable. Weekly deposits, amazing support team, and the tools to grow my brand — Fansbook truly puts creators first. Highly recommend!' },
];

function ReviewsSection() {
  return (
    <section className="bg-[#0e1012] px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <div className="flex flex-col items-center">
        <div className="mb-[12px] h-[1px] w-[80px] bg-[#f8f8f8] md:w-[117px]" />
        <h2 className="text-[32px] font-semibold text-[#f8f8f8] md:text-[48px]">Reviews</h2>
      </div>
      <div className="mx-auto mt-[24px] grid max-w-[1128px] grid-cols-1 gap-[20px] sm:grid-cols-2 md:mt-[40px] md:gap-[30px] lg:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-[22px] border border-[#725757] bg-[#f8f8f8] p-[20px] shadow-[0px_0px_17.8px_1px_rgba(0,0,0,0.25)] md:p-[24px]"
          >
            {/* Stars */}
            <div className="flex gap-[8px] md:gap-[10px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-icons-outlined text-[24px] text-[#ffc107] md:text-[30px]">star</span>
              ))}
            </div>
            <p className="mt-[12px] text-[14px] font-normal leading-[1.5] text-[#15191c] md:mt-[16px] md:text-[16px]">
              {r.text}
            </p>
            <div className="mt-[16px] flex items-center gap-[12px] md:mt-[20px]">
              <div className="h-[44px] w-[44px] overflow-hidden rounded-full bg-[#d9d9d9] md:h-[52px] md:w-[52px]">
                <img src={`/images/landing/reviewer-${r.img}.webp`} alt={r.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#15191c] md:text-[16px]">{r.name}</p>
                <p className="text-[11px] font-normal text-[#5d5d5d] md:text-[12px]">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Trending Creators ─── */
const trendingCreators = [
  { name: 'Jassica', followers: '21.05k', idx: 1 },
  { name: 'Jassica', followers: '21.05k', idx: 2 },
  { name: 'Jassica', followers: '21.05k', idx: 3 },
  { name: 'Jassica', followers: '21.05k', idx: 1 },
  { name: 'Jassica', followers: '21.05k', idx: 2 },
  { name: 'Jassica', followers: '21.05k', idx: 3 },
];

function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  }

  return (
    <section className="bg-[#15191c] py-[40px] md:py-[66px]">
      <div className="flex flex-col items-center px-[20px]">
        <div className="mb-[12px] h-[1px] w-[80px] bg-[#f8f8f8] md:w-[117px]" />
        <h2 className="text-center text-[28px] font-semibold text-[#f8f8f8] sm:text-[36px] md:text-[48px]">Top Trending Creators</h2>
        <p className="mt-[8px] text-[14px] font-normal text-[#f8f8f8] md:text-[16px]">Discover the Rising Stars of this week</p>
      </div>

      <div className="relative mx-auto mt-[30px] max-w-[1280px] px-[12px] md:mt-[50px] md:px-[20px]">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-[4px] top-1/2 z-10 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full border border-[#f8f8f8]/30 bg-[#15191c]/80 hover:bg-[#15191c] md:left-[20px] md:h-[40px] md:w-[40px]"
        >
          <img src="/icons/landing/arrow_back_ios.svg" alt="" className="h-[16px] w-[16px] pl-[3px] md:h-[20px] md:w-[20px] md:pl-[4px]" style={{ filter: WHITE }} />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="mx-[40px] flex gap-[16px] overflow-x-auto scroll-smooth scrollbar-hide md:mx-[50px] md:gap-[20px]"
        >
          {trendingCreators.map((c, i) => (
            <div key={i} className="w-[280px] min-w-[280px] rounded-[22px] bg-[#0e1012] p-[12px] md:w-[370px] md:min-w-[370px] md:p-[15px]">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px] md:gap-[12px]">
                  <div className="h-[65px] w-[60px] flex-none overflow-hidden rounded-[16px] bg-[#333] md:h-[95px] md:w-[89px] md:rounded-[22px]">
                    <img src={`/images/landing/trending-profile-${c.idx}.webp`} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[16px] font-medium text-[#f8f8f8] md:text-[20px]">{c.name}</p>
                    <p className="text-[13px] font-normal text-[#5d5d5d] md:text-[16px]">{c.followers} followers</p>
                  </div>
                </div>
                <button className="flex-none rounded-[16px] border border-[#f8f8f8] px-[16px] py-[10px] text-[13px] font-normal text-[#f8f8f8] md:rounded-[22px] md:px-[30px] md:py-[15px] md:text-[16px]">
                  Follow
                </button>
              </div>

              {/* Images grid */}
              <div className="mt-[8px] flex gap-[8px] md:mt-[10px] md:gap-[10px]">
                <div className="h-[180px] flex-[1.25] overflow-hidden rounded-[16px] bg-[#333] md:h-[264px] md:rounded-[22px]">
                  <img src={`/images/landing/trending-gallery-${c.idx}a.webp`} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-[8px] md:gap-[10px]">
                  <div className="h-[86px] overflow-hidden rounded-[16px] bg-[#333] md:h-[127px] md:rounded-[22px]">
                    <img src={`/images/landing/trending-gallery-${c.idx}b.webp`} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-[86px] overflow-hidden rounded-[16px] bg-[#333] md:h-[127px] md:rounded-[22px]">
                    <img src={`/images/landing/trending-gallery-${c.idx}c.webp`} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>

              {/* View Profile */}
              <Link
                to={`/profile/${c.name.toLowerCase()}`}
                className="mt-[10px] flex w-full items-center justify-center gap-[8px] rounded-[16px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[14px] font-normal text-[#f8f8f8] transition-opacity hover:opacity-90 md:mt-[12px] md:rounded-[22px] md:py-[17px] md:text-[16px]"
              >
                View Profile
                <img src="/icons/landing/arrow_forward.svg" alt="" className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]" style={{ filter: WHITE }} />
              </Link>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-[4px] top-1/2 z-10 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full border border-[#f8f8f8]/30 bg-[#15191c]/80 hover:bg-[#15191c] md:right-[20px] md:h-[40px] md:w-[40px]"
        >
          <img src="/icons/landing/arrow_forward_ios.svg" alt="" className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]" style={{ filter: WHITE }} />
        </button>
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
