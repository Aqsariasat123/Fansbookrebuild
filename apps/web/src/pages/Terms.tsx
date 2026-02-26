import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

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
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[10px] px-[20px] text-[#f8f8f8] md:top-[135px] md:gap-[14px]">
          <h1 className="text-center text-[32px] font-medium md:text-[48px]">Terms of Service</h1>
          <p className="text-center text-[16px] font-normal md:text-[20px]">
            Please read these terms of service carefully before using our platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[80px] lg:px-[142px]">
        <div className="mx-auto max-w-[900px] text-[16px] leading-[1.8] text-[#f8f8f8]">
          <h2 className="mb-[24px] text-[36px] font-medium">TERMS OF SERVICE</h2>

          <p className="mb-[32px]">
            Fansbook is a social media website service that allows Users to upload photos and videos to their profile, setting a subscription price and therefore earning money from any paying subscribers ("Service"). These Terms of Service, together with our Privacy Policy ("Terms"), govern your use of Fansbook, including any content, functionality, and services offered on or through the website. By registering with and using Fansbook, you hereby accept and agree to be bound by and abide by these Terms. If you do not want to agree to these Terms, you must not access or use the website. This website is offered and available to users who are 18 years of age or older. By using this website, you represent and warrant that you are of legal age to form a binding contract with us and meet all of the foregoing eligibility requirements. If you do not meet all of these requirements, you must not access or use the website.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">1. Registration and Eligibility</h3>
          <p className="mb-[32px]">
            To access certain additional features and functionality of the Service, you must register an account with Fansbook. All information provided to Fansbook during registration will be held and used in accordance with Fansbook's Privacy Policy. You are responsible for maintaining the confidentiality of your log-in credentials in order to use the Service and are fully responsible for all activities that occur through the use of your credentials. You agree to notify Fansbook immediately of any unauthorized use of your log-in credentials or any other breach of security with respect to your account. Fansbook will not be liable for any loss or damage arising from unauthorized use of your credentials prior to you notifying Fansbook of such unauthorized use or loss of your credentials.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">2. Accuracy of Information</h3>
          <p className="mb-[32px]">
            You agree to provide true, accurate, current, and complete information about yourself as requested in any registration forms and to update the information about yourself promptly, and as necessary, to keep it current and accurate.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">3. Subscriptions</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>3.1</strong> If you are looking to subscribe to other profiles, you will need to add a payment card. When adding a payment card, your card information is stored by a payment processor. However, as far as legally possible, Fansbook reserves the right to change the payment processors it uses at any time and without notice to you.</p>
            <p><strong>3.2</strong> Fansbook does not store any payment card information. If you are looking to earn money from other Users subscribing to your Creator profile, you will need to add a bank account and upload a valid form of ID.</p>
            <p><strong>3.3</strong> All refunds are handled according to Refund Policy. All issues should be resolved by contacting us directly.</p>
            <p><strong>3.4</strong> Customer can cancel subscription any time on Creators' page by clicking Unsubscribe button. If there are any issues, customer should contact us first via email/social media. Customer agrees not to open dispute with Credit Card Company before making efforts to contact us to solve any issues/refund requests. We usually reply within 1 business day.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">4. Warning: Adult-Oriented Content</h3>
          <p className="mb-[16px]">
            The Website may have sexually explicit material that is unsuitable for minors. Only individuals (1) who are at least 18-years old and (2) who have reached the age of majority where they live may access the Website. If you do not meet these age requirements, you must not access the Website and must leave now. By accessing the Website, you state that the following facts are accurate:
          </p>
          <ul className="mb-[16px] list-none space-y-[12px] pl-0">
            {[
              'You are at least 18-years old, have reached the age of majority where you live, and you have the legal capacity to enter into this agreement.',
              'You are aware of the adult nature of the material available on the Website, and you are not offended by visual images, verbal descriptions, and audio sounds of a sexual nature, including graphic visual depictions and descriptions of nudity and sexual activity.',
              'You are familiar with your community\'s laws affecting your right to access adult-oriented materials.',
              'You have the legal right to access adult-oriented materials, and we have the legal right to transmit them to you.',
              'You are voluntarily requesting adult-oriented materials for your private enjoyment.',
              'You are not accessing the Website from a place, country, or location in which doing so would, or could be considered a violation of applicable law.',
              'You will not share the Website with a minor or otherwise make it available to a minor.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-[12px]">
                <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mb-[32px]">
            Any adult material needs to be marked as 18+ when posting. What constitutes nudity: genitals, fully exposed buttocks and female breasts if they include the nipple except if the women are breastfeeding or showing post-mastectomy scars. If the material is marked as 18+ and it is not, it may be refunded back to customer without warning and such post removed. Falsely marking posts as 18+, may lead to suspension of Creators' account.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">5. Content You Submit</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>5.1 User Content.</strong> This Section governs any material that you post, send or transmit (collectively, "Post") through the Service, including, by way of example and not limitation, photographs, graphics, images, text, musical works, sound recordings, digital phone record deliveries, and any other content, materials or works subject to protection under the laws of the United States or any other jurisdiction, including, but not limited to, patent, trademark, trade secret, and copyright laws (collectively, "User Content"). You are solely responsible for securing the rights to any and all User Content You Post to or through the Service.</p>
            <p><strong>5.2 License Grants to Fansbook and other Users.</strong> BY POSTING USER CONTENT TO OR THROUGH THE SERVICE, YOU HEREBY GRANT TO FANSBOOK AN UNRESTRICTED, PERPETUAL, ASSIGNABLE, SUBLICENSABLE, REVOCABLE, ROYALTY-FREE, FULLY PAID UP LICENSE THROUGHOUT THE WORLD TO REPRODUCE, MODIFY, DISTRIBUTE, DISPLAY, PUBLISH, TRANSMIT, COMMUNICATE TO THE PUBLIC, MAKE AVAILABLE, BROADCAST, CREATE DERIVATIVE WORKS FROM, PUBLICLY PERFORM (INCLUDING ON A THROUGH-TO-THE AUDIENCE BASIS), DELIVER AND PUBLICLY PERFORM DIGITAL PHONE RECORDS, AND OTHERWISE USE AND EXPLOIT (COLLECTIVELY, "USE") ALL USER CONTENT YOU POST TO OR THROUGH THE SERVICE.</p>
            <p><strong>5.3 License for Name, Image, Voice, and Likeness.</strong> You further hereby grant Fansbook a royalty-free license to Use your name, image, voice, trademarks, logos, monikers, and likeness (and that of any person identifiable in any User Content you posted to or through the Service) made available by or on your behalf through the Service in conjunction with your User Content. The foregoing license in the immediately preceding sentence will survive the termination of your account with respect to any of your User Content Posted to the Service prior to such termination.</p>
            <p><strong>5.4 Limited Waiver of Rights.</strong> You waive any and all rights of privacy, rights of publicity, or any other rights of a similar nature in connection with your User Content, or any portion thereof. To the extent any moral rights are not transferable or assignable, you hereby waive and agree never to assert any and all moral rights, or to support, maintain or permit any action based on any moral rights that you may have in or with respect to any of your User Content Posted to the Service, during the term of this agreement.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">6. Use Restrictions</h3>
          <p className="mb-[16px]">Your rights to use the Service and the Fansbook Content are expressly conditioned on the following:</p>
          <ul className="mb-[32px] list-none space-y-[12px] pl-0">
            {[
              'You may access the Service for your personal entertainment purposes only solely as intended through the provided functionality of the Service and as permitted under this agreement.',
              'You agree not to copy, reproduce, distribute, publish, display, perform, transmit, stream or broadcast any part of the Service or Fansbook Content without Fansbook\'s prior written authorization.',
              'You agree not to bypass, circumvent, damage or otherwise interfere with any security or other features of the Service designed to control the manner in which the Service is used, harvest or mine Fansbook Content from the Service, or otherwise access or use the Service in a manner inconsistent with individual human usage.',
              'You agree not to use, display, mirror, frame or utilize framing techniques to enclose the Service or the Fansbook Content, or any portion thereof, through any other application or website.',
              'You agree that you cannot offer sexual services and dates on the site.',
              'You agree that you cannot advertise other platforms. Only use your social media links in your profile settings. Any Creators advertising their own channels will be banned.',
              'You agree that creators selling their services outside of Fansbook while using the services will be banned.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-[12px]">
                <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-[16px] text-[24px] font-medium">7. Indemnity</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>7.1</strong> You agree to indemnify and hold Fansbook, and its officers, directors, employees, agents, successors, and assigns harmless from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected to (a) your access, use, or misuse of the Service, or Fansbook Content; (b) your User Content; or (c) your violation of this agreement.</p>
            <p><strong>7.2</strong> Fansbook will use reasonable efforts to notify you of any such claim, action or proceeding for which it seeks an indemnification from you upon becoming aware of it, but if Fansbook is unable to communicate with you in a timely manner because of an inactive e-mail address for you, your indemnification obligation will continue notwithstanding Fansbook's inability to contact you in a timely manner.</p>
            <p><strong>7.3</strong> Fansbook reserves the right to assume the exclusive defense and control of any matter that is subject to indemnification under this Section. In such case, you agree to cooperate with any reasonable requests to assist Fansbook's defense of such matter. You agree not to settle any matter without the prior express written consent of Fansbook.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">8. Refunds & Chargebacks</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>8.1</strong> If payment has a chargeback from the credit card company (customer refunds) money is returned back to the client and deducted from Creators' account. We reserve the right to remove any fraudulent charges from Creators' balance and refund back to credit card owner.</p>
            <p><strong>8.2</strong> If a User seeks a chargeback or dispute from their credit card company, the User's access to Fansbook may be discontinued or limited. If you believe your account has been limited in error, please contact support.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">9. Creators Obligations</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>9.1</strong> Creators need to submit valid Government-Issued ID card, clearly showing their picture and age. We may perform additional checks if necessary.</p>
            <p><strong>9.2</strong> We do not allow selling any services outside the scope of services offered by this platform, such as ecommerce items.</p>
          </div>
        </div>
      </div>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
