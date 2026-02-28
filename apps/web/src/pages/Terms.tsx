import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';
import { TermsSections } from './TermsParts';

export default function Terms() {
  return (
    <div className="min-h-screen font-outfit">
      {/* Hero */}
      <div className="relative h-[280px] md:h-[355px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/landing/hero-bg.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[10px] px-[20px] text-white md:top-[135px] md:gap-[14px]">
          <h1 className="text-center text-[32px] font-medium md:text-[48px]">Terms of Service</h1>
          <p className="text-center text-[16px] font-normal md:text-[20px]">
            Please read these terms of service carefully before using our platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-muted px-[20px] py-[40px] md:px-[76px] md:py-[80px] lg:px-[142px]">
        <div className="mx-auto max-w-[900px] text-[16px] leading-[1.8] text-foreground">
          <h2 className="mb-[24px] text-[36px] font-medium">TERMS OF SERVICE</h2>

          <p className="mb-[32px]">
            Fansbook is a social media website service that allows Users to upload photos and videos
            to their profile, setting a subscription price and therefore earning money from any
            paying subscribers (&quot;Service&quot;). These Terms of Service, together with our
            Privacy Policy (&quot;Terms&quot;), govern your use of Fansbook, including any content,
            functionality, and services offered on or through the website. By registering with and
            using Fansbook, you hereby accept and agree to be bound by and abide by these Terms. If
            you do not want to agree to these Terms, you must not access or use the website. This
            website is offered and available to users who are 18 years of age or older. By using
            this website, you represent and warrant that you are of legal age to form a binding
            contract with us and meet all of the foregoing eligibility requirements. If you do not
            meet all of these requirements, you must not access or use the website.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">1. Registration and Eligibility</h3>
          <p className="mb-[32px]">
            To access certain additional features and functionality of the Service, you must
            register an account with Fansbook. All information provided to Fansbook during
            registration will be held and used in accordance with Fansbook&apos;s Privacy Policy.
            You are responsible for maintaining the confidentiality of your log-in credentials in
            order to use the Service and are fully responsible for all activities that occur through
            the use of your credentials. You agree to notify Fansbook immediately of any
            unauthorized use of your log-in credentials or any other breach of security with respect
            to your account. Fansbook will not be liable for any loss or damage arising from
            unauthorized use of your credentials prior to you notifying Fansbook of such
            unauthorized use or loss of your credentials.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">2. Accuracy of Information</h3>
          <p className="mb-[32px]">
            You agree to provide true, accurate, current, and complete information about yourself as
            requested in any registration forms and to update the information about yourself
            promptly, and as necessary, to keep it current and accurate.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">3. Subscriptions</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p>
              <strong>3.1</strong> If you are looking to subscribe to other profiles, you will need
              to add a payment card. When adding a payment card, your card information is stored by
              a payment processor. However, as far as legally possible, Fansbook reserves the right
              to change the payment processors it uses at any time and without notice to you.
            </p>
            <p>
              <strong>3.2</strong> Fansbook does not store any payment card information. If you are
              looking to earn money from other Users subscribing to your Creator profile, you will
              need to add a bank account and upload a valid form of ID.
            </p>
            <p>
              <strong>3.3</strong> All refunds are handled according to Refund Policy. All issues
              should be resolved by contacting us directly.
            </p>
            <p>
              <strong>3.4</strong> Customer can cancel subscription any time on Creators&apos; page
              by clicking Unsubscribe button. If there are any issues, customer should contact us
              first via email/social media. Customer agrees not to open dispute with Credit Card
              Company before making efforts to contact us to solve any issues/refund requests. We
              usually reply within 1 business day.
            </p>
          </div>

          <TermsSections />
        </div>
      </div>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
