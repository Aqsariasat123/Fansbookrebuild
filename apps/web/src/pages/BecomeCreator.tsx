import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { StepAgreement, StepVerification, StepBank } from './BecomeCreatorSteps';

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
