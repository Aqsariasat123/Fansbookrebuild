import { useState } from 'react';
import { Link } from 'react-router-dom';

const WHITE = 'brightness(0) invert(1)';

interface TabContent {
  items: string[];
  image: string;
}

const memberContent: Record<string, Record<string, TabContent>> = {
  creators: {
    Payouts: {
      items: [
        'Creators earn 90% on all sales',
        'Weekly payouts direct to your bank account',
        'PCI compliant to keep your sensitive info safe',
      ],
      image: '/icons/landing/Payouts.png',
    },
    'Custom Offers': {
      items: [
        'Create custom offers for your fans',
        'Set your own prices and terms',
        'Manage all offers from your dashboard',
      ],
      image: '/icons/landing/Custom Offers.png',
    },
    'Uploading Content': {
      items: [
        'Upload high-quality content easily',
        'Multiple file format support',
        'Content scheduling and management',
      ],
      image: '/icons/landing/Uploading Content.png',
    },
  },
  subscribers: {
    'Premium Access': {
      items: [
        'Access exclusive content from creators',
        'High-quality streaming and downloads',
        'Mobile and desktop access',
      ],
      image: '/icons/landing/Premium Access.png',
    },
    Interaction: {
      items: [
        'Direct messaging with creators',
        'Live chat during broadcasts',
        'Custom requests and interactions',
      ],
      image: '/icons/landing/Interaction.png',
    },
    Support: {
      items: [
        '24/7 customer support',
        'Secure payment processing',
        'Privacy protection guaranteed',
      ],
      image: '/icons/landing/Support.png',
    },
  },
};

export function MemberFeaturesSection() {
  const [tab, setTab] = useState<'creators' | 'subscribers'>('creators');
  const [subTab, setSubTab] = useState('Payouts');

  const subTabs = Object.keys(memberContent[tab]);
  const activeSubTab = subTabs.includes(subTab) ? subTab : subTabs[0];
  const { items, image } = memberContent[tab][activeSubTab];

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
              className={`px-[12px] py-[10px] text-[14px] font-medium sm:px-[16px] md:px-[22px] md:py-[12px] md:text-[20px] ${active ? 'rounded-t-[4px] border-b-[2px] border-[#a61651] bg-card text-foreground' : 'text-muted-foreground'}`}
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
          src={image}
          alt={activeSubTab}
          className="h-[160px] w-[200px] object-contain md:h-[213px] md:w-[262px]"
        />
      </div>

      {/* CTA */}
      <div className="mt-[32px] flex justify-center md:mt-[48px]">
        <Link
          to="/register"
          className="flex items-center gap-[10px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[40px] py-[14px] text-[16px] font-medium text-white shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 md:px-[70px] md:py-[17px] md:text-[20px]"
        >
          Start Your Journey
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
