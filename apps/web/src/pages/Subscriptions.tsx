import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { FilterDropdown } from '../components/shared/FilterDropdown';

interface Subscription {
  id: string;
  creatorName: string;
  creatorAvatar: string | null;
  amount: number;
  planName: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: string;
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

const STATUS_OPTIONS = ['All', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE'];
const TABLE_HEADERS = [
  'Subscription\nID',
  'Modal Name',
  'Subscription\nAmount',
  'Subscription\nStart Date',
  'Subscription End\nRenewal Date',
];

export default function Subscriptions() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const limit = 10;

  useEffect(() => {
    const params: Record<string, string | number> = { page, limit };
    if (statusFilter !== 'All') params.status = statusFilter;
    api
      .get('/subscriptions', { params })
      .then(({ data: r }) => {
        if (r.success) {
          setItems(r.data.items);
          setTotal(r.data.total);
        }
      })
      .catch(() => {});
  }, [page, statusFilter]);

  const displayed =
    paymentFilter === 'All' ? items : items.filter((s) => s.status === paymentFilter);

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-foreground">My Subscriptions</p>

      {/* Filters */}
      <div className="flex flex-col gap-[10px] md:flex-row md:gap-[20px]">
        <FilterDropdown
          label="Subscription Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          open={statusOpen}
          onToggle={() => {
            setStatusOpen(!statusOpen);
            setPaymentOpen(false);
          }}
          onSelect={(v) => {
            setStatusFilter(v);
            setStatusOpen(false);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Payment Status"
          value={paymentFilter}
          options={STATUS_OPTIONS}
          open={paymentOpen}
          onToggle={() => {
            setPaymentOpen(!paymentOpen);
            setStatusOpen(false);
          }}
          onSelect={(v) => {
            setPaymentFilter(v);
            setPaymentOpen(false);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[22px]">
        <div className="min-w-[700px] overflow-hidden rounded-[22px] bg-card">
          <div className="grid grid-cols-5 bg-[#01adf1] px-[16px] py-[14px] md:px-[30px] md:py-[22px]">
            {TABLE_HEADERS.map((h) => (
              <p
                key={h}
                className="whitespace-pre-line text-center text-[11px] font-bold text-foreground md:text-[16px]"
              >
                {h}
              </p>
            ))}
          </div>
          {displayed.length === 0 ? (
            <p className="py-[40px] text-center text-muted-foreground">
              No data available in table
            </p>
          ) : (
            displayed.map((s, i) => (
              <div
                key={s.id}
                className={`grid grid-cols-5 px-[16px] py-[14px] md:px-[30px] md:py-[20px] ${i < displayed.length - 1 ? 'border-b border-muted' : ''}`}
              >
                <p className="text-center text-[12px] text-foreground md:text-[16px]">
                  #{s.id.slice(-7)}
                </p>
                <p className="text-center text-[12px] text-foreground md:text-[16px]">
                  {s.creatorName}
                </p>
                <p className="text-center text-[12px] text-foreground md:text-[16px]">
                  ${s.amount.toFixed(2)}
                </p>
                <p className="text-center text-[12px] text-foreground md:text-[16px]">
                  {formatDate(s.startDate)}
                </p>
                <p className="text-center text-[12px] text-foreground md:text-[16px]">
                  {formatDate(s.renewalDate)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={setPage} />
    </div>
  );
}
