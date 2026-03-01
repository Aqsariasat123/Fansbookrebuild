import { useState } from 'react';
import { api } from '../../lib/api';

interface Props {
  receiverId: string;
  receiverName: string;
  onClose: () => void;
}

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

export function TipModal({ receiverId, receiverName, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    const tipAmount = Number(amount);
    if (!tipAmount || tipAmount < 1) {
      setError('Minimum tip is $1');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/tips', { receiverId, amount: tipAmount, message });
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : 'Failed to send tip';
      setError(msg || 'Failed to send tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[400px] rounded-[16px] bg-card p-[24px]">
        {success ? (
          <div className="text-center">
            <div className="text-[48px]">&#10004;</div>
            <p className="mt-[8px] text-[18px] font-medium text-foreground">Tip Sent!</p>
            <p className="mt-[4px] text-[14px] text-muted-foreground">
              You sent ${amount} to {receiverName}
            </p>
            <button
              onClick={onClose}
              className="mt-[20px] w-full rounded-[11px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[16px] font-medium text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-medium text-foreground">Send Tip to {receiverName}</p>
              <button onClick={onClose} className="text-[24px] text-muted-foreground">
                &times;
              </button>
            </div>

            <div className="mt-[20px] flex flex-wrap gap-[8px]">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`rounded-[8px] border px-[16px] py-[8px] text-[14px] font-medium transition-colors ${
                    amount === String(a)
                      ? 'border-[#01adf1] bg-[#01adf1]/10 text-[#01adf1]'
                      : 'border-border text-foreground hover:border-foreground'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            <div className="mt-[16px]">
              <label className="text-[14px] text-muted-foreground">Custom Amount</label>
              <div className="mt-[4px] flex items-center rounded-[8px] border border-border px-[12px]">
                <span className="text-[16px] text-muted-foreground">$</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent py-[10px] pl-[8px] text-[16px] text-foreground outline-none"
                />
              </div>
            </div>

            <div className="mt-[12px]">
              <label className="text-[14px] text-muted-foreground">Message (optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice..."
                maxLength={200}
                className="mt-[4px] w-full rounded-[8px] border border-border bg-transparent px-[12px] py-[10px] text-[14px] text-foreground outline-none"
              />
            </div>

            {error && <p className="mt-[8px] text-[13px] text-red-500">{error}</p>}

            <button
              onClick={handleSend}
              disabled={loading || !amount}
              className="mt-[20px] w-full rounded-[11px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : `Send $${amount || '0'} Tip`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
