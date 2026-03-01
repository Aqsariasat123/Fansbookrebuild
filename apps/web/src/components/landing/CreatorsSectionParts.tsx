const features = [
  {
    icon: 'volunteer_activism',
    title: 'Tipping System',
    desc: 'Empower your fans to support you instantly during streams or posts with direct tips — every moment can turn into earnings.',
  },
  {
    icon: 'video_chat',
    title: 'One-to-One Video Streaming',
    desc: 'Connect privately with your fans through high-quality, real-time video sessions — exclusive, personal, and fully secure.',
  },
  {
    icon: 'sell',
    title: 'Personal Market',
    desc: 'Sell your custom content, merch, or fan exclusives directly from your profile. Your space, your rules, your earnings.',
  },
  {
    icon: 'duo',
    title: 'Welcome Video',
    desc: 'Make a killer first impression with a short intro video. Greet visitors and turn them into loyal followers.',
  },
  {
    icon: 'support_agent',
    title: 'Great Customer Service',
    desc: 'Have questions or issues? Our support team is fast, friendly, and always ready to help — 24/7.',
  },
  {
    icon: 'feature_search',
    title: 'New Added',
    desc: "We're always evolving. Expect regular updates, tools, and exciting features that keep Fansbook ahead of the game.",
  },
  {
    icon: 'diversity_1',
    title: 'Public Video Streaming',
    desc: 'Go live for the world — interact, grow your fanbase, and share your moments with a wider audience in real-time.',
  },
  {
    icon: 'vpn_lock',
    title: 'IP Block',
    desc: 'Stay in control by blocking unwanted regions. Your privacy and content safety are always a priority.',
  },
  {
    icon: 'chat',
    title: 'Full Feature Chat',
    desc: 'From emojis to media sharing — enjoy smooth, modern messaging with all the features creators need to stay connected.',
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

      <div className="mx-auto mt-[32px] grid max-w-[1128px] grid-cols-1 gap-[20px] sm:grid-cols-2 md:mt-[60px] md:gap-[30px] lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-[22px] border border-border bg-card">
            <div
              className="flex h-[90px] w-[110px] items-center justify-center shadow-[2px_2px_15.7px_rgba(93,93,93,0.25)] md:h-[131px] md:w-[153px]"
              style={{
                borderRadius: '22px 0 50px 0',
                background: 'hsl(var(--card))',
              }}
            >
              <img
                src={`/icons/landing/${f.icon}.svg`}
                alt=""
                className="h-[50px] w-[50px] md:h-[70px] md:w-[70px]"
              />
            </div>
            <div className="px-[20px] pb-[28px] md:px-[30px] md:pb-[40px]">
              <h3 className="mt-[12px] text-[18px] font-medium text-foreground md:mt-[16px] md:text-[22px]">
                {f.title}
              </h3>
              <p className="mt-[8px] text-[14px] font-normal leading-[1.5] text-foreground md:mt-[12px] md:text-[16px]">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
