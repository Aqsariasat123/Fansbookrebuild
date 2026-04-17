import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  StatusBar,
  ClipCard,
  JobHistoryRow,
  type AIClipJob,
  type ClipJobStatus,
} from './AIClipsParts';
import { UploadArea } from './AIClipsUploadArea';

const POLL_STATUSES: ClipJobStatus[] = ['QUEUED', 'EXTRACTING', 'ANALYZING', 'CUTTING'];

function isPolling(jobs: AIClipJob[]) {
  return jobs.some((j) => POLL_STATUSES.includes(j.status)) ? 3000 : (false as const);
}

function getActiveJob(jobs: AIClipJob[], id: string | null) {
  return id ? (jobs.find((j) => j.id === id) ?? null) : null;
}

function getHistoryJobs(jobs: AIClipJob[], activeId: string | null) {
  return jobs.filter((j) => j.id !== activeId || j.status === 'DONE' || j.status === 'FAILED');
}

function ActiveJobStatus({ job }: { job: AIClipJob | null }) {
  if (!job || job.status === 'DONE') return null;
  return <StatusBar status={job.status} error={job.errorMessage} />;
}

function ClipGrid({ clips }: { clips: AIClipJob['clips'] }) {
  if (!clips.length) return null;
  return (
    <div>
      <p className="text-[14px] font-semibold text-foreground mb-[12px]">
        Generated Clips — {clips.length} found
      </p>
      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3">
        {clips.map((c) => (
          <ClipCard key={c.id} clip={c} />
        ))}
      </div>
    </div>
  );
}

function History({
  jobs,
  expandedId,
  onToggle,
}: {
  jobs: AIClipJob[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  if (!jobs.length) return null;
  return (
    <div>
      <p className="text-[14px] font-semibold text-foreground mb-[10px]">Previous Sessions</p>
      <div className="flex flex-col gap-[8px]">
        {jobs.map((j) => (
          <JobHistoryRow
            key={j.id}
            job={j}
            isExpanded={expandedId === j.id}
            onToggle={() => onToggle(j.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AIClips() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const { data: jobs = [], refetch } = useQuery<AIClipJob[]>({
    queryKey: ['ai-clip-jobs'],
    queryFn: () => api.get('/creator/clips/jobs').then((r) => r.data.data),
    refetchInterval: (q) => isPolling(q.state.data ?? []),
  });

  const activeJob = getActiveJob(jobs, activeJobId);
  const isProcessing = activeJob ? POLL_STATUSES.includes(activeJob.status) : false;
  const historyJobs = getHistoryJobs(jobs, activeJobId);
  const doneClips = activeJob?.status === 'DONE' ? activeJob.clips : [];

  useEffect(() => {
    if (activeJob?.status === 'DONE') setExpandedJobId(activeJob.id);
  }, [activeJob?.status, activeJob?.id]);

  const handleUploaded = (jobId: string) => {
    setActiveJobId(jobId);
    refetch();
  };
  const toggleExpanded = (id: string) => setExpandedJobId(expandedJobId === id ? null : id);

  return (
    <div className="flex flex-col gap-[24px]">
      <div>
        <p className="text-[18px] font-semibold text-foreground">AI Viral Clips</p>
        <p className="text-[13px] text-muted-foreground">
          Upload a long video — AI finds the best moments and cuts clips for you
        </p>
      </div>
      {!isProcessing && <UploadArea onUploaded={handleUploaded} />}
      <ActiveJobStatus job={activeJob} />
      <ClipGrid clips={doneClips} />
      <History jobs={historyJobs} expandedId={expandedJobId} onToggle={toggleExpanded} />
      {jobs.length === 0 && !isProcessing && (
        <div className="rounded-[12px] border border-border bg-card p-[40px] text-center">
          <p className="text-[14px] text-muted-foreground">
            No clips generated yet — upload your first video above
          </p>
        </div>
      )}
    </div>
  );
}
