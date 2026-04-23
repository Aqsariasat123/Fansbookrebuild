import { FEATURE_ICONS } from './FeatureIcons';

const FROM = '#01adf1';
const TO = '#a61651';

const GROUPS = [
  {
    key: 'Earnings',
    label: 'EARNINGS',
    features: ['Subscriptions', 'PPV', 'Tipping', 'Marketplace (Auctions/Direct)', 'Crowdfunding'],
  },
  {
    key: 'Streaming',
    label: 'STREAMING',
    features: ['Public Live', '1-to-1 Private', 'Extended Time Options', 'In-Stream Shopping'],
  },
  {
    key: 'AITools',
    label: 'AI TOOLS',
    features: ['Smart-Pricing', 'Upsell Advisor', 'Viral Clip Gen', 'Content Moderation'],
  },
  {
    key: 'Security',
    label: 'SECURITY',
    features: ['AI ID/Age Verification', 'Fraud Prevention', 'Escrow', 'Watermarking'],
  },
  {
    key: 'Engagement',
    label: 'ENGAGEMENT',
    features: ['Stories', 'Chat with File Sharing', 'Leaderboards', 'Subscriber Badges'],
  },
];

const gradText: React.CSSProperties = {
  background: `linear-gradient(135deg, ${FROM}, ${TO})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const gradBorder: React.CSSProperties = {
  background: `linear-gradient(135deg, ${FROM}, ${TO})`,
};

export function FeaturesSection() {
  return (
    <section className="bg-card px-[20px] py-[48px] md:px-[60px] md:py-[72px]">
      {/* Header */}
      <div className="flex flex-col items-center gap-[10px]">
        <div className="h-[2px] w-[48px] rounded-full" style={gradBorder} />
        <h2 className="text-[32px] font-bold tracking-tight text-foreground md:text-[48px]">
          Our Core Features
        </h2>
        <p className="text-[14px] text-muted-foreground md:text-[16px]">
          Everything you need to grow, earn, and connect.
        </p>
      </div>

      {/* Cards — row 1: 3, row 2: 2 centered via 6-col grid */}
      <div className="mx-auto mt-[48px] grid max-w-[1020px] grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-6 md:mt-[64px]">
        {GROUPS.map((g, i) => (
          <div
            key={g.key}
            className={`col-span-1 sm:col-span-1 lg:col-span-2 ${i === 3 ? 'lg:col-start-2' : ''} ${i === 4 ? 'lg:col-start-4' : ''}`}
          >
            {/* Gradient border wrapper */}
            <div
              className="rounded-[22px] p-[1px] transition-all duration-300 hover:shadow-[0_0_40px_rgba(1,173,241,0.2),0_0_60px_rgba(166,22,81,0.15)]"
              style={gradBorder}
            >
              <div className="flex h-full flex-col items-center rounded-[21px] bg-[#080814] px-[24px] pb-[32px] pt-[36px] text-center">
                {FEATURE_ICONS[g.key]}
                <p className="mt-[18px] text-[13px] font-bold tracking-[3px]" style={gradText}>
                  {g.label}
                </p>
                <p className="mt-[12px] text-[13px] leading-[1.9] text-white/55 break-words hyphens-none">
                  {g.features.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
