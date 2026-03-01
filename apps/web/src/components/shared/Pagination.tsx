export function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-[6px] py-[24px]">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`flex h-[28px] w-[28px] items-center justify-center rounded-[2px] border border-border text-[10px] text-foreground ${p === page ? 'bg-muted-foreground' : ''}`}
        >
          {p}
        </button>
      ))}
      {totalPages > 6 && (
        <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[2px] border border-border text-[10px] text-foreground">
          ...
        </span>
      )}
      {page < totalPages && (
        <button
          onClick={() => onPage(page + 1)}
          className="flex h-[38px] items-center justify-center rounded-[4px] border border-border px-[10px] text-[10px] text-foreground"
        >
          Next
        </button>
      )}
    </div>
  );
}
