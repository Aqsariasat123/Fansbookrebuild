export interface Recipient {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  referenceId: string | null;
  status: string;
  createdAt: string;
  recipient?: Recipient | null;
}

export interface TableProps {
  items: Transaction[];
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const date = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

const TYPE_LABEL: Record<string, string> = {
  TIP_SENT: 'Tip sent',
  TIP_RECEIVED: 'Tip received',
  SUBSCRIPTION: 'Subscription',
  PPV_PURCHASE: 'PPV unlock',
  PPV_EARNING: 'PPV earning',
  MARKETPLACE_PURCHASE: 'Marketplace',
  MARKETPLACE_EARNING: 'Marketplace sale',
  ESCROW_HOLD: 'Escrow held',
  ESCROW_RELEASE: 'Escrow released',
  ESCROW_REFUND: 'Refund',
  WITHDRAWAL: 'Withdrawal',
  DEPOSIT: 'Coins purchased',
  REFUND: 'Refund',
  BID_HOLD: 'Bid placed',
  BID_RELEASE: 'Bid returned',
  LIVE_AUCTION_WIN: 'Auction won',
  LIVE_AUCTION_FEE: 'Auction fee',
};

export function prettyType(t: string) {
  return (
    TYPE_LABEL[t] ??
    t
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase())
  );
}

export function Pagination({
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
          className={`h-[28px] w-[28px] rounded-[2px] border border-border flex items-center justify-center text-[10px] text-foreground ${p === page ? 'bg-muted-foreground' : ''}`}
        >
          {p}
        </button>
      ))}
      {totalPages > 6 && (
        <span className="h-[28px] w-[28px] rounded-[2px] border border-border flex items-center justify-center text-[10px] text-foreground">
          ...
        </span>
      )}
      {page < totalPages && (
        <button
          onClick={() => onPage(page + 1)}
          className="h-[38px] px-[10px] rounded-[4px] border border-border flex items-center justify-center text-[10px] text-foreground"
        >
          Next
        </button>
      )}
    </div>
  );
}
