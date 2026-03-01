import { Link } from 'react-router-dom';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface Props {
  suggestedCreators: Author[];
}

export function EmptyFeedState({ suggestedCreators }: Props) {
  return (
    <div className="flex flex-col items-center gap-[20px] rounded-[22px] bg-card px-[20px] py-[40px]">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
          fill="currentColor"
        />
      </svg>
      <p className="text-[16px] font-medium text-foreground">Your feed is empty</p>
      <p className="text-[14px] text-muted-foreground">Follow creators to see their posts here</p>

      {suggestedCreators.length > 0 && (
        <div className="mt-[8px] w-full">
          <p className="mb-[12px] text-center text-[14px] font-medium text-foreground">
            Suggested Creators
          </p>
          <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3">
            {suggestedCreators.map((c) => (
              <Link
                key={c.id}
                to={`/u/${c.username}`}
                className="flex flex-col items-center gap-[8px] rounded-[12px] bg-muted p-[16px] transition-colors hover:bg-muted/80"
              >
                <div className="size-[48px] overflow-hidden rounded-full">
                  {c.avatar ? (
                    <img src={c.avatar} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[18px] font-medium text-white">
                      {c.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-[13px] font-medium text-foreground">{c.displayName}</span>
                <span className="text-[11px] text-muted-foreground">@{c.username}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        to="/explore"
        className="mt-[8px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white"
      >
        Explore Creators
      </Link>
    </div>
  );
}
