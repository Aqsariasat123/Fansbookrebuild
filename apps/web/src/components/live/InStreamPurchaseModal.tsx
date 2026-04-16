import { useState } from 'react';
import { api } from '../../lib/api';

export interface PinnedItem {
  id: string;
  title: string;
  price: number | null;
  image: string | null;
}

interface Props {
  item: PinnedItem;
  onClose: () => void;
}

export function InStreamPurchaseModal({ item, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/marketplace/${item.id}/buy`);
      if (data.success) {
        setDone(true);
      } else {
        setError(data.error ?? 'Purchase failed');
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err.response?.data?.error ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-[100px] px-[16px]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[360px] rounded-[16px] border border-gray-700 bg-[#1a1a1a] p-[20px] shadow-2xl">
        <div className="flex items-start gap-[12px] mb-[16px]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-[64px] w-[64px] rounded-[8px] object-cover shrink-0"
            />
          ) : (
            <div className="h-[64px] w-[64px] rounded-[8px] bg-gray-700 shrink-0 flex items-center justify-center">
              <span className="material-icons-outlined text-gray-500 text-[24px]">image</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white truncate">{item.title}</p>
            <p className="text-[18px] font-bold text-[#01adf1] mt-[2px]">
              ${item.price?.toFixed(2) ?? '0.00'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white shrink-0">
            <span className="material-icons-outlined text-[20px]">close</span>
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-[8px] py-[12px]">
            <span className="material-icons-outlined text-green-400 text-[40px]">check_circle</span>
            <p className="text-[14px] font-semibold text-white">Purchase Successful!</p>
            <p className="text-[12px] text-gray-400">Check your purchases in your profile.</p>
            <button
              onClick={onClose}
              className="mt-[8px] rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-[12px] text-gray-400 mb-[12px]">
              Payment will be deducted from your wallet balance.
            </p>
            {error && <p className="text-[12px] text-red-400 mb-[10px]">{error}</p>}
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full rounded-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[14px] font-semibold text-white disabled:opacity-50"
            >
              {loading ? 'Processing…' : `Buy Now — $${item.price?.toFixed(2) ?? '0.00'}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
