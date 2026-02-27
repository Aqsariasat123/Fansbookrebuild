import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { PurchaseModal } from '../components/wallet/PurchaseModal';

const IMG = '/icons/dashboard';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  referenceId: string | null;
  status: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-[6px] py-[24px]">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`h-[28px] w-[28px] rounded-[2px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8] ${p === page ? 'bg-[#5d5d5d]' : ''}`}
        >
          {p}
        </button>
      ))}
      {totalPages > 6 && (
        <span className="h-[28px] w-[28px] rounded-[2px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8]">
          ...
        </span>
      )}
      {page < totalPages && (
        <button
          onClick={() => onPage(page + 1)}
          className="h-[38px] px-[10px] rounded-[4px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8]"
        >
          Next
        </button>
      )}
    </div>
  );
}

function PurchaseTable({
  items,
  page,
  total,
  limit,
  onPage,
}: {
  items: Transaction[];
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  return (
    <>
      <div className="bg-[#0e1012] rounded-[22px] overflow-hidden">
        <div className="bg-[#01adf1] grid grid-cols-5 px-[45px] py-[22px]">
          {['Date', 'No Of Coins Purchased', 'Transaction ID', 'Amount Paid', 'Payment Status'].map(
            (h) => (
              <p key={h} className="text-[16px] font-bold text-[#f8f8f8] text-center">
                {h}
              </p>
            ),
          )}
        </div>
        {items.length === 0 ? (
          <p className="text-center text-[#5d5d5d] py-[40px]">No purchase history</p>
        ) : (
          items.map((t, i) => {
            const parts = t.description?.split('|') || [];
            const amountPaid = parts[1] || `€${t.amount.toFixed(2)}`;
            return (
              <div
                key={t.id}
                className={`grid grid-cols-5 px-[45px] py-[20px] ${i < items.length - 1 ? 'border-b border-[#15191c]' : ''}`}
              >
                <p className="text-[16px] text-[#f8f8f8] text-center">{formatDate(t.createdAt)}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{t.amount}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{t.referenceId || '-'}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{amountPaid}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">
                  {t.status === 'COMPLETED' ? 'Paid' : t.status}
                </p>
              </div>
            );
          })
        )}
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={onPage} />
    </>
  );
}

function SpendingTable({
  items,
  page,
  total,
  limit,
  onPage,
}: {
  items: Transaction[];
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  return (
    <>
      <div className="bg-[#0e1012] rounded-[22px] overflow-hidden">
        <div className="bg-[#01adf1] grid grid-cols-4 px-[45px] py-[22px]">
          {['Date', 'No Of Coins Spent', 'Modal Name', 'Spent Type'].map((h) => (
            <p key={h} className="text-[16px] font-bold text-[#f8f8f8] text-center">
              {h}
            </p>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="text-center text-[#5d5d5d] py-[40px]">No spending history</p>
        ) : (
          items.map((t, i) => {
            const parts = t.description?.split('|') || [];
            const modelName = parts[0] || '-';
            const spentType = parts[1] || t.type;
            return (
              <div
                key={t.id}
                className={`grid grid-cols-4 px-[45px] py-[20px] ${i < items.length - 1 ? 'border-b border-[#15191c]' : ''}`}
              >
                <p className="text-[16px] text-[#f8f8f8] text-center">{formatDate(t.createdAt)}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{t.amount}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{modelName}</p>
                <p className="text-[16px] text-[#f8f8f8] text-center">{spentType}</p>
              </div>
            );
          })
        )}
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={onPage} />
    </>
  );
}

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [tab, setTab] = useState<'purchases' | 'spending'>('purchases');
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [spending, setSpending] = useState<Transaction[]>([]);
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
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">My Wallet</p>

      {/* Balance card */}
      <div className="bg-[#0e1012]/55 rounded-[22px] flex items-center gap-[40px] px-[48px] py-[36px]">
        <img src={`${IMG}/wallet-card.svg`} alt="" className="size-[70px] shrink-0" />
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-baseline gap-[10px]">
            <p className="text-[24px] font-medium text-[#f8f8f8]">Total Coins |</p>
            <p className="text-[48px] font-semibold text-[#f8f8f8]">{balance}</p>
          </div>
          <p className="text-[16px] text-[#f8f8f8] max-w-[700px]">
            Coins can be used for tipping models, joining live broadcasts, one-on-one video calls,
            and accessing upcoming features as they&apos;re released
          </p>
        </div>
      </div>

      {/* Purchase button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPurchase(true)}
          className="bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[12px] px-[127px] py-[16px] text-[20px] font-semibold text-[#f8f8f8] hover:opacity-90 transition-opacity"
        >
          Purchase Coins
        </button>
      </div>

      {/* Tabs */}
      <div className="relative">
        <div className="flex gap-[40px]">
          <button
            onClick={() => setTab('purchases')}
            className={`px-[10px] py-[11px] text-[20px] transition-colors ${tab === 'purchases' ? 'text-[#01adf1] border-b border-[#01adf1]' : 'text-[#5d5d5d]/84'}`}
          >
            Coins Purchase History
          </button>
          <button
            onClick={() => setTab('spending')}
            className={`px-[10px] py-[11px] text-[20px] transition-colors ${tab === 'spending' ? 'text-[#01adf1] border-b border-[#01adf1]' : 'text-[#5d5d5d]/84'}`}
          >
            Coin Spending History
          </button>
        </div>
        <div className="h-px bg-[#5d5d5d] w-full" />
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
