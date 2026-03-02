export interface Sticker {
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const STICKER_OPTIONS = [
  { emoji: '\u2764\uFE0F', label: 'Heart' },
  { emoji: '\uD83D\uDD25', label: 'Fire' },
  { emoji: '\uD83D\uDE02', label: 'Laugh' },
  { emoji: '\uD83D\uDE0D', label: 'Love' },
  { emoji: '\uD83C\uDF1F', label: 'Star' },
  { emoji: '\uD83C\uDF89', label: 'Party' },
  { emoji: '\uD83D\uDCAF', label: '100' },
  { emoji: '\uD83D\uDC4D', label: 'Thumbs' },
];

export function StoryStickers({
  stickers,
  onAdd,
  onRemoveLast,
}: {
  stickers: Sticker[];
  onAdd: (sticker: Sticker) => void;
  onRemoveLast: () => void;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-wrap gap-[8px]">
        {STICKER_OPTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() =>
              onAdd({
                emoji: s.emoji,
                x: 30 + Math.random() * 40,
                y: 30 + Math.random() * 40,
                size: 32,
              })
            }
            className="flex size-[40px] items-center justify-center rounded-[8px] bg-muted text-[20px] hover:bg-muted/80"
            title={s.label}
          >
            {s.emoji}
          </button>
        ))}
      </div>
      {stickers.length > 0 && (
        <button
          onClick={onRemoveLast}
          className="self-start rounded-[50px] bg-muted px-[14px] py-[6px] text-[12px] text-red-400 hover:text-red-300"
        >
          Undo Last Sticker
        </button>
      )}
    </div>
  );
}
