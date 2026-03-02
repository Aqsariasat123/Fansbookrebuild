const FILTERS = [
  { name: 'None', css: '' },
  { name: 'Warm', css: 'brightness(1.1) saturate(1.3) sepia(0.2)' },
  { name: 'Cool', css: 'brightness(1.05) saturate(0.9) hue-rotate(20deg)' },
  { name: 'Vintage', css: 'sepia(0.6) contrast(1.1) brightness(0.9)' },
  { name: 'B&W', css: 'grayscale(1) contrast(1.1)' },
  { name: 'Vivid', css: 'saturate(1.8) contrast(1.2)' },
  { name: 'Fade', css: 'brightness(1.15) contrast(0.85) saturate(0.7)' },
  { name: 'Drama', css: 'contrast(1.4) brightness(0.9) saturate(1.1)' },
] as const;

export function StoryFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (css: string) => void;
}) {
  return (
    <div className="flex gap-[8px] overflow-x-auto pb-[4px]">
      {FILTERS.map((f) => (
        <button
          key={f.name}
          onClick={() => onChange(f.css)}
          className={`shrink-0 rounded-[50px] px-[14px] py-[6px] text-[12px] font-medium transition-colors ${
            active === f.css
              ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {f.name}
        </button>
      ))}
    </div>
  );
}
