import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

export default function Privacy() {
  return (
    <div className="min-h-screen font-outfit">
      {/* Hero */}
      <div className="relative h-[280px] md:h-[355px]">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/landing/hero-bg.webp" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.94)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[10px] px-[20px] text-[#f8f8f8] md:top-[135px] md:gap-[14px]">
          <h1 className="text-center text-[32px] font-medium md:text-[48px]">Privacy Policy</h1>
          <p className="text-center text-[16px] font-normal md:text-[20px]">
            Your privacy is important to us. Please review our policy to understand how we handle your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[80px] lg:px-[142px]">
        <div className="mx-auto max-w-[900px] text-[16px] leading-[1.8] text-[#f8f8f8]">
          <h2 className="mb-[24px] text-[36px] font-medium">PRIVACY POLICY</h2>

          <h3 className="mb-[16px] text-[24px] font-medium">1. Our Commitment to Your Privacy</h3>
          <p className="mb-[32px]">
            Our Privacy Policy tells you what personally identifiable information Fansbook may collect from you, how Fansbook may process your personally identifiable information, how you can limit our use of your personally identifiable information, and your rights to obtain, modify and/or delete any personally identifiable information Fansbook has collected from you.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">2. Information We Collect</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>2.1 Information you provide Fansbook.</strong> Fansbook collects personal information when you request information about our services or otherwise voluntarily provide such information through our site. Generally, you will have control over the amount and type of information you provide to us when using our site.</p>
            <p><strong>2.2 Information Collected Automatically.</strong> When you use our site, we automatically collect certain information by the interaction of your mobile device or web browser with our platform.</p>
            <p><strong>2.3 Cookies.</strong> Like many other sites, we use "Cookies." A Cookie is a small piece of data stored on your computer or mobile device by our site. We use Cookies to identify the areas of our site that you have visited. We also use cookies to enhance your online experience by eliminating the need to log in multiple times for specific content. Finally, we may use Cookies to personalize the content that you see on our site or to customize marketing and other information we provide to you.</p>
            <p><strong>2.4 Other Automatically-Gathered Information.</strong> Fansbook may automatically record information when you visit its site, including the URL, IP address, browser type and language, and the date and time of your visit. Fansbook uses this information to analyze trends among its users to help improve its site or customize communications and information that you receive from us. If combined with other information we know about you from previous visits, the data possibly could be used to identify you personally, even if you are not signed in to our site.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">3. How Information Is Used</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p>When Fansbook uses or processes personal data about you, it does so only as necessary to provide the services you use or otherwise with your consent, to comply with applicable law, or to fulfill other legitimate interests of you or us as described in this Policy. Through our site, you will be provided with the choice of which types of communications you will receive with us, and the ability to change those choices whenever you want.</p>
            <p><strong>3.1 Information we process with your consent.</strong> Through certain actions when otherwise there is no contractual relationship between us, such as when you browse our site or ask us to provide you more information about our business, you provide your consent to us to process information that may be personally identifiable information. Wherever possible, we aim to obtain your explicit consent to process this information, for example, by asking you to agree to our use of Cookies or to receive communications from us. We continue to process your information on this basis until you withdraw your consent or it can be reasonably assumed that your consent no longer exists. You may withdraw your consent at any time by instructing us using the contact information at the end of this Policy. However, if you do so, you may not be able to use our site further.</p>
            <p><strong>3.2 Legally Required Releases of Information.</strong> We may be legally required to disclose your personally identifiable information, if such disclosure is (a) required by law, or other legal process; (b) necessary to assist law enforcement officials or government enforcement agencies; (c) necessary to investigate violations of or otherwise enforce our Legal Terms; (d) necessary to protect us from legal action or claims from third parties including you; and/or (e) necessary to protect the legal rights, personal/real property, or personal safety of our company, clients, third party partners, employees, and affiliates.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">4. Obtaining, Changing or Deleting Your Information</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>4.1 Access to your personal information.</strong> To obtain a copy of all information Fansbook maintains about you, you may send us a request using the contact information at the end of this Policy or, if available, through a tool on our site. After receiving the request, we will tell you when we expect to provide you with the information, and whether we require any fee for providing it to you.</p>
            <p><strong>4.2 Remove or Change your Information.</strong> If you wish us to remove or change personally identifiable information that you have provided us, you may contact us at the contact information at the end of this Policy or if available through a tool on our site.</p>
            <p><strong>4.3 Verification of your Information.</strong> When we receive any request to access, edit or delete personally identifiable information, we will first take reasonable steps to verify your identity before granting you access or otherwise taking any action. This is important to safeguard your information.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">5. Retention Period for Personal Data</h3>
          <p className="mb-[16px]">Except as otherwise mentioned in this Policy, Fansbook keeps your personally identifiable information only for as long as required:</p>
          <ul className="mb-[32px] list-none space-y-[12px] pl-0">
            {[
              'To provide you with the services you have requested, or otherwise to perform or enforce a contract between us.',
              'To continue to provide the best possible user experience to visitors who return to our site to collect information.',
              'To comply with other law, including for any period demanded by tax authorities.',
              'To support a claim or defense in any court or in any legal, regulatory or administrative proceeding.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-[12px]">
                <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-[16px] text-[24px] font-medium">6. Limitation of Liability</h3>
          <p className="mb-[32px]">
            You assume the sole risk of transmitting your information as it relates to the use of this site, and for any data corruptions, intentional interceptions, intrusions or unauthorized access to information, or of any delays, interruptions to or failures preventing the use this site. In no event shall we be liable for any direct, indirect, special, consequential or monetary damages, including fees, and penalties in connection with your use of materials posted on this site or connectivity to or from this site to any other site.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">7. Protecting Your Child's Privacy</h3>
          <p className="mb-[32px]">
            Even though our site is not designed for use by anyone under the age of 18, we realize that a child may attempt to access the site. We do not knowingly collect personally identifiable information from a child. If you are a parent or guardian and believe your child is using our site, please contact us.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">8. Changes to Our Privacy Policy</h3>
          <p className="mb-[32px]">
            Fansbook reserves the right to change this privacy policy at any time. If we decide to change this Privacy Policy, we will post those changes on the site so our users are always aware of what information we collect, use, and disclose. In all cases, your continued use of our site after any change to this Privacy Policy will constitute your acceptance of such change.
          </p>
        </div>
      </div>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
