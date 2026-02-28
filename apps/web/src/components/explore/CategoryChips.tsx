interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  const all = ['', ...categories];

  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide pb-[4px]">
      {all.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat || '__all'}
            onClick={() => onSelect(cat)}
            className={`shrink-0 rounded-[20px] px-[16px] py-[8px] font-outfit text-[14px] font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat || 'All'}
          </button>
        );
      })}
    </div>
  );
}
