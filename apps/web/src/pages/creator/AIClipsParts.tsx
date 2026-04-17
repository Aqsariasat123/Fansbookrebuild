import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { PublishModal } from './AIClipsPublishModal';

export type ClipJobStatus = 'QUEUED' | 'EXTRACTING' | 'ANALYZING' | 'CUTTING' | 'DONE' | 'FAILED';

export interface AIClip {
  id: string;
  filePath: string;
  thumbnailPath: string | null;
  title: string;
  startSec: number;
  endSec: number;
  score: string;
  reason: string | null;
  published: boolean;
  postId: string | null;
}

export interface AIClipJob {
  id: string;
  originalName: string;
  durationSec: number | null;
  status: ClipJobStatus;
  errorMessage: string | null;
  createdAt: string;
  clips: AIClip[];
}

const STATUS_STEPS: Record<ClipJobStatus, { label: string; step: number }> = {
  QUEUED: { label: 'Queued', step: 0 },
  EXTRACTING: { label: 'Extracting frames…', step: 1 },
  ANALYZING: { label: 'AI analyzing moments…', step: 2 },
  CUTTING: { label: 'Cutting clips…', step: 3 },
  DONE: { label: 'Clips ready', step: 4 },
  FAILED: { label: 'Failed', step: -1 },
};

export function StatusBar({ status, error }: { status: ClipJobStatus; error: string | null }) {
  const s = STATUS_STEPS[status];
  if (status === 'FAILED') {
    return (
      <div className="rounded-[10px] border border-red-500/30 bg-red-500/10 p-[12px]">
        <p className="text-[13px] font-medium text-red-400">Processing failed</p>
        {error && <p className="text-[11px] text-red-400/80 mt-[2px]">{error}</p>}
      </div>
    );
  }
  if (status === 'DONE') return null;
  const steps = ['Queued', 'Extracting', 'Analyzing', 'Cutting'];
  return (
    <div className="rounded-[10px] border border-border bg-card p-[14px]">
      <div className="flex items-center justify-between mb-[10px]">
        <p className="text-[13px] font-medium text-foreground">{s.label}</p>
        <div className="size-[16px] animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
      </div>
      <div className="flex gap-[4px]">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`h-[4px] flex-1 rounded-full transition-colors ${i < s.step ? 'bg-[#01adf1]' : i === s.step - 1 ? 'bg-[#01adf1]/60' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ClipCard({ clip }: { clip: AIClip }) {
  const [showPublish, setShowPublish] = useState(false);
  const qc = useQueryClient();
  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/creator/clips/${clip.id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-clip-jobs'] }),
  });
  const duration = Math.round(clip.endSec - clip.startSec);
  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden">
      <div className="relative">
        {clip.thumbnailPath ? (
          <img
            src={clip.thumbnailPath}
            alt={clip.title}
            className="h-[140px] w-full object-cover"
          />
        ) : (
          <div className="h-[140px] w-full bg-muted flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        )}
        <span className="absolute bottom-[6px] right-[6px] rounded-[4px] bg-black/70 px-[6px] py-[2px] text-[11px] text-white">
          {duration}s
        </span>
        <span
          className={`absolute top-[6px] left-[6px] rounded-[4px] px-[6px] py-[2px] text-[10px] font-semibold ${clip.score === 'HIGH' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
        >
          {clip.score}
        </span>
      </div>
      <div className="p-[12px]">
        <p className="text-[13px] font-semibold text-foreground line-clamp-2">{clip.title}</p>
        {clip.reason && (
          <p className="text-[11px] text-muted-foreground mt-[4px] line-clamp-2">{clip.reason}</p>
        )}
        {clip.published ? (
          <div className="mt-[10px] rounded-[6px] bg-green-500/10 border border-green-500/20 px-[10px] py-[6px]">
            <p className="text-[11px] text-green-400 font-medium">Published to feed</p>
          </div>
        ) : (
          <div className="mt-[10px] flex gap-[6px]">
            <button
              onClick={() => setShowPublish(true)}
              className="flex-1 rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[7px] text-[11px] font-semibold text-white"
            >
              Publish
            </button>
            <a
              href={clip.filePath}
              download
              className="flex items-center justify-center rounded-[6px] border border-border px-[10px] py-[7px]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </a>
            <button
              onClick={() => deleteMut.mutate()}
              disabled={deleteMut.isPending}
              className="flex items-center justify-center rounded-[6px] border border-red-500/30 px-[10px] py-[7px] text-red-400 disabled:opacity-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {showPublish && <PublishModal clip={clip} onClose={() => setShowPublish(false)} />}
    </div>
  );
}

export function JobHistoryRow({
  job,
  isExpanded,
  onToggle,
}: {
  job: AIClipJob;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const s = STATUS_STEPS[job.status];
  const statusColor =
    job.status === 'DONE'
      ? 'bg-green-500/20 text-green-400'
      : job.status === 'FAILED'
        ? 'bg-red-500/20 text-red-400'
        : 'bg-blue-500/20 text-blue-400';
  return (
    <div className="rounded-[10px] border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-[14px] text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-foreground truncate">{job.originalName}</p>
          <p className="text-[11px] text-muted-foreground mt-[2px]">
            {new Date(job.createdAt).toLocaleDateString()} · {job.clips.length} clips
          </p>
        </div>
        <div className="flex items-center gap-[8px] shrink-0 ml-[12px]">
          <span
            className={`rounded-[20px] px-[8px] py-[2px] text-[10px] font-medium ${statusColor}`}
          >
            {s.label}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </button>
      {isExpanded && job.clips.length > 0 && (
        <div className="border-t border-border p-[14px]">
          <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3">
            {job.clips.map((c) => (
              <ClipCard key={c.id} clip={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
