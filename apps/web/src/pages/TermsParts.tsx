const bullet =
  'mt-[8px] h-[10px] w-[10px] shrink-0 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]';

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-[32px] list-none space-y-[12px] pl-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-[12px]">
          <span className={bullet} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TermsSections() {
  return (
    <>
      <h3 className="mb-[16px] text-[24px] font-medium">4. Warning: Adult-Oriented Content</h3>
      <p className="mb-[16px]">
        The Website may have sexually explicit material that is unsuitable for minors. Only
        individuals (1) who are at least 18-years old and (2) who have reached the age of majority
        where they live may access the Website. If you do not meet these age requirements, you must
        not access the Website and must leave now. By accessing the Website, you state that the
        following facts are accurate:
      </p>
      <BulletList
        items={[
          'You are at least 18-years old, have reached the age of majority where you live, and you have the legal capacity to enter into this agreement.',
          'You are aware of the adult nature of the material available on the Website, and you are not offended by visual images, verbal descriptions, and audio sounds of a sexual nature, including graphic visual depictions and descriptions of nudity and sexual activity.',
          "You are familiar with your community's laws affecting your right to access adult-oriented materials.",
          'You have the legal right to access adult-oriented materials, and we have the legal right to transmit them to you.',
          'You are voluntarily requesting adult-oriented materials for your private enjoyment.',
          'You are not accessing the Website from a place, country, or location in which doing so would, or could be considered a violation of applicable law.',
          'You will not share the Website with a minor or otherwise make it available to a minor.',
        ]}
      />
      <p className="mb-[32px]">
        Any adult material needs to be marked as 18+ when posting. What constitutes nudity:
        genitals, fully exposed buttocks and female breasts if they include the nipple except if the
        women are breastfeeding or showing post-mastectomy scars. If the material is marked as 18+
        and it is not, it may be refunded back to customer without warning and such post removed.
        Falsely marking posts as 18+, may lead to suspension of Creators&apos; account.
      </p>

      <h3 className="mb-[16px] text-[24px] font-medium">5. Content You Submit</h3>
      <div className="mb-[32px] space-y-[16px]">
        <p>
          <strong>5.1 User Content.</strong> This Section governs any material that you post, send
          or transmit (collectively, &quot;Post&quot;) through the Service, including, by way of
          example and not limitation, photographs, graphics, images, text, musical works, sound
          recordings, digital phone record deliveries, and any other content, materials or works
          subject to protection under the laws of the United States or any other jurisdiction,
          including, but not limited to, patent, trademark, trade secret, and copyright laws
          (collectively, &quot;User Content&quot;). You are solely responsible for securing the
          rights to any and all User Content You Post to or through the Service.
        </p>
        <p>
          <strong>5.2 License Grants to Fansbook and other Users.</strong> BY POSTING USER CONTENT
          TO OR THROUGH THE SERVICE, YOU HEREBY GRANT TO FANSBOOK AN UNRESTRICTED, PERPETUAL,
          ASSIGNABLE, SUBLICENSABLE, REVOCABLE, ROYALTY-FREE, FULLY PAID UP LICENSE THROUGHOUT THE
          WORLD TO REPRODUCE, MODIFY, DISTRIBUTE, DISPLAY, PUBLISH, TRANSMIT, COMMUNICATE TO THE
          PUBLIC, MAKE AVAILABLE, BROADCAST, CREATE DERIVATIVE WORKS FROM, PUBLICLY PERFORM
          (INCLUDING ON A THROUGH-TO-THE AUDIENCE BASIS), DELIVER AND PUBLICLY PERFORM DIGITAL PHONE
          RECORDS, AND OTHERWISE USE AND EXPLOIT (COLLECTIVELY, &quot;USE&quot;) ALL USER CONTENT
          YOU POST TO OR THROUGH THE SERVICE.
        </p>
        <p>
          <strong>5.3 License for Name, Image, Voice, and Likeness.</strong> You further hereby
          grant Fansbook a royalty-free license to Use your name, image, voice, trademarks, logos,
          monikers, and likeness (and that of any person identifiable in any User Content you posted
          to or through the Service) made available by or on your behalf through the Service in
          conjunction with your User Content. The foregoing license in the immediately preceding
          sentence will survive the termination of your account with respect to any of your User
          Content Posted to the Service prior to such termination.
        </p>
        <p>
          <strong>5.4 Limited Waiver of Rights.</strong> You waive any and all rights of privacy,
          rights of publicity, or any other rights of a similar nature in connection with your User
          Content, or any portion thereof. To the extent any moral rights are not transferable or
          assignable, you hereby waive and agree never to assert any and all moral rights, or to
          support, maintain or permit any action based on any moral rights that you may have in or
          with respect to any of your User Content Posted to the Service, during the term of this
          agreement.
        </p>
      </div>

      <h3 className="mb-[16px] text-[24px] font-medium">6. Use Restrictions</h3>
      <p className="mb-[16px]">
        Your rights to use the Service and the Fansbook Content are expressly conditioned on the
        following:
      </p>
      <BulletList
        items={[
          'You may access the Service for your personal entertainment purposes only solely as intended through the provided functionality of the Service and as permitted under this agreement.',
          "You agree not to copy, reproduce, distribute, publish, display, perform, transmit, stream or broadcast any part of the Service or Fansbook Content without Fansbook's prior written authorization.",
          'You agree not to bypass, circumvent, damage or otherwise interfere with any security or other features of the Service designed to control the manner in which the Service is used, harvest or mine Fansbook Content from the Service, or otherwise access or use the Service in a manner inconsistent with individual human usage.',
          'You agree not to use, display, mirror, frame or utilize framing techniques to enclose the Service or the Fansbook Content, or any portion thereof, through any other application or website.',
          'You agree that you cannot offer sexual services and dates on the site.',
          'You agree that you cannot advertise other platforms. Only use your social media links in your profile settings. Any Creators advertising their own channels will be banned.',
          'You agree that creators selling their services outside of Fansbook while using the services will be banned.',
        ]}
      />

      <h3 className="mb-[16px] text-[24px] font-medium">7. Indemnity</h3>
      <div className="mb-[32px] space-y-[16px]">
        <p>
          <strong>7.1</strong> You agree to indemnify and hold Fansbook, and its officers,
          directors, employees, agents, successors, and assigns harmless from and against any
          claims, liabilities, damages, losses, and expenses, including, without limitation,
          reasonable legal and accounting fees, arising out of or in any way connected to (a) your
          access, use, or misuse of the Service, or Fansbook Content; (b) your User Content; or (c)
          your violation of this agreement.
        </p>
        <p>
          <strong>7.2</strong> Fansbook will use reasonable efforts to notify you of any such claim,
          action or proceeding for which it seeks an indemnification from you upon becoming aware of
          it, but if Fansbook is unable to communicate with you in a timely manner because of an
          inactive e-mail address for you, your indemnification obligation will continue
          notwithstanding Fansbook&apos;s inability to contact you in a timely manner.
        </p>
        <p>
          <strong>7.3</strong> Fansbook reserves the right to assume the exclusive defense and
          control of any matter that is subject to indemnification under this Section. In such case,
          you agree to cooperate with any reasonable requests to assist Fansbook&apos;s defense of
          such matter. You agree not to settle any matter without the prior express written consent
          of Fansbook.
        </p>
      </div>

      <h3 className="mb-[16px] text-[24px] font-medium">8. Refunds & Chargebacks</h3>
      <div className="mb-[32px] space-y-[16px]">
        <p>
          <strong>8.1</strong> If payment has a chargeback from the credit card company (customer
          refunds) money is returned back to the client and deducted from Creators&apos; account. We
          reserve the right to remove any fraudulent charges from Creators&apos; balance and refund
          back to credit card owner.
        </p>
        <p>
          <strong>8.2</strong> If a User seeks a chargeback or dispute from their credit card
          company, the User&apos;s access to Fansbook may be discontinued or limited. If you believe
          your account has been limited in error, please contact support.
        </p>
      </div>

      <h3 className="mb-[16px] text-[24px] font-medium">9. Creators Obligations</h3>
      <div className="mb-[32px] space-y-[16px]">
        <p>
          <strong>9.1</strong> Creators need to submit valid Government-Issued ID card, clearly
          showing their picture and age. We may perform additional checks if necessary.
        </p>
        <p>
          <strong>9.2</strong> We do not allow selling any services outside the scope of services
          offered by this platform, such as ecommerce items.
        </p>
      </div>
    </>
  );
}
