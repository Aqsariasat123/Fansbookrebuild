import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface InvestigationUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
}

interface InvestigationResult {
  found: boolean;
  message?: string;
  userId?: string;
  user?: InvestigationUser | null;
}

interface Investigation {
  id: string;
  filename: string;
  decodedUserId: string | null;
  username: string | null;
  displayName: string | null;
  foundAt: string;
  admin: { username: string; displayName: string };
}

interface Stats {
  total: number;
  found: number;
  notFound: number;
  recent: Investigation[];
}

function ResultCard({ result }: { result: InvestigationResult }) {
  const bg = result.found ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted';
  return (
    <div className={`mt-[16px] rounded-[12px] p-[16px] ${bg}`}>
      {result.found && result.user ? (
        <div className="flex items-center gap-[12px]">
          {result.user.avatar ? (
            <img
              src={result.user.avatar}
              alt=""
              className="size-[48px] rounded-full object-cover"
            />
          ) : (
            <div className="flex size-[48px] items-center justify-center rounded-full bg-muted text-[18px] font-medium text-foreground">
              {result.user.displayName[0]}
            </div>
          )}
          <div>
            <p className="text-[15px] font-semibold text-foreground">{result.user.displayName}</p>
            <p className="text-[13px] text-muted-foreground">@{result.user.username}</p>
            <p className="text-[12px] text-muted-foreground">{result.user.email}</p>
          </div>
          <div className="ml-auto rounded-[6px] bg-green-500/20 px-[10px] py-[4px] text-[12px] font-medium text-green-400">
            Watermark found
          </div>
        </div>
      ) : result.found ? (
        <p className="text-[13px] text-amber-400">
          Watermark decoded (ID: {result.userId}) but user no longer exists.
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">{result.message}</p>
      )}
    </div>
  );
}

function InvestigatePanel({ onDone }: { onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleInvestigate() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data: r } = await api.post('/admin/watermark/investigate', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(r.data as InvestigationResult);
      onDone();
    } catch {
      setError('Investigation failed. Make sure the image is a valid WebP/PNG file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[16px] bg-card p-[24px]">
      <p className="mb-[16px] text-[16px] font-semibold text-foreground">Identify Leaked Image</p>
      <p className="mb-[16px] text-[13px] text-muted-foreground">
        Upload a suspected leaked image. If it was served by Inscrio with forensic watermarking
        enabled, the viewer&apos;s account will be identified.
      </p>
      <div className="flex items-center gap-[12px]">
        <label className="flex cursor-pointer items-center gap-[8px] rounded-[8px] border border-border px-[14px] py-[8px] text-[13px] text-foreground hover:border-[#01adf1]/60">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          {file ? file.name : 'Choose image…'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
            }}
          />
        </label>
        <button
          onClick={handleInvestigate}
          disabled={!file || loading}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[8px] text-[13px] font-medium text-white disabled:opacity-40"
        >
          {loading ? 'Analyzing…' : 'Investigate'}
        </button>
      </div>
      {error && <p className="mt-[12px] text-[13px] text-red-400">{error}</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}

export default function AdminWatermark() {
  const { data: stats, refetch } = useQuery<Stats>({
    queryKey: ['admin-watermark-stats'],
    queryFn: () => api.get('/admin/watermark/stats').then((r) => r.data.data),
  });

  return (
    <div className="flex flex-col gap-[24px]">
      <p className="text-[20px] font-semibold text-foreground">Forensic Watermark</p>

      {stats && (
        <div className="grid grid-cols-3 gap-[16px]">
          {[
            { label: 'Total Investigations', value: stats.total },
            { label: 'Watermark Found', value: stats.found },
            { label: 'Not Found', value: stats.notFound },
          ].map((s) => (
            <div key={s.label} className="rounded-[16px] bg-card p-[20px]">
              <p className="text-[28px] font-bold text-foreground">{s.value}</p>
              <p className="mt-[4px] text-[13px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <InvestigatePanel onDone={() => void refetch()} />

      {stats && stats.recent.length > 0 && (
        <div className="rounded-[16px] bg-card p-[24px]">
          <p className="mb-[16px] text-[15px] font-semibold text-foreground">
            Recent Investigations
          </p>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-[8px] font-medium">File</th>
                <th className="pb-[8px] font-medium">Result</th>
                <th className="pb-[8px] font-medium">Investigated by</th>
                <th className="pb-[8px] font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50">
                  <td className="py-[10px] text-foreground">{inv.filename}</td>
                  <td className="py-[10px]">
                    {inv.decodedUserId ? (
                      <span className="text-green-400">@{inv.username ?? inv.decodedUserId}</span>
                    ) : (
                      <span className="text-muted-foreground">Not found</span>
                    )}
                  </td>
                  <td className="py-[10px] text-muted-foreground">@{inv.admin.username}</td>
                  <td className="py-[10px] text-muted-foreground">
                    {new Date(inv.foundAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
