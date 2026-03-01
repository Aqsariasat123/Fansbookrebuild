import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

type Step = 1 | 2 | 3;

export default function BecomeCreator() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<Step>(1);
  const [agreed, setAgreed] = useState(false);
  const [idDoc, setIdDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [bank, setBank] = useState({ country: '', bankName: '', accountNumber: '', routing: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('agreement', 'true');
      if (idDoc) fd.append('idDocument', idDoc);
      if (selfie) fd.append('selfie', selfie);
      fd.append('bankCountry', bank.country);
      fd.append('bankName', bank.bankName);
      fd.append('accountNumber', bank.accountNumber);
      fd.append('routing', bank.routing);
      const res = await api.post('/auth/become-creator', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.data) setUser(res.data.data);
      navigate('/creator/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="flex flex-col gap-[20px]">
        <p className="text-[24px] font-semibold text-foreground">Become a Creator</p>

        {/* Progress bar */}
        <div className="flex gap-[4px]">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-[4px] flex-1 rounded-full ${step >= s ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651]' : 'bg-muted'}`}
            />
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground">Step {step} of 3</p>

        <div className="rounded-[22px] bg-card p-[20px]">
          {step === 1 && <StepAgreement agreed={agreed} setAgreed={setAgreed} />}
          {step === 2 && (
            <StepVerification
              idDoc={idDoc}
              setIdDoc={setIdDoc}
              selfie={selfie}
              setSelfie={setSelfie}
            />
          )}
          {step === 3 && <StepBank bank={bank} setBank={setBank} />}
        </div>

        {error && <p className="text-[13px] text-red-400">{error}</p>}

        <div className="flex gap-[12px]">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-foreground"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 && !agreed}
              className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepAgreement({
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
        <p>By becoming a creator on Fansbook, you agree to the following terms:</p>
        <ul className="mt-[8px] list-disc space-y-[4px] pl-[20px]">
          <li>You must be at least 18 years old.</li>
          <li>You are responsible for all content you post.</li>
          <li>Fansbook takes a platform commission on earnings.</li>
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

function StepVerification({
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

function StepBank({
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
