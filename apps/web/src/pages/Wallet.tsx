import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { PurchaseModal } from '../components/wallet/PurchaseModal';
import { PurchaseTable, SpendingTable } from '../components/wallet/WalletTables';

const IMG = '/icons/dashboard';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [tab, setTab] = useState<'purchases' | 'spending'>('purchases');
  const [purchases, setPurchases] = useState<
    {
      id: string;
      type: string;
      amount: number;
      description: string | null;
      referenceId: string | null;
      status: string;
      createdAt: string;
    }[]
  >([]);
  const [spending, setSpending] = useState<typeof purchases>([]);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [spendingTotal, setSpendingTotal] = useState(0);
  const [purchasePage, setPurchasePage] = useState(1);
  const [spendingPage, setSpendingPage] = useState(1);
  const [showPurchase, setShowPurchase] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const limit = 10;

  useEffect(() => {
    api
      .get('/wallet/balance')
      .then(({ data: r }) => {
        if (r.success) setBalance(r.data.balance);
      })
      .catch(() => {});
  }, [refreshKey]);

  useEffect(() => {
    api
      .get('/wallet/purchases', { params: { page: purchasePage, limit } })
      .then(({ data: r }) => {
        if (r.success) {
          setPurchases(r.data.items);
          setPurchaseTotal(r.data.total);
        }
      })
      .catch(() => {});
  }, [purchasePage, refreshKey]);

  useEffect(() => {
    api
      .get('/wallet/spending', { params: { page: spendingPage, limit } })
      .then(({ data: r }) => {
        if (r.success) {
          setSpending(r.data.items);
          setSpendingTotal(r.data.total);
        }
      })
      .catch(() => {});
  }, [spendingPage, refreshKey]);

  const handlePurchaseSuccess = useCallback((newBalance: number) => {
    setBalance(newBalance);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-foreground">My Wallet</p>

      {/* Balance card */}
      <div className="flex flex-col gap-[10px] rounded-[22px] bg-card/55 px-[20px] py-[20px] md:flex-row md:items-center md:gap-[40px] md:px-[48px] md:py-[36px]">
        <img
          src={`${IMG}/wallet-card.svg`}
          alt=""
          className="hidden size-[70px] shrink-0 md:block"
        />
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-baseline gap-[10px]">
            <p className="text-[18px] font-medium text-foreground md:text-[24px]">Total Coins |</p>
            <p className="text-[32px] font-semibold text-foreground md:text-[48px]">{balance}</p>
          </div>
          <p className="max-w-[700px] text-[12px] text-foreground md:text-[16px]">
            Coins can be used for tipping models, joining live broadcasts, one-on-one video calls,
            and accessing upcoming features as they&apos;re released
          </p>
        </div>
      </div>

      {/* Purchase button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPurchase(true)}
          className="w-full rounded-[12px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[40px] py-[14px] text-[16px] font-semibold text-foreground transition-opacity hover:opacity-90 md:w-auto md:px-[127px] md:py-[16px] md:text-[20px]"
        >
          Purchase Coins
        </button>
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="flex gap-[20px] md:gap-[40px]">
          <button
            onClick={() => setTab('purchases')}
            className={`px-[4px] py-[8px] text-[14px] transition-colors md:px-[10px] md:py-[11px] md:text-[20px] ${tab === 'purchases' ? 'border-b border-[#01adf1] text-primary' : 'text-muted-foreground/84'}`}
          >
            Coins Purchase History
          </button>
          <button
            onClick={() => setTab('spending')}
            className={`px-[4px] py-[8px] text-[14px] transition-colors md:px-[10px] md:py-[11px] md:text-[20px] ${tab === 'spending' ? 'border-b border-[#01adf1] text-primary' : 'text-muted-foreground/84'}`}
          >
            Coin Spending History
          </button>
        </div>
        <div className="h-px w-full bg-muted-foreground" />
      </div>

      {/* Table */}
      {tab === 'purchases' ? (
        <PurchaseTable
          items={purchases}
          page={purchasePage}
          total={purchaseTotal}
          limit={limit}
          onPage={setPurchasePage}
        />
      ) : (
        <SpendingTable
          items={spending}
          page={spendingPage}
          total={spendingTotal}
          limit={limit}
          onPage={setSpendingPage}
        />
      )}

      {showPurchase && (
        <PurchaseModal onClose={() => setShowPurchase(false)} onSuccess={handlePurchaseSuccess} />
      )}
    </div>
  );
}
