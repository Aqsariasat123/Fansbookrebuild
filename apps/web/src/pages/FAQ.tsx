import { useState, useEffect } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';
import { api } from '../lib/api';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const defaultFaqs = [
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

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    api
      .get('/support/faqs')
      .then((res) => {
        const data: FAQItem[] = res.data?.data ?? [];
        if (data.length > 0) {
          setFaqs(data.map((f) => ({ q: f.question, a: f.answer })));
        }
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  return (
    <div className="min-h-screen font-outfit">
      {/* Hero */}
      <div className="relative h-[280px] bg-card md:h-[355px]">
        <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[14px] px-[20px] md:top-[135px] md:px-[76px]">
          <h1 className="text-center text-[30px] font-medium text-foreground md:text-[48px]">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-[10px] font-normal text-foreground md:text-[20px]">
            Find answers to common questions about FansBook.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <section className="bg-muted px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
        <div className="mx-auto max-w-[900px] space-y-[16px] md:space-y-[26px]">
          {faqs.map((item, i) => (
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
                <p className="mt-[10px] pl-[44px] text-[13px] font-normal leading-[1.6] text-muted-foreground md:mt-[12px] md:pl-[52px] md:text-[16px]">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
