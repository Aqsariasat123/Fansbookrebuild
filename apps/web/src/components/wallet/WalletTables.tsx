import { Link } from 'react-router-dom';
import { Pagination, formatDateTime, prettyType, type TableProps } from './walletShared';

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
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {formatDateTime(t.createdAt)}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {t.amount}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {t.referenceId || '-'}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {amountPaid}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
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
        <div className="min-w-[560px] overflow-hidden rounded-[22px] bg-card">
          <div className="grid grid-cols-4 bg-[#01adf1] px-[20px] py-[14px] md:px-[45px] md:py-[22px]">
            {['Date & Time', 'Coins Spent', 'Recipient', 'Type'].map((h) => (
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
            // eslint-disable-next-line complexity -- spending row renderer with several optional cells
            items.map((t, i) => {
              const parts = t.description?.split('|') || [];
              const fallbackModel = parts[0] || t.description || '-';
              const recipient = t.recipient ?? null;
              const post = t.post ?? null;
              // Trim the post text down to a short, readable title — the
              // raw text can be a long paragraph with hashtags.
              const postTitle = post
                ? (post.text || '').trim().split(/\n+/)[0].slice(0, 60) || 'View post'
                : null;
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-4 px-[20px] py-[14px] md:px-[45px] md:py-[20px] ${i < items.length - 1 ? 'border-b border-muted' : ''}`}
                >
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {formatDateTime(t.createdAt)}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {t.amount}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {recipient ? (
                      <Link
                        to={`/u/${recipient.username}`}
                        className="text-[#01adf1] hover:underline"
                      >
                        {recipient.displayName || `@${recipient.username}`}
                      </Link>
                    ) : post && postTitle ? (
                      <Link to={`/post/${post.id}`} className="text-[#01adf1] hover:underline">
                        {postTitle}
                      </Link>
                    ) : (
                      fallbackModel
                    )}
                  </p>
                  <p className="truncate text-center text-[12px] text-foreground md:text-[16px]">
                    {prettyType(t.type)}
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
