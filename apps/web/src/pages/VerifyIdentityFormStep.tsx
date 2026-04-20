import { useState } from 'react';

export type VerifyStatus = 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'PENDING' | 'UNVERIFIED';

export interface FormState {
  firstName: string;
  lastName: string;
  dob: string;
}

export function FormStep({
  onSubmit,
  loading,
  error,
  pendingReview,
}: {
  onSubmit: (form: FormState) => void;
  loading: boolean;
  error: string;
  pendingReview?: boolean;
}) {
  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', dob: '' });
  const change = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-[20px]">
      {pendingReview ? (
        <div className="rounded-[8px] border border-yellow-500/30 bg-yellow-500/10 px-[14px] py-[10px] text-[13px] text-yellow-400">
          Your previous submission is still under review. We will email you when it&apos;s done. You
          can also restart with new documents below.
        </div>
      ) : (
        <p className="text-[14px] text-gray-400">
          To access all features on Inscrio, we need to verify your identity. This process is quick
          and secure, powered by Didit.
        </p>
      )}
      {error && (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-[14px] py-[10px] text-[13px] text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-[14px]">
        {(['firstName', 'lastName'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-gray-300 capitalize">
              {field === 'firstName' ? 'First Name' : 'Last Name'}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={change(field)}
              className="rounded-[10px] border border-gray-700 bg-gray-800 px-[14px] py-[10px] text-[14px] text-white outline-none focus:border-[#01adf1]"
              placeholder={field === 'firstName' ? 'John' : 'Doe'}
            />
          </div>
        ))}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-gray-300">Date of Birth</label>
          <input
            type="date"
            value={form.dob}
            onChange={change('dob')}
            className="rounded-[10px] border border-gray-700 bg-gray-800 px-[14px] py-[10px] text-[14px] text-white outline-none focus:border-[#01adf1]"
          />
        </div>
      </div>
      <button
        disabled={loading || !form.firstName || !form.lastName || !form.dob}
        onClick={() => onSubmit(form)}
        className="rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting…' : 'Start Verification'}
      </button>
    </div>
  );
}
