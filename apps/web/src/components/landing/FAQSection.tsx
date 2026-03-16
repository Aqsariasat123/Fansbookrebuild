import { useState } from 'react';

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
                  style={{ transform: open === i ? 'rotate(180deg)' : undefined }}
                />
              </span>
              <span className="text-[15px] font-semibold text-foreground md:text-[18px]">
                {item.q}
              </span>
            </button>
            {open === i && item.a && (
              <p className="mt-[10px] pl-[44px] text-[15px] font-normal leading-[1.6] text-foreground/70 md:mt-[12px] md:pl-[52px] md:text-[16px]">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
