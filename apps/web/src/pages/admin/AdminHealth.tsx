import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface HealthData {
  status: string;
  uptime: number;
  memory: { rss: number; heapUsed: number; heapTotal: number; external: number };
  cpu: { cores: number; model: string; loadAvg: number[] };
  database: { connected: boolean; latencyMs: number };
  redis: { connected: boolean };
  counts: { users: number; posts: number; activeSessions24h: number };
  nodeVersion: string;
  platform: string;
  timestamp: string;
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        ok ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${ok ? 'bg-green-400' : 'bg-red-400'}`} />
      {ok ? 'Connected' : 'Down'}
    </span>
  );
}

export default function AdminHealth() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const { data: res } = await api.get('/admin/health');
      setData(res.data);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const i = setInterval(fetchHealth, 15000);
    return () => clearInterval(i);
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (!data)
    return <div className="text-center py-10 text-red-400">Failed to load health data</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Health</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.status === 'healthy'
              ? 'bg-green-900 text-green-300'
              : 'bg-yellow-900 text-yellow-300'
          }`}
        >
          {data.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Uptime" value={formatUptime(data.uptime)} />
        <Card title="Node Version" value={data.nodeVersion} />
        <Card title="Platform" value={data.platform} />
        <Card title="CPU Cores" value={String(data.cpu.cores)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1d21] rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-white">Memory (MB)</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">RSS:</span>{' '}
              <span className="text-white">{data.memory.rss}</span>
            </div>
            <div>
              <span className="text-gray-400">Heap Used:</span>{' '}
              <span className="text-white">{data.memory.heapUsed}</span>
            </div>
            <div>
              <span className="text-gray-400">Heap Total:</span>{' '}
              <span className="text-white">{data.memory.heapTotal}</span>
            </div>
            <div>
              <span className="text-gray-400">External:</span>{' '}
              <span className="text-white">{data.memory.external}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${Math.min((data.memory.heapUsed / data.memory.heapTotal) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-[#1a1d21] rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-white">Services</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">PostgreSQL</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{data.database.latencyMs}ms</span>
                <StatusBadge ok={data.database.connected} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Redis</span>
              <StatusBadge ok={data.redis.connected} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d21] rounded-xl p-5">
        <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{data.counts.users}</p>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{data.counts.posts}</p>
            <p className="text-sm text-gray-400">Total Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{data.counts.activeSessions24h}</p>
            <p className="text-sm text-gray-400">Active 24h</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-right">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()} (auto-refreshes every 15s)
      </p>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#1a1d21] rounded-xl p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
