import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  currency: string;
  label: string;
  tag?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: (balance: number) => void;
}

export function PurchaseModal({ onClose, onSuccess }: Props) {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ coins: number; balance: number } | null>(null);

  useEffect(() => {
    api
      .get('/wallet/packages')
      .then(({ data: r }) => {
        if (r.success) setPackages(r.data);
      })
      .catch(() => {});
  }, []);

  async function handlePurchase() {
    if (!selected || loading) return;
    setLoading(true);
    setError('');
    try {
      const { data: r } = await api.post('/wallet/purchase', { packageId: selected });
      if (r.success) {
        setSuccess({ coins: r.data.coins, balance: r.data.balance });
        onSuccess(r.data.balance);
      }
    } catch {
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-[#0e1012] rounded-[22px] p-[40px] max-w-[440px] w-full mx-[20px] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[48px] mb-[16px]">🎉</div>
          <p className="text-[24px] font-semibold text-[#f8f8f8] mb-[8px]">Purchase Successful!</p>
          <p className="text-[16px] text-[#5d5d5d] mb-[4px]">
            {success.coins} coins added to your wallet
          </p>
          <p className="text-[20px] font-medium text-[#01adf1] mb-[24px]">
            New Balance: {success.balance} coins
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[12px] px-[40px] py-[14px] text-[16px] font-semibold text-[#f8f8f8]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#0e1012] rounded-[22px] p-[32px] max-w-[640px] w-full mx-[20px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] size-[36px] rounded-full bg-[#15191c] flex items-center justify-center hover:bg-[#2a2d30]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f8f8f8"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[24px] font-semibold text-[#f8f8f8] mb-[8px]">Purchase Coins</p>
        <p className="text-[14px] text-[#5d5d5d] mb-[24px]">Select a coin package below</p>

        <div className="grid grid-cols-3 gap-[12px] mb-[24px]">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative flex flex-col items-center gap-[8px] rounded-[16px] border-2 p-[20px] transition-all ${
                selected === pkg.id
                  ? 'border-[#01adf1] bg-[#01adf1]/10'
                  : 'border-[#15191c] bg-[#15191c] hover:border-[#2a2d30]'
              }`}
            >
              {pkg.tag && (
                <span className="absolute -top-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[20px] px-[10px] py-[2px] text-[10px] font-semibold text-white">
                  {pkg.tag}
                </span>
              )}
              <p className="text-[28px] font-bold text-[#f8f8f8]">{pkg.coins.toLocaleString()}</p>
              <p className="text-[12px] text-[#5d5d5d]">coins</p>
              <p className="text-[18px] font-semibold text-[#01adf1]">€{pkg.price.toFixed(2)}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-[14px] text-center mb-[12px]">{error}</p>}

        <button
          onClick={handlePurchase}
          disabled={!selected || loading}
          className="w-full bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[12px] py-[16px] text-[18px] font-semibold text-[#f8f8f8] hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>

        <p className="text-[12px] text-[#5d5d5d] text-center mt-[12px]">
          Payment gateway integration coming soon. Coins are added instantly for demo.
        </p>
      </div>
    </div>
  );
}
