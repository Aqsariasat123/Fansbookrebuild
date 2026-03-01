const INTEREST_OPTIONS = [
  'Photography',
  'Fitness',
  'Music',
  'Art',
  'Fashion',
  'Travel',
  'Gaming',
  'Cooking',
  'Dance',
  'Comedy',
  'Beauty',
  'Tech',
  'Writing',
  'Yoga',
  'Sports',
  'Film',
  'Education',
  'Lifestyle',
];

export default function StepInterests({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] font-medium text-foreground">Your Interests</p>
      <p className="text-[13px] text-muted-foreground">
        Select at least 3 interests to personalize your feed.
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {INTEREST_OPTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`rounded-[50px] px-[16px] py-[8px] text-[13px] font-medium transition-colors ${
              selected.includes(tag)
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">{selected.length} selected (min 3)</p>
    </div>
  );
}
