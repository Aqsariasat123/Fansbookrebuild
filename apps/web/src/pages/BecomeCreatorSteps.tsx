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
          I agree to the Creator Terms and Conditions
        </span>
      </label>
    </div>
  );
}

function FileInput({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  return (
    <div>
      <label className="text-[13px] text-muted-foreground">{label}</label>
      <div className="mt-[4px] flex items-center gap-[12px]">
        <label className="cursor-pointer rounded-[50px] bg-muted px-[16px] py-[8px] text-[13px] text-foreground hover:bg-muted/80">
          Choose File
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        <span className="text-[12px] text-muted-foreground">
          {file ? file.name : 'No file selected'}
        </span>
      </div>
    </div>
  );
}

export function StepVerification({
  idDoc,
  setIdDoc,
  selfie,
  setSelfie,
}: {
  idDoc: File | null;
  setIdDoc: (f: File | null) => void;
  selfie: File | null;
  setSelfie: (f: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">ID Verification</p>
      <p className="text-[13px] text-muted-foreground">
        Upload a clear photo of your government-issued ID and a selfie.
      </p>
      <FileInput label="Government ID" file={idDoc} onFile={setIdDoc} />
      <FileInput label="Selfie" file={selfie} onFile={setSelfie} />
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
