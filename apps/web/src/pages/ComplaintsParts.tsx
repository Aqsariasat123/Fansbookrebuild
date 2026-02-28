export const COMPLAINT_STEPS = [
  {
    step: 'Acknowledge',
    num: '7.1',
    desc: 'Within three business days of receiving your complaint we will acknowledge receipt of your complaint.',
  },
  {
    step: 'Review',
    num: '7.2',
    desc: 'We undertake an initial review of your complaint and determine what if any additional information may be required to complete an investigation. We may need to contact you to clarify details or request additional information where necessary.',
  },
  {
    step: 'Investigate',
    num: '7.3',
    desc: 'Within 7 business days of receiving your compliant we will investigate your complaint objectively and impartially, by considering the information you have provided us, our actions in relation to your dealings with us and any other information which may be available, that could assist us in investigating your complaint.',
  },
  {
    step: 'Respond',
    num: '7.4',
    desc: 'Following our investigation we will notify you of our findings and any actions we may have taken in regards to your complaint.',
  },
  {
    step: 'Take Action',
    num: '7.5',
    desc: 'Where appropriate we amend our business practices or policies.',
  },
  {
    step: 'Record',
    num: '7.6',
    desc: 'We will record your complaint for continuous improvement process and monitoring through regular review, your personal information will be recorded in accordance with relevant privacy legislation.',
  },
];

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-[12px] pl-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-[12px]">
          <span className="mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FeedbackSection() {
  return (
    <div className="mb-[32px] space-y-[16px]">
      <p>
        <strong>6.1</strong> Fansbook is committed to resolving your issues at the first point of
        contact; however, this will not be possible in all circumstances, in which case a more
        formal complaints process will be followed.
      </p>
      <p>
        <strong>6.2</strong> Fansbook will acknowledge receipt of your complaint within three (3)
        business days. Once your complaint has been received, we will undertake an initial review of
        your complaint.
      </p>
      <p>
        <strong>6.3</strong> There may be circumstances during the initial review or investigation
        of your complaint where we may need to clarify certain aspects or request additional
        documentation. We will explain the purpose and provide feedback on the status of your
        complaint.
      </p>
      <p>
        <strong>6.4</strong> Fansbook is committed to resolving your complaint within 7 business
        days. Where we have been unable to do so, we will inform you of the reason for the delay and
        specify a date when we will finalize your complaint.
      </p>
      <p>
        <strong>6.5</strong> During the investigation stage we may need to seek further
        clarification from you to assist us in resolving your complaint.
      </p>
      <p>
        <strong>6.6</strong> If we are waiting on clarification from you, we may not meet our 7
        business day commitment. Upon receipt we will indicate when we expect to finalize.
      </p>
      <p>
        <strong>6.7</strong> Once finalized, we will advise you of our findings and any action
        taken, in writing unless mutually agreed otherwise.
      </p>
      <p>
        <strong>6.8</strong> You have the right to make enquiries about the current status of your
        complaint at any time by contacting us.
      </p>
    </div>
  );
}

export function StepsList() {
  return (
    <div className="mb-[32px] space-y-[20px]">
      {COMPLAINT_STEPS.map((item) => (
        <div key={item.step} className="flex items-start gap-[16px]">
          <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#a61651] text-[14px] font-medium text-foreground">
            {item.step.charAt(0)}
          </span>
          <div>
            <p className="text-[18px] font-medium">
              {item.num} {item.step}
            </p>
            <p className="mt-[4px] text-muted-foreground">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
