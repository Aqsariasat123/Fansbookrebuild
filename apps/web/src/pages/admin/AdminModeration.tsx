import { useState } from 'react';
import { api } from '../../lib/api';
import {
  useModerationData,
  type MediaItem,
  type ModerationLabel,
  type StatusFilter,
} from './useModerationData';

const FILTERS: StatusFilter[] = ['FLAGGED', 'PENDING', 'SAFE'];

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-[20px]">
      <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-[6px]">{label}</p>
      <p className={`text-[26px] font-bold ${highlight ? 'text-red-500' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

function StatsRow({
  flagged = 0,
  pending = 0,
  safe = 0,
  skipped = 0,
}: {
  flagged?: number;
  pending?: number;
  safe?: number;
  skipped?: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[28px]">
      <StatCard label="Flagged" value={flagged} highlight={flagged > 0} />
      <StatCard label="Pending" value={pending} />
      <StatCard label="Safe" value={safe} />
      <StatCard label="Skipped (video)" value={skipped} />
    </div>
  );
}

function LabelBadge({ label }: { label: ModerationLabel }) {
  return (
    <span className="inline-flex items-center gap-[4px] bg-red-50 border border-red-200 text-red-700 text-[11px] px-[8px] py-[3px] rounded-full">
      {label.name} <span className="text-red-400">{label.confidence.toFixed(0)}%</span>
    </span>
  );
}

function MediaCard({
  item,
  onApprove,
  onRemove,
  acting,
}: {
  item: MediaItem;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  acting: boolean;
}) {
  const labels = (item.moderationLabels ?? []).slice(0, 4);
  const { author } = item.post;
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white overflow-hidden">
      <div className="relative bg-gray-100 h-[180px]">
        <img
          src={item.url}
          alt="flagged"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {item.moderationScore != null && (
          <div className="absolute top-[8px] right-[8px] bg-red-600 text-white text-[11px] font-bold px-[8px] py-[3px] rounded-full">
            {item.moderationScore.toFixed(0)}%
          </div>
        )}
      </div>
      <div className="p-[14px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[8px]">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.displayName}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <div className="size-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] text-gray-500">
              {author.displayName[0]}
            </div>
          )}
          <div>
            <p className="text-[13px] font-medium text-gray-900">{author.displayName}</p>
            <p className="text-[11px] text-gray-500">@{author.username}</p>
          </div>
        </div>
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-[4px]">
            {labels.map((l, i) => (
              <LabelBadge key={i} label={l} />
            ))}
          </div>
        )}
        <p className="text-[11px] text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
        <div className="flex gap-[8px]">
          <button
            disabled={acting}
            onClick={() => onApprove(item.id)}
            className="flex-1 rounded-[8px] border border-green-300 bg-green-50 text-green-700 text-[13px] font-medium py-[7px] disabled:opacity-50"
          >
            Approve
          </button>
          <button
            disabled={acting}
            onClick={() => onRemove(item.id)}
            className="flex-1 rounded-[8px] border border-red-300 bg-red-50 text-red-700 text-[13px] font-medium py-[7px] disabled:opacity-50"
          >
            Remove Post
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-[8px] mt-[24px]">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="px-[16px] py-[7px] rounded-[8px] border border-gray-200 text-[13px] disabled:opacity-40"
      >
        Previous
      </button>
      <span className="px-[16px] py-[7px] text-[13px] text-gray-600">
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={onNext}
        className="px-[16px] py-[7px] rounded-[8px] border border-gray-200 text-[13px] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export default function AdminModeration() {
  const [filter, setFilter] = useState<StatusFilter>('FLAGGED');
  const [page, setPage] = useState(1);
  const [acting, setActing] = useState<string | null>(null);
  const { stats, items, total, loading, loadStats, removeItem } = useModerationData(filter, page);

  async function handleApprove(id: string) {
    setActing(id);
    await api.post(`/admin/moderation/${id}/approve`).catch(() => {});
    removeItem(id);
    loadStats();
    setActing(null);
  }

  async function handleRemove(id: string) {
    setActing(id);
    await api.post(`/admin/moderation/${id}/remove`).catch(() => {});
    removeItem(id);
    loadStats();
    setActing(null);
  }

  return (
    <div className="p-[24px] md:p-[32px]">
      <div className="mb-[28px]">
        <h1 className="text-[22px] font-bold text-gray-900">Content Moderation</h1>
        <p className="text-[13px] text-gray-500 mt-[2px]">
          AWS Rekognition AI-powered image screening
        </p>
      </div>
      <StatsRow
        flagged={stats?.flagged}
        pending={stats?.pending}
        safe={stats?.safe}
        skipped={stats?.skipped}
      />
      <div className="flex gap-[8px] mb-[20px]">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setFilter(s);
              setPage(1);
            }}
            className={`px-[16px] py-[7px] rounded-full text-[13px] font-medium border transition-colors ${filter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
        <span className="ml-auto text-[13px] text-gray-500 self-center">{total} items</span>
      </div>
      {loading && (
        <div className="flex justify-center py-[60px]">
          <div className="size-6 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="rounded-[12px] border border-gray-200 bg-white py-[60px] text-center">
          <p className="text-[15px] text-gray-400">No {filter.toLowerCase()} items</p>
        </div>
      )}
      {!loading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onRemove={handleRemove}
                acting={acting === item.id}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={Math.ceil(total / 20)}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </>
      )}
    </div>
  );
}
