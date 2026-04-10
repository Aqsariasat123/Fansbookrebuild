type Outcome = 'BLOCKED' | 'FLAGGED' | 'ALLOWED';

export interface FraudEvent {
  id: string;
  type: string;
  ip: string | null;
  email: string | null;
  ipScore: number | null;
  emailScore: number | null;
  isProxy: boolean | null;
  isVpn: boolean | null;
  outcome: Outcome;
  reason: string | null;
  createdAt: string;
  user: { id: string; username: string } | null;
}

export interface FraudStats {
  blocked: number;
  flagged: number;
  allowed: number;
  blockedToday: number;
}

export const BADGE: Record<Outcome, string> = {
  BLOCKED: 'bg-red-500/20 text-red-400',
  FLAGGED: 'bg-yellow-500/20 text-yellow-400',
  ALLOWED: 'bg-green-500/20 text-green-400',
};

export function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="text-gray-500">—</span>;
  return <span className={score >= 70 ? 'text-red-400' : 'text-gray-300'}>{score}</span>;
}

export function FlagBadges({ isProxy, isVpn }: { isProxy: boolean | null; isVpn: boolean | null }) {
  if (!isProxy && !isVpn) return <span className="text-gray-500">—</span>;
  return (
    <div className="flex gap-[4px]">
      {isProxy && (
        <span className="rounded px-[6px] py-[2px] text-[11px] bg-orange-500/20 text-orange-400">
          Proxy
        </span>
      )}
      {isVpn && (
        <span className="rounded px-[6px] py-[2px] text-[11px] bg-purple-500/20 text-purple-400">
          VPN
        </span>
      )}
    </div>
  );
}

export function FraudRow({ e }: { e: FraudEvent }) {
  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 text-[13px]">
      <td className="px-[16px] py-[12px] text-white">
        {e.user ? `@${e.user.username}` : <span className="text-gray-500">—</span>}
      </td>
      <td className="px-[16px] py-[12px] text-gray-300">{e.type}</td>
      <td className="px-[16px] py-[12px] font-mono text-gray-400">{e.ip ?? '—'}</td>
      <td className="px-[16px] py-[12px]">
        <ScoreCell score={e.ipScore} />
      </td>
      <td className="px-[16px] py-[12px]">
        <ScoreCell score={e.emailScore} />
      </td>
      <td className="px-[16px] py-[12px]">
        <FlagBadges isProxy={e.isProxy} isVpn={e.isVpn} />
      </td>
      <td className="px-[16px] py-[12px]">
        <span
          className={`rounded-full px-[10px] py-[4px] text-[11px] font-medium ${BADGE[e.outcome]}`}
        >
          {e.outcome}
        </span>
      </td>
      <td className="px-[16px] py-[12px] text-gray-400 max-w-[180px] truncate">
        {e.reason ?? '—'}
      </td>
      <td className="px-[16px] py-[12px] text-gray-500">
        {new Date(e.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

export function FraudTable({ events, isLoading }: { events: FraudEvent[]; isLoading: boolean }) {
  return (
    <div className="rounded-[12px] border border-gray-800 bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 text-[13px] text-gray-400">
            {[
              'User',
              'Type',
              'IP',
              'IP Score',
              'Email Score',
              'Flags',
              'Outcome',
              'Reason',
              'Date',
            ].map((h) => (
              <th key={h} className="px-[16px] py-[12px] text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={9} className="px-[16px] py-[24px] text-center text-gray-500">
                Loading…
              </td>
            </tr>
          )}
          {!isLoading && events.length === 0 && (
            <tr>
              <td colSpan={9} className="px-[16px] py-[24px] text-center text-gray-500">
                No events found.
              </td>
            </tr>
          )}
          {events.map((e) => (
            <FraudRow key={e.id} e={e} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
