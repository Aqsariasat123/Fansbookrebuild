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

interface TableProps {
  items: Transaction[];
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export function PurchaseTable({ items, page, total, limit, onPage }: TableProps) {
  return (
    <>
      <div className="overflow-x-auto rounded-[22px]">
        <div className="min-w-[600px] overflow-hidden rounded-[22px] bg-card">
          <div className="grid grid-cols-5 bg-[#01adf1] px-[20px] py-[14px] md:px-[45px] md:py-[22px]">
            {[
              'Date',
              'No Of Coins Purchased',
              'Transaction ID',
              'Amount Paid',
              'Payment Status',
            ].map((h) => (
              <p
                key={h}
                className="text-center text-[12px] font-bold text-foreground md:text-[16px]"
              >
                {h}
              </p>
            ))}
          </div>
          {items.length === 0 ? (
            <p className="py-[40px] text-center text-muted-foreground">No purchase history</p>
          ) : (
            items.map((t, i) => {
              const parts = t.description?.split('|') || [];
              const amountPaid = parts[1] || `€${t.amount.toFixed(2)}`;
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-5 px-[20px] py-[14px] md:px-[45px] md:py-[20px] ${i < items.length - 1 ? 'border-b border-muted' : ''}`}
                >
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {formatDate(t.createdAt)}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {t.amount}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {t.referenceId || '-'}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {amountPaid}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {t.status === 'COMPLETED' ? 'Paid' : t.status}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={onPage} />
    </>
  );
}

export function SpendingTable({ items, page, total, limit, onPage }: TableProps) {
  return (
    <>
      <div className="overflow-x-auto rounded-[22px]">
        <div className="min-w-[500px] overflow-hidden rounded-[22px] bg-card">
          <div className="grid grid-cols-4 bg-[#01adf1] px-[20px] py-[14px] md:px-[45px] md:py-[22px]">
            {['Date', 'No Of Coins Spent', 'Modal Name', 'Spent Type'].map((h) => (
              <p
                key={h}
                className="text-center text-[12px] font-bold text-foreground md:text-[16px]"
              >
                {h}
              </p>
            ))}
          </div>
          {items.length === 0 ? (
            <p className="py-[40px] text-center text-muted-foreground">No spending history</p>
          ) : (
            items.map((t, i) => {
              const parts = t.description?.split('|') || [];
              const modelName = parts[0] || '-';
              const spentType = parts[1] || t.type;
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-4 px-[20px] py-[14px] md:px-[45px] md:py-[20px] ${i < items.length - 1 ? 'border-b border-muted' : ''}`}
                >
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {formatDate(t.createdAt)}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {t.amount}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {modelName}
                  </p>
                  <p className="text-center text-[12px] text-foreground md:text-[16px]">
                    {spentType}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={onPage} />
    </>
  );
}
