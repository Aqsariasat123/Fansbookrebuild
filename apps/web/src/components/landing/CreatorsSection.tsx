import { Link } from 'react-router-dom';

export { FeaturesSection } from './CreatorsSectionParts';

const WHITE = 'brightness(0) invert(1)';

export function CreatorsSection() {
  return (
    <section className="w-full overflow-hidden bg-muted">
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
            <h2 className="w-[106px] text-center text-[20px] font-medium leading-[1.26] text-foreground">
              Open to all creators
            </h2>
            <p className="mt-[10px] w-[91px] text-center text-[10px] font-normal leading-[1.26] text-foreground">
              enjoying the freedom to express their creativity and earn more
            </p>
          </div>

          <Link
            to="/register"
            className="absolute left-1/2 top-[163px] z-[10] flex -translate-x-1/2 items-center gap-[4px] rounded-[36px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[8px] text-[12px] font-medium text-foreground shadow-[0px_3px_5px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
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
            <h2 className="w-[232px] text-center text-[48px] font-medium leading-[1.26] text-foreground">
              Open to all creators
            </h2>
            <p className="mt-[17px] w-[151px] text-center text-[16px] font-normal leading-[1.26] text-foreground">
              enjoying the freedom to express their creativity and earn more
            </p>
            <Link
              to="/register"
              className="mt-[55px] flex items-center gap-[10px] rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[15px] text-[20px] font-medium text-foreground shadow-[0px_6px_10.1px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
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
