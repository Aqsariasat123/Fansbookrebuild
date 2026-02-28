import { useState } from 'react';
import { api } from '../../lib/api';

interface ReportModalProps {
  userId: string;
  onClose: () => void;
}

const REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'NUDITY', label: 'Inappropriate Content' },
  { value: 'COPYRIGHT', label: 'Copyright Violation' },
  { value: 'OTHER', label: 'Other' },
];

export function ReportModal({ userId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await api.post(`/social/users/${userId}/report`, {
        reason,
        description: description || undefined,
      });
      setDone(true);
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-[400px] rounded-[22px] bg-[#0e1012] p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-[16px] text-[#f8f8f8]">Report Submitted</p>
            <p className="text-[14px] text-[#5d5d5d]">
              Thank you for your report. We will review it shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-6 py-2 text-[14px] text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="mb-[16px] text-[16px] text-[#f8f8f8]">Report User</p>
            <div className="flex flex-col gap-[10px]">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setReason(r.value)}
                  className={`rounded-[12px] p-[12px] text-left text-[14px] transition-colors ${
                    reason === r.value
                      ? 'bg-[#01adf1]/20 text-[#01adf1]'
                      : 'bg-[#15191c] text-[#f8f8f8]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-3 w-full rounded-[12px] bg-[#15191c] p-3 text-[14px] text-[#f8f8f8] outline-none"
              rows={3}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-[50px] bg-[#15191c] py-[10px] text-[14px] text-[#5d5d5d]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || submitting}
                className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] text-white disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
