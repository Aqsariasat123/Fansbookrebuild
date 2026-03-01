import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: 'FIXED_PRICE' | 'AUCTION';
  category: string;
  images: string[];
  status: string;
  endsAt: string | null;
  createdAt: string;
  seller: { id: string; displayName: string; avatar: string | null; isVerified: boolean };
  _count: { bids: number };
}

const CATEGORIES = [
  'All',
  'DIGITAL_CONTENT',
  'PHYSICAL_MERCH',
  'EXPERIENCE',
  'CUSTOM_CONTENT',
  'SHOUTOUT',
];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low', value: 'price_low' },
  { label: 'Price: High', value: 'price_high' },
  { label: 'Ending Soon', value: 'ending' },
];

export default function Marketplace() {
  const user = useAuthStore((s) => s.user);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '12', sort });
        if (query) params.set('q', query);
        if (category !== 'All') params.set('category', category);
        api
          .get(`/marketplace?${params}`)
          .then(({ data: r }) => {
            setListings(r.data.items);
            setTotal(r.data.total);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      },
      query ? 300 : 0,
    );
    return () => clearTimeout(timerRef.current);
  }, [query, category, sort, page]);

  const isCreator = user?.role === 'CREATOR';

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-semibold text-foreground">Marketplace</p>
        {isCreator && (
          <Link
            to="/marketplace/create"
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white"
          >
            + Create Listing
          </Link>
        )}
      </div>

      <div className="rounded-[22px] bg-card p-[16px] md:p-[20px]">
        {/* Search */}
        <div className="flex items-center gap-[10px] rounded-[52px] bg-muted py-[8px] pl-[12px] pr-[10px]">
          <img src="/icons/dashboard/search.svg" alt="" className="size-[20px]" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search listings..."
            className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`rounded-[50px] px-[14px] py-[5px] text-[12px] font-medium ${
                category === c
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {c === 'All'
                ? 'All'
                : c
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
        <div className="mt-[8px] flex gap-[8px]">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`text-[12px] ${sort === s.value ? 'text-[#01adf1] font-medium' : 'text-muted-foreground'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <p className="py-[40px] text-center text-[14px] text-muted-foreground">No listings found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
          {listings.length < total && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="mx-auto rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] text-[14px] text-white"
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ListingCard({ listing: l }: { listing: Listing }) {
  const timeLeft = l.endsAt ? Math.max(0, new Date(l.endsAt).getTime() - Date.now()) : null;
  const hoursLeft = timeLeft ? Math.floor(timeLeft / 3600000) : null;

  return (
    <Link
      to={`/marketplace/${l.id}`}
      className="overflow-hidden rounded-[16px] bg-card transition-transform hover:scale-[1.02]"
    >
      <div className="aspect-[4/3] bg-muted">
        {l.images[0] && <img src={l.images[0]} alt="" className="size-full object-cover" />}
      </div>
      <div className="p-[12px]">
        <p className="line-clamp-1 text-[14px] font-medium text-foreground">{l.title}</p>
        <div className="mt-[4px] flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[#01adf1]">${l.price.toFixed(2)}</span>
          {l.type === 'AUCTION' && (
            <span className="text-[11px] text-muted-foreground">{l._count.bids} bids</span>
          )}
        </div>
        <div className="mt-[6px] flex items-center gap-[6px]">
          <div className="size-[20px] shrink-0 overflow-hidden rounded-full">
            {l.seller.avatar ? (
              <img src={l.seller.avatar} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[8px] text-white">
                {l.seller.displayName[0]}
              </div>
            )}
          </div>
          <span className="text-[12px] text-muted-foreground">{l.seller.displayName}</span>
        </div>
        {hoursLeft !== null && (
          <p className="mt-[4px] text-[11px] text-orange-400">{hoursLeft}h left</p>
        )}
      </div>
    </Link>
  );
}
