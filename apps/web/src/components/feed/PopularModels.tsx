import { Link } from 'react-router-dom';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export function PopularModels({ models }: { models: Author[] }) {
  return (
    <div className="flex flex-col gap-[8px] md:gap-[17px]">
      <div className="flex items-center justify-between text-[12px] font-medium text-foreground md:text-[16px]">
        <p>Most Popular Models</p>
        <Link to="/explore" className="cursor-pointer underline decoration-solid">
          View all
        </Link>
      </div>
      <div className="flex items-start gap-[21px] overflow-x-auto scrollbar-hide md:gap-[42px]">
        {models.map((m) => (
          <Link
            key={m.id}
            to={`/u/${m.username}`}
            className="flex w-[35px] shrink-0 flex-col items-center gap-[4px] hover:opacity-80 md:w-[89px] md:gap-[10px]"
          >
            <div className="relative h-[35px] w-full overflow-hidden rounded-full md:h-[89px]">
              <img
                src={m.avatar || ''}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <p className="w-full whitespace-pre-wrap text-center text-[10px] font-medium text-foreground md:text-[16px]">
              {m.displayName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
