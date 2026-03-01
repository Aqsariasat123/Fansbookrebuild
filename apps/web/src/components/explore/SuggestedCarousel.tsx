import { Link } from 'react-router-dom';

interface SuggestedCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface Props {
  creators: SuggestedCreator[];
  onSeeAll: () => void;
}

export function SuggestedCarousel({ creators, onSeeAll }: Props) {
  if (creators.length === 0) return null;

  return (
    <div>
      <div className="mb-[12px] flex items-center justify-between">
        <p className="text-[14px] font-medium text-foreground">Suggested for You</p>
        <button onClick={onSeeAll} className="text-[13px] text-primary hover:underline">
          See all
        </button>
      </div>
      <div className="flex gap-[12px] overflow-x-auto scrollbar-hide">
        {creators.map((c) => (
          <Link
            key={c.id}
            to={`/u/${c.username}`}
            className="flex w-[120px] shrink-0 flex-col items-center gap-[8px] rounded-[16px] bg-card p-[16px] transition-colors hover:bg-card/80"
          >
            <div className="size-[56px] overflow-hidden rounded-full">
              {c.avatar ? (
                <img src={c.avatar} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[20px] font-medium text-white">
                  {c.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="w-full truncate text-center text-[13px] font-medium text-foreground">
              {c.displayName}
            </p>
            <p className="text-[11px] text-muted-foreground">@{c.username}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
