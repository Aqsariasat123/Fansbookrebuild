import { Link } from 'react-router-dom';

const WHITE = 'brightness(0) invert(1)';

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
    highlight: true,
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

export function CreatorsSection() {
  return (
    <section className="w-full overflow-hidden bg-[#15191c]">
      <div className="relative w-full">
        {/* Desktop: 8 creator avatars — vw-scaled so overlaps stay consistent */}
        <div className="hidden lg:block">
          <img
            src="/images/landing/pos-1.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '-6.56vw', top: 120, width: '15.625vw', height: '15.78vw', zIndex: 7 }}
          />
          <img
            src="/images/landing/pos-2.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '8.125vw', top: 135, width: '13.28vw', height: '13.44vw', zIndex: 5 }}
          />
          <img
            src="/images/landing/pos-3.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '20.47vw', top: 146, width: '11.56vw', height: '11.72vw', zIndex: 3 }}
          />
          <img
            src="/images/landing/pos-4.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '31.09vw', top: 159, width: '9.53vw', height: '9.69vw', zIndex: 1 }}
          />
          <img
            src="/images/landing/pos-5.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '59.30vw', top: 159, width: '9.53vw', height: '9.69vw', zIndex: 2 }}
          />
          <img
            src="/images/landing/pos-6.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{
              left: '67.89vw',
              top: 146,
              width: '11.56vw',
              height: '11.72vw',
              zIndex: 4,
              transform: 'scaleX(-1)',
            }}
          />
          <img
            src="/images/landing/pos-7.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '78.52vw', top: 135, width: '13.28vw', height: '13.44vw', zIndex: 6 }}
          />
          <img
            src="/images/landing/pos-8.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{
              left: '90.86vw',
              top: 120,
              width: '15.625vw',
              height: '15.78vw',
              zIndex: 8,
              transform: 'scaleX(-1)',
            }}
          />
        </div>

        {/* Mobile: cascade images + text + button */}
        <div className="relative h-[212px] overflow-hidden lg:hidden">
          <img
            src="/images/landing/pos-1.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ left: '-25%', top: 55, width: 91, height: 92 }}
          />
          <img
            src="/images/landing/pos-2.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ left: '-5.5%', top: 61, width: 77, height: 78 }}
          />
          <img
            src="/images/landing/pos-3.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ left: '10.9%', top: 66, width: 67, height: 68 }}
          />
          <img
            src="/images/landing/pos-4.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ left: '25%', top: 72, width: 55, height: 56 }}
          />
          <img
            src="/images/landing/pos-5.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ right: '25%', top: 72, width: 55, height: 56 }}
          />
          <img
            src="/images/landing/pos-6.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ right: '10.9%', top: 66, width: 67, height: 68, transform: 'scaleX(-1)' }}
          />
          <img
            src="/images/landing/pos-7.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ right: '-5.5%', top: 61, width: 77, height: 78 }}
          />
          <img
            src="/images/landing/pos-8.webp"
            alt=""
            className="absolute rounded-[5px] object-cover"
            style={{ right: '-25%', top: 55, width: 91, height: 92, transform: 'scaleX(-1)' }}
          />

          <div className="absolute inset-x-0 top-[33px] z-[10] flex flex-col items-center">
            <h2 className="w-[106px] text-center text-[20px] font-medium leading-[1.26] text-[#f8f8f8]">
              Open to all creators
            </h2>
            <p className="mt-[10px] w-[91px] text-center text-[10px] font-normal leading-[1.26] text-[#f8f8f8]">
              enjoying the freedom to express their creativity and earn more
            </p>
          </div>

          <Link
            to="/register"
            className="absolute left-1/2 top-[163px] z-[10] flex -translate-x-1/2 items-center gap-[4px] rounded-[36px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[8px] text-[12px] font-medium text-[#f8f8f8] shadow-[0px_3px_5px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
          >
            Start Your Journey
            <img
              src="/icons/landing/arrow_forward.svg"
              alt=""
              className="h-[11px] w-[11px]"
              style={{ filter: WHITE }}
            />
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
              <img
                src="/icons/landing/arrow_forward.svg"
                alt=""
                className="h-[24px] w-[24px]"
                style={{ filter: WHITE }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="bg-[#0e1012] px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <div className="flex flex-col items-center">
        <div className="mb-[12px] h-[1px] w-[80px] bg-[#f8f8f8] md:w-[117px]" />
        <h2 className="text-[32px] font-semibold text-[#f8f8f8] md:text-[48px]">Features</h2>
        <p className="mt-[8px] text-[14px] font-normal text-[#f8f8f8] md:text-[16px]">
          Features tailored to your needs!
        </p>
      </div>

      <div className="mx-auto mt-[32px] grid max-w-[1128px] grid-cols-1 gap-[20px] sm:grid-cols-2 md:mt-[60px] md:gap-[30px] lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className={`rounded-[22px] border border-[#5d5d5d] ${f.highlight ? 'bg-[#15191c]' : 'bg-[#0e1012]'}`}
          >
            <div
              className="flex h-[90px] w-[110px] items-center justify-center shadow-[2px_2px_15.7px_rgba(93,93,93,0.25)] md:h-[131px] md:w-[153px]"
              style={{
                borderRadius: '22px 0 50px 0',
                background: f.highlight ? '#15191c' : '#0e1012',
              }}
            >
              <img
                src={`/icons/landing/${f.icon}.svg`}
                alt=""
                className="h-[50px] w-[50px] md:h-[70px] md:w-[70px]"
              />
            </div>
            <div className="px-[20px] pb-[28px] md:px-[30px] md:pb-[40px]">
              <h3 className="mt-[12px] text-[18px] font-medium text-[#f8f8f8] md:mt-[16px] md:text-[22px]">
                {f.title}
              </h3>
              <p className="mt-[8px] text-[14px] font-normal leading-[1.5] text-[#f8f8f8] md:mt-[12px] md:text-[16px]">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
