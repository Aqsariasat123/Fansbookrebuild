export function StepAgreement({
  agreed,
  setAgreed,
}: {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Creator Agreement</p>
      <div className="max-h-[300px] overflow-y-auto rounded-[12px] bg-muted p-[16px] text-[13px] leading-relaxed text-muted-foreground">
        <p>By becoming a creator on Inscrio, you agree to the following terms:</p>
        <ul className="mt-[8px] list-disc space-y-[4px] pl-[20px]">
          <li>You must be at least 18 years old.</li>
          <li>You are responsible for all content you post.</li>
          <li>Inscrio takes a platform commission on earnings.</li>
          <li>You must comply with all applicable laws and regulations.</li>
          <li>You agree to our content guidelines and community standards.</li>
          <li>Your identity will be verified before your account is activated.</li>
        </ul>
      </div>
      <label className="flex cursor-pointer items-center gap-[10px]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="size-[18px] accent-[#01adf1]"
        />
        <span className="text-[14px] text-foreground">
          I agree to the Creator{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#01adf1] underline hover:opacity-80"
          >
            Terms and Conditions
          </a>
        </span>
      </label>
    </div>
  );
}

export function StepVerification({ verificationStatus }: { verificationStatus?: string }) {
  const status = verificationStatus ?? 'UNVERIFIED';
  const isVerified = status === 'APPROVED';
  const isPending = status === 'PENDING' || status === 'MANUAL_REVIEW';

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Identity Verification</p>
      <p className="text-[13px] text-muted-foreground">
        Identity verification is handled by our secure ID partner. You'll be redirected to a guided
        flow that captures your government ID and a quick selfie.
      </p>

      {isVerified && (
        <div className="rounded-[12px] border border-green-500/30 bg-green-500/10 p-[14px] text-[13px] text-green-400">
          ✓ Identity verified — you're good to continue.
        </div>
      )}

      {isPending && (
        <div className="rounded-[12px] border border-yellow-500/30 bg-yellow-500/10 p-[14px] text-[13px] text-yellow-400">
          Your verification is being reviewed. This usually takes a few minutes — you can continue
          and we'll activate your account once approved.
        </div>
      )}

      {!isVerified && !isPending && (
        <a
          href="/verify-identity"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-center text-[14px] font-medium text-white hover:opacity-90"
        >
          Start Identity Verification
        </a>
      )}

      {!isVerified && !isPending && (
        <p className="text-[12px] text-muted-foreground">
          After completing the flow, return to this page and tap Next.
        </p>
      )}
    </div>
  );
}

export function StepBank({
  bank,
  setBank,
}: {
  bank: { country: string; bankName: string; accountNumber: string; routing: string };
  setBank: (b: typeof bank) => void;
}) {
  const update = (field: string, value: string) => setBank({ ...bank, [field]: value });
  const fields = [
    { key: 'country', label: 'Country', placeholder: 'e.g. United States' },
    { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. Chase Bank' },
    { key: 'accountNumber', label: 'Account Number', placeholder: 'Account number' },
    { key: 'routing', label: 'Routing / SWIFT', placeholder: 'Routing number' },
  ];
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Bank Details</p>
      <p className="text-[13px] text-muted-foreground">
        Your earnings will be deposited to this account.
      </p>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-[13px] text-muted-foreground">{f.label}</label>
          <input
            value={bank[f.key as keyof typeof bank]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
          />
        </div>
      ))}
    </div>
  );
}
