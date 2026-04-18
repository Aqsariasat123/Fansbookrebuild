const GROUPS = [
  {
    category: 'Earnings',
    features: ['Subscriptions', 'PPV', 'Tipping', 'Marketplace (Auctions/Direct)', 'Crowdfunding'],
  },
  {
    category: 'Streaming',
    features: ['Public Live', '1-to-1 Private', 'Extended Time Options', 'In-Stream Shopping'],
  },
  {
    category: 'AI Tools',
    features: ['Smart-Pricing', 'Upsell Advisor', 'Viral Clip Gen', 'Content Moderation'],
  },
  {
    category: 'Security',
    features: ['AI ID/Age Verification', 'Fraud Prevention', 'Escrow', 'Watermarking'],
  },
  {
    category: 'Engagement',
    features: ['Stories', 'Chat w/ File Sharing', 'Leaderboards', 'Subscriber Badges'],
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-card px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <div className="flex flex-col items-center">
        <div className="mb-[12px] h-[1px] w-[80px] bg-foreground md:w-[117px]" />
        <h2 className="text-[32px] font-semibold text-foreground md:text-[48px]">Features</h2>
        <p className="mt-[8px] text-[14px] font-normal text-foreground md:text-[16px]">
          Features tailored to your needs!
        </p>
      </div>

      <div className="mx-auto mt-[40px] max-w-[760px] overflow-hidden rounded-[20px] border border-border md:mt-[60px]">
        {/* Header row */}
        <div className="grid grid-cols-[160px_1fr] bg-[#1e2126] px-[24px] py-[16px] md:grid-cols-[200px_1fr] md:px-[36px] md:py-[20px]">
          <span className="text-[14px] font-bold text-white md:text-[16px]">Category</span>
          <span className="text-[14px] font-bold text-white md:text-[16px]">Features</span>
        </div>

        {/* Data rows */}
        {GROUPS.map((g, i) => (
          <div
            key={g.category}
            className={`grid grid-cols-[160px_1fr] items-start px-[24px] py-[20px] md:grid-cols-[200px_1fr] md:px-[36px] md:py-[28px] ${i < GROUPS.length - 1 ? 'border-b border-border' : ''}`}
          >
            <span className="text-[15px] font-bold text-foreground md:text-[17px]">
              {g.category}
            </span>
            <span className="text-[14px] leading-[1.7] text-foreground md:text-[16px]">
              {g.features.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
