import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { StatsRow, QueueTable, CreatorTable, type ClipStats } from './AdminAIClipsParts';

type Tab = 'queue' | 'creators' | 'all';

interface AdminClip {
  id: string;
  title: string;
  thumbnailPath: string | null;
  filePath: string;
  score: string;
  published: boolean;
  createdAt: string;
  job: { originalName: string; status: string };
}

function AllClipsTable({
  clips,
  onDelete,
  deleting,
}: {
  clips: AdminClip[];
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  if (!clips.length) return <p className="text-[13px] text-muted-foreground">No clips yet</p>;
  return (
    <div className="flex flex-col gap-[8px]">
      {clips.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-[12px] rounded-[10px] border border-border bg-card p-[12px]"
        >
          {c.thumbnailPath ? (
            <img
              src={c.thumbnailPath}
              alt={c.title}
              className="h-[48px] w-[72px] rounded-[6px] object-cover shrink-0"
            />
          ) : (
            <div className="h-[48px] w-[72px] rounded-[6px] bg-muted shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">{c.title}</p>
            <p className="text-[11px] text-muted-foreground">
              {c.job.originalName} · {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-[8px] shrink-0">
            <span
              className={`rounded-[20px] px-[8px] py-[2px] text-[10px] font-medium ${c.published ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}
            >
              {c.published ? 'Published' : 'Unpublished'}
            </span>
            <button
              onClick={() => onDelete(c.id)}
              disabled={deleting}
              className="rounded-[6px] border border-red-500/30 px-[10px] py-[5px] text-[11px] text-red-400 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'queue', label: 'Processing Queue' },
  { key: 'creators', label: 'By Creator' },
  { key: 'all', label: 'All Clips' },
];

export default function AdminAIClips() {
  const [tab, setTab] = useState<Tab>('queue');
  const qc = useQueryClient();

  const { data: stats } = useQuery<ClipStats>({
    queryKey: ['admin-clips-stats'],
    queryFn: () => api.get('/admin/clips/stats').then((r) => r.data.data),
  });

  const { data: queueData = [] } = useQuery({
    queryKey: ['admin-clips-queue'],
    queryFn: () => api.get('/admin/clips/queue').then((r) => r.data.data),
    enabled: tab === 'queue',
    refetchInterval: tab === 'queue' ? 5000 : false,
  });

  const { data: creatorsData = [] } = useQuery({
    queryKey: ['admin-clips-creators'],
    queryFn: () => api.get('/admin/clips/creators').then((r) => r.data.data),
    enabled: tab === 'creators',
  });

  const { data: allData } = useQuery({
    queryKey: ['admin-clips-all'],
    queryFn: () => api.get('/admin/clips/all').then((r) => r.data.data),
    enabled: tab === 'all',
  });

  const deleteMut = useMutation({
    mutationFn: (clipId: string) => api.delete(`/admin/clips/${clipId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-clips-all'] });
      qc.invalidateQueries({ queryKey: ['admin-clips-stats'] });
    },
  });

  const clips: AdminClip[] = allData?.clips ?? [];

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <p className="text-[20px] font-semibold text-foreground">AI Viral Clips</p>
        <p className="text-[13px] text-muted-foreground">
          Monitor clip generation jobs and manage creator usage
        </p>
      </div>

      {stats && <StatsRow s={stats} />}

      <div className="flex gap-[8px]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-[8px] px-[16px] py-[8px] text-[13px] font-medium transition-colors ${tab === t.key ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'border border-border text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'queue' && <QueueTable jobs={queueData} />}
      {tab === 'creators' && <CreatorTable rows={creatorsData} />}
      {tab === 'all' && (
        <AllClipsTable
          clips={clips}
          onDelete={(id) => deleteMut.mutate(id)}
          deleting={deleteMut.isPending}
        />
      )}
    </div>
  );
}
