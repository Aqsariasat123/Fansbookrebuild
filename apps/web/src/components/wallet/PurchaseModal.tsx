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
          className="bg-card rounded-[22px] p-[40px] max-w-[440px] w-full mx-[20px] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[48px] mb-[16px]">🎉</div>
          <p className="text-[24px] font-semibold text-foreground mb-[8px]">Purchase Successful!</p>
          <p className="text-[16px] text-muted-foreground mb-[4px]">
            {success.coins} coins added to your wallet
          </p>
          <p className="text-[20px] font-medium text-primary mb-[24px]">
            New Balance: {success.balance} coins
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[12px] px-[40px] py-[14px] text-[16px] font-semibold text-foreground"
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
        className="bg-card rounded-[22px] p-[32px] max-w-[640px] w-full mx-[20px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] size-[36px] rounded-full bg-muted flex items-center justify-center hover:bg-[#2a2d30]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[24px] font-semibold text-foreground mb-[8px]">Purchase Coins</p>
        <p className="text-[14px] text-muted-foreground mb-[24px]">Select a coin package below</p>

        <div className="grid grid-cols-3 gap-[12px] mb-[24px]">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative flex flex-col items-center gap-[8px] rounded-[16px] border-2 p-[20px] transition-all ${
                selected === pkg.id
                  ? 'border-[#01adf1] bg-[#01adf1]/10'
                  : 'border-muted bg-muted hover:border-[#2a2d30]'
              }`}
            >
              {pkg.tag && (
                <span className="absolute -top-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[20px] px-[10px] py-[2px] text-[10px] font-semibold text-white">
                  {pkg.tag}
                </span>
              )}
              <p className="text-[28px] font-bold text-foreground">{pkg.coins.toLocaleString()}</p>
              <p className="text-[12px] text-muted-foreground">coins</p>
              <p className="text-[18px] font-semibold text-primary">€{pkg.price.toFixed(2)}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-[14px] text-center mb-[12px]">{error}</p>}

        <button
          onClick={handlePurchase}
          disabled={!selected || loading}
          className="w-full bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[12px] py-[16px] text-[18px] font-semibold text-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>

        <p className="text-[12px] text-muted-foreground text-center mt-[12px]">
          Payment gateway integration coming soon. Coins are added instantly for demo.
        </p>
      </div>
    </div>
  );
}
