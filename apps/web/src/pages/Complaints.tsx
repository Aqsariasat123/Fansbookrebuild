import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';

export default function Complaints() {
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
          <h1 className="text-center text-[32px] font-medium md:text-[48px]">Complaints Policy</h1>
          <p className="text-center text-[16px] font-normal md:text-[20px]">
            We value your feedback and are committed to resolving any concerns promptly.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#15191c] px-[20px] py-[40px] md:px-[76px] md:py-[80px] lg:px-[142px]">
        <div className="mx-auto max-w-[900px] text-[16px] leading-[1.8] text-[#f8f8f8]">
          <h2 className="mb-[24px] text-[36px] font-medium">COMPLAINTS POLICY</h2>

          <h3 className="mb-[16px] text-[24px] font-medium">1. Objective of the Policy</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>1.1</strong> Fansbook seeks to maintain and enhance our reputation of providing you with high quality services. We value complaints as they assist us to improve our services and customer service.</p>
            <p><strong>1.2</strong> Fansbook is committed to being responsive to the needs and concerns of our users or potential users and to resolving your complaint as quickly as possible.</p>
            <p><strong>1.3</strong> This policy has been designed to provide guidance to both our users and customer support on the manner in which Fansbook receives and manages your complaint. We are committed to being consistent, fair and impartial when handling your complaint.</p>
            <p><strong>1.4</strong> The objective of the policy is to ensure:</p>
            <ul className="list-none space-y-[12px] pl-0">
              {[
                'You are aware of our complaint lodgment and handling processes.',
                'Your complaint is investigated impartially with a balanced view of all information.',
                'Your complaint is considered on its merits taking into account individual circumstances and needs.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">2. Definition of a Complaint</h3>
          <p className="mb-[32px]">
            In this policy a complaint means an expression of dissatisfaction by a user relating to the services provided and the content available i.e. reporting illegal content or content that violates the Fansbook standards.
          </p>

          <h3 className="mb-[16px] text-[24px] font-medium">3. How a Complaint Is Made</h3>
          <p className="mb-[16px]">If you are dissatisfied with the service, you can lodge a complaint with us in the following ways:</p>
          <ul className="mb-[32px] list-none space-y-[12px] pl-0">
            {[
              'By completing a feedback form on our platform.',
              'By telephoning us.',
              'By emailing us.',
              'By writing to us.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-[12px]">
                <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-[16px] text-[24px] font-medium">4. The Information You Will Need to Tell Us</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>4.1</strong> When Fansbook is investigating your complaint, we will be relying on information provided by you and information we may already be holding. We may need to contact you to clarify details or request additional information where necessary.</p>
            <p><strong>4.2</strong> To help us investigate your complaint quickly and efficiently we will ask you for the following information:</p>
            <ul className="list-none space-y-[12px] pl-0">
              {[
                'Your name and contact details.',
                'The nature of the complaint.',
                'Details of any steps you have already taken to resolve the complaint.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-[12px]">
                  <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">5. Recording Complaints</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>5.1</strong> When taking a complaint, we will record your name and contact details. We will also record all details of your complaint including the facts and the cause/s of your complaint, the outcome and any actions taken following the investigation of your complaint. We will also record all dates and times relating to actions taken to resolve the complaint and communications between us.</p>
            <p><strong>5.2</strong> As part of our on-going improvement plan, complaints will be monitored for any identifying trends and rectification/remedial action taken to mitigate any identified issues.</p>
            <p><strong>5.4</strong> If you lodge a complaint we will record your personal information solely for the purposes of addressing your complaint. Your personal details will actively be protected from disclosure, unless you expressly consent to its disclosure.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">6. Feedback</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>6.1</strong> Fansbook is committed to resolving your issues at the first point of contact; however, this will not be possible in all circumstances, in which case a more formal complaints process will be followed.</p>
            <p><strong>6.2</strong> Fansbook will acknowledge receipt of your complaint within three (3) business days. Once your complaint has been received, we will undertake an initial review of your complaint.</p>
            <p><strong>6.3</strong> There may be circumstances during the initial review or investigation of your complaint where we may need to clarify certain aspects of your complaint or request additional documentation from you. In such circumstances we will explain the purpose of seeking clarification or additional documentation and provide you with feedback on the status of your complaint at that time.</p>
            <p><strong>6.4</strong> Fansbook is committed to resolving your complaint within 7 business days of you lodging your complaint, however, this may not always be possible on every occasion. Where we have been unable to resolve your complaint within 7 business days, we will inform you of the reason for the delay and specify a date when we will be in a position to finalize your complaint.</p>
            <p><strong>6.5</strong> During the initial review or investigation stage we may need to seek further clarification from you to assist us in resolving your complaint.</p>
            <p><strong>6.6</strong> If we have sought clarification from you and we are waiting on you to provide this information, we may not be able to meet our 7 business day finalization commitment. In such circumstances upon receipt of your clarification we will indicate to you when we expect to be able to finalize your complaint.</p>
            <p><strong>6.7</strong> Once we have finalized your complaint, we will advise you of our findings and any action we have taken. We will do this in writing, unless it has been mutually agreed that we can provide it to you verbally.</p>
            <p><strong>6.8</strong> You have the right to make enquiries about the current status of your complaint at any time by contacting us.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">7. Complaint Process</h3>
          <div className="mb-[32px] space-y-[20px]">
            {[
              { step: 'Acknowledge', num: '7.1', desc: 'Within three business days of receiving your complaint we will acknowledge receipt of your complaint.' },
              { step: 'Review', num: '7.2', desc: 'We undertake an initial review of your complaint and determine what if any additional information may be required to complete an investigation. We may need to contact you to clarify details or request additional information where necessary.' },
              { step: 'Investigate', num: '7.3', desc: 'Within 7 business days of receiving your compliant we will investigate your complaint objectively and impartially, by considering the information you have provided us, our actions in relation to your dealings with us and any other information which may be available, that could assist us in investigating your complaint.' },
              { step: 'Respond', num: '7.4', desc: 'Following our investigation we will notify you of our findings and any actions we may have taken in regards to your complaint.' },
              { step: 'Take Action', num: '7.5', desc: 'Where appropriate we amend our business practices or policies.' },
              { step: 'Record', num: '7.6', desc: 'We will record your complaint for continuous improvement process and monitoring through regular review, your personal information will be recorded in accordance with relevant privacy legislation.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-[16px]">
                <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#a61651] text-[14px] font-medium text-[#f8f8f8]">
                  {item.step.charAt(0)}
                </span>
                <div>
                  <p className="text-[18px] font-medium">{item.num} {item.step}</p>
                  <p className="mt-[4px] text-[#b4b4b4]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">8. Review</h3>
          <div className="mb-[32px] space-y-[16px]">
            <p><strong>8.1</strong> If, at the conclusion of the above process, you are dissatisfied with the response you have received, the original complaint along with the response will be passed to the management team who will ensure that there is a complete review of the complaint. This review will be undertaken by a person not previously involved.</p>
            <p><strong>8.2</strong> The management will communicate a detailed response, including any actions to be taken, to both the customer support and the user who made the complaint, within 7 working days.</p>
          </div>

          <h3 className="mb-[16px] text-[24px] font-medium">9. Outcome</h3>
          <p className="mb-[16px]">As a result of your complaint which will have undergone the above procedure, the following outcomes may occur:</p>
          <ul className="mb-[32px] list-none space-y-[12px] pl-0">
            {[
              'Pulling down of the illegal content and/or content that violates our standards.',
              'An apology from us.',
              'A change to our practices and procedures which you complained about.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-[12px]">
                <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
