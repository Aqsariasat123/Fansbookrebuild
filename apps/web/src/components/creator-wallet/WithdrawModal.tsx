import { useState } from 'react';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number, method: string) => Promise<void>;
}

export function WithdrawModal({ onClose, onWithdraw }: WithdrawModalProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onWithdraw(amount, paymentMethod);
    } catch {
      setError('Withdrawal request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-[16px] w-full max-w-[420px] rounded-[22px] bg-[#0e1012] p-[24px]">
        <div className="mb-[20px] flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#f8f8f8]">Request Withdrawal</h2>
          <button
            onClick={() => {
              onClose();
              setError('');
            }}
            className="text-[24px] leading-none text-[#5d5d5d] hover:text-[#f8f8f8]"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div>
            <label className="mb-[6px] block text-[13px] text-[#5d5d5d]">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-[12px] bg-[#15191c] px-[14px] py-[10px] text-[14px] text-[#f8f8f8] outline-none placeholder:text-[#5d5d5d] focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="mb-[6px] block text-[13px] text-[#5d5d5d]">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full appearance-none rounded-[12px] bg-[#15191c] px-[14px] py-[10px] text-[14px] text-[#f8f8f8] outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-[4px] rounded-[12px] bg-gradient-to-r from-purple-600 to-pink-500 py-[12px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Request Withdrawal'}
          </button>
        </div>
      </div>
    </div>
  );
}
