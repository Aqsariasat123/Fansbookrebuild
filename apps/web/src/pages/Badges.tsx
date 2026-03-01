import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

const ICON_MAP: Record<string, string> = {
  rocket: '🚀',
  pencil: '✏️',
  star: '⭐',
  gem: '💎',
  heart: '❤️',
  trophy: '🏆',
  fire: '🔥',
  crown: '👑',
  medal: '🏅',
  shield: '🛡️',
};

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'text-gray-600 dark:text-gray-400 border-gray-400/30',
  RARE: 'text-blue-600 dark:text-blue-400 border-blue-400/30',
  EPIC: 'text-purple-600 dark:text-purple-400 border-purple-400/30',
  LEGENDARY: 'text-yellow-600 dark:text-yellow-400 border-yellow-400/30',
};

type Filter = 'all' | 'earned';

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    api
      .get('/badges')
      .then(({ data: r }) => setBadges(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'earned' ? badges.filter((b) => b.earned) : badges;
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-semibold text-foreground">Badges</p>
        <span className="text-[14px] text-muted-foreground">
          {earnedCount}/{badges.length} earned
        </span>
      </div>

      <div className="flex gap-[8px]">
        {(['all', 'earned'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-[50px] px-[16px] py-[6px] text-[13px] font-medium ${
              filter === f
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {f === 'all' ? 'All' : 'Earned'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-[40px] text-center text-[14px] text-muted-foreground">
          {filter === 'earned' ? 'No badges earned yet' : 'No badges available'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-[8px] rounded-[16px] border bg-card p-[16px] text-center transition-opacity ${
                badge.earned ? RARITY_COLORS[badge.rarity] : 'border-border opacity-40'
              }`}
            >
              <div className="flex size-[56px] items-center justify-center rounded-full bg-muted text-[24px]">
                {ICON_MAP[badge.icon] || badge.icon || '🏆'}
              </div>
              <p className="text-[14px] font-medium text-foreground">{badge.name}</p>
              <p className="text-[11px] text-muted-foreground">{badge.description}</p>
              <span
                className={`text-[10px] font-medium uppercase ${RARITY_COLORS[badge.rarity]?.split(' ')[0] || 'text-gray-400'}`}
              >
                {badge.rarity}
              </span>
              {badge.earned && badge.earnedAt && (
                <p className="text-[10px] text-muted-foreground">
                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
