interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function AdminPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= Math.min(6, totalPages); i++) pages.push(i);
  if (totalPages > 6) pages.push('...', totalPages);

  return (
    <div className="mt-[16px] flex items-center justify-center gap-[6px]">
      {pages.map((p, idx) =>
        typeof p === 'string' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex size-[28px] items-center justify-center rounded-[2px] border-[0.5px] border-[#a61651] font-outfit text-[10px] text-black"
          >
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex size-[28px] items-center justify-center rounded-[2px] font-outfit text-[10px] ${
              p === page
                ? 'bg-[#5d5d5d] text-[#f8f8f8]'
                : 'border-[0.5px] border-[#a61651] text-black hover:bg-[#f0f0f0]'
            }`}
          >
            {p}
          </button>
        ),
      )}
      {page < totalPages && (
        <button
          onClick={() => onPageChange(page + 1)}
          className="flex h-[38px] items-center justify-center rounded-[4px] border-[0.5px] border-[#a61651] px-[10px] font-outfit text-[10px] text-black hover:bg-[#f0f0f0]"
        >
          Next
        </button>
      )}
    </div>
  );
}
