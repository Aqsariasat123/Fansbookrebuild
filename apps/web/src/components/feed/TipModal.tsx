import { useState } from 'react';
import { api } from '../../lib/api';

interface TipModalProps {
  postId: string;
  creatorName: string;
  onClose: () => void;
}

const AMOUNTS = [5, 10, 25, 50, 100];

export function TipModal({ postId, creatorName, onClose }: TipModalProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSend = async () => {
    const val = Number(amount);
    if (!val || val < 1) {
      setMsg('Enter a valid amount');
      return;
    }
    setSending(true);
    try {
      await api.post(`/posts/${postId}/tip`, { amount: val });
      setMsg('Tip sent!');
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setMsg(e.response?.data?.error || 'Failed to send tip');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-[340px] rounded-[16px] bg-[#0e1012] p-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[16px] text-[#f8f8f8]">Send Tip to {creatorName}</p>
        <div className="mt-4 flex flex-wrap gap-[8px]">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-[50px] px-4 py-[6px] text-[14px] ${
                amount === a
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-[#15191c] text-[#5d5d5d] hover:text-[#f8f8f8]'
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
          className="mt-3 w-full rounded-[12px] bg-[#15191c] px-3 py-[10px] text-[14px] text-[#f8f8f8] outline-none"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={sending || !amount}
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] text-white disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Tip'}
          </button>
          <button onClick={onClose} className="text-[14px] text-[#5d5d5d]">
            Cancel
          </button>
        </div>
        {msg && <p className="mt-2 text-[12px] text-[#01adf1]">{msg}</p>}
      </div>
    </div>
  );
}
