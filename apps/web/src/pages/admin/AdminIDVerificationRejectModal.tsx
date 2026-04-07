import { useState } from 'react';

export function RejectModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[400px] rounded-[14px] bg-white border border-gray-200 p-[24px] shadow-xl">
        <h3 className="text-[16px] font-bold text-gray-900 mb-[12px]">Rejection Reason</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Explain why this verification was rejected..."
          className="w-full rounded-[8px] border border-gray-300 bg-gray-50 px-[12px] py-[10px] text-[13px] text-gray-900 outline-none focus:border-red-400 resize-none"
        />
        <div className="mt-[16px] flex gap-[10px] justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-gray-300 px-[18px] py-[8px] text-[13px] text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              setReason('');
            }}
            className="rounded-full bg-red-600 px-[18px] py-[8px] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
