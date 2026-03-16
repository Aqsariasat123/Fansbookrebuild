interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  const all = ['', ...categories];

  return (
    <div className="flex flex-wrap gap-[8px]">
      {all.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat || '__all'}
            onClick={() => onSelect(cat)}
            className={`rounded-[20px] px-[12px] py-[6px] font-outfit text-[13px] font-medium transition-colors ${
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
