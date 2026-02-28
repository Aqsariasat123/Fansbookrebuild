import { useState } from 'react';

const WHITE = 'brightness(0) invert(1)';

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

const faqData = [
  {
    q: 'What is FansBook?',
    a: 'Fansbook is a creator-first social platform that empowers all creators to share, earn and connect with their fans. We are built for creators and optimized for fans.',
  },
  {
    q: 'Who can create on FansBook?',
    a: 'Anyone who is 18 years or older can create content on FansBook. We welcome creators from all backgrounds and industries.',
  },
  {
    q: 'How much can I make on FansBook?',
    a: 'Earnings vary based on your content, audience size, and engagement. Creators keep 85% of their earnings with weekly payouts.',
  },
  {
    q: 'How long does it take to become a creator?',
    a: 'The verification process typically takes 24-48 hours once you submit all required documents and information.',
  },
];

export function MemberFeaturesSection() {
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
    <section className="bg-muted px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <h2 className="text-center text-[32px] font-medium text-foreground md:text-[48px]">
        Member Features
      </h2>

      {/* Toggle */}
      <div className="mx-auto mt-[24px] flex w-fit rounded-[57px] bg-[#a61651] p-[6px] md:mt-[30px] md:p-[8px]">
        <button
          onClick={() => switchTab('creators')}
          className={`rounded-[59px] px-[28px] py-[8px] text-[14px] font-medium transition-colors sm:px-[40px] sm:text-[16px] md:px-[52px] md:py-[10px] md:text-[18px] ${tab === 'creators' ? 'bg-white text-[#15191c]' : 'text-white'}`}
        >
          Creators
        </button>
        <button
          onClick={() => switchTab('subscribers')}
          className={`rounded-[59px] px-[28px] py-[8px] text-[14px] font-medium transition-colors sm:px-[40px] sm:text-[16px] md:px-[52px] md:py-[10px] md:text-[18px] ${tab === 'subscribers' ? 'bg-white text-[#15191c]' : 'text-white'}`}
        >
          Subscribers
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="mx-auto mt-[20px] flex w-fit border-b-[2px] border-border md:mt-[30px]">
        {subTabs.map((t) => {
          const active = t === activeSubTab;
          return (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`px-[12px] pb-[10px] text-[14px] font-medium sm:px-[16px] md:px-[22px] md:pb-[12px] md:text-[20px] ${active ? 'border-b-[2px] border-[#a61651] text-foreground' : 'text-muted-foreground'}`}
              style={active ? { borderRadius: '4px 4px 0 0', background: '#252d32' } : {}}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Content box */}
      <div className="mx-auto mt-[20px] flex max-w-[781px] flex-col items-center gap-[24px] rounded-[12px] bg-card px-[24px] py-[24px] md:mt-[24px] md:flex-row md:gap-[40px] md:px-[35px] md:py-[30px]">
        <ul className="flex-1 space-y-[18px] md:space-y-[26px]">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-[12px] text-[14px] font-normal text-foreground md:text-[16px]"
            >
              <span className="mt-[4px] inline-block h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#a61651]" />
              {item}
            </li>
          ))}
        </ul>
        <img
          src="/images/landing/member-features.webp"
          alt=""
          className="h-[160px] w-[200px] object-contain md:h-[213px] md:w-[262px]"
        />
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-muted px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <h2 className="text-center text-[28px] font-medium text-foreground sm:text-[36px] md:text-[48px]">
        Frequently asked questions
      </h2>
      <div className="mx-auto mt-[24px] max-w-[900px] space-y-[16px] md:mt-[40px] md:space-y-[26px]">
        {faqData.map((item, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-card px-[16px] py-[16px] md:px-[23px] md:py-[20px]"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center gap-[12px] text-left md:gap-[16px]"
            >
              <span className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-full border border-border md:h-[36px] md:w-[36px]">
                <img
                  src="/icons/landing/expand_more.svg"
                  alt=""
                  className="h-[18px] w-[18px] transition-transform md:h-[20px] md:w-[20px]"
                  style={{ filter: WHITE, transform: open === i ? 'rotate(180deg)' : undefined }}
                />
              </span>
              <span className="text-[15px] font-semibold text-foreground md:text-[18px]">
                {item.q}
              </span>
            </button>
            {open === i && item.a && (
              <p className="mt-[10px] pl-[44px] text-[13px] font-normal leading-[1.6] text-muted-foreground md:mt-[12px] md:pl-[52px] md:text-[16px]">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
