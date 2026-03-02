import { useState } from 'react';

export interface TextOverlay {
  text: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
}

const COLORS = ['#ffffff', '#000000', '#ff4444', '#ffbb33', '#00C851', '#33b5e5', '#aa66cc'];

export function StoryTextOverlay({
  overlay,
  onChange,
  onRemove,
}: {
  overlay: TextOverlay | null;
  onChange: (o: TextOverlay) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(overlay?.text || '');

  const handleAdd = () => {
    setEditing(true);
  };

  const handleDone = () => {
    if (text.trim()) {
      onChange({
        text: text.trim(),
        color: overlay?.color || '#ffffff',
        fontSize: overlay?.fontSize || 24,
        x: overlay?.x || 50,
        y: overlay?.y || 50,
      });
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-[8px]">
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="h-[40px] rounded-[8px] border border-border/40 bg-transparent px-[12px] text-[14px] text-foreground outline-none focus:border-[#01adf1]"
          onKeyDown={(e) => e.key === 'Enter' && handleDone()}
        />
        <div className="flex items-center gap-[8px]">
          <div className="flex gap-[4px]">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ ...overlay!, text, color: c })}
                className="size-[24px] rounded-full border-2"
                style={{
                  backgroundColor: c,
                  borderColor: overlay?.color === c ? '#01adf1' : 'transparent',
                }}
              />
            ))}
          </div>
          <input
            type="range"
            min={14}
            max={48}
            value={overlay?.fontSize || 24}
            onChange={(e) => onChange({ ...overlay!, text, fontSize: parseInt(e.target.value) })}
            className="flex-1"
          />
          <button
            onClick={handleDone}
            className="rounded-[50px] bg-[#01adf1] px-[16px] py-[4px] text-[12px] text-white"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-[8px]">
      <button
        onClick={handleAdd}
        className="rounded-[50px] bg-muted px-[14px] py-[6px] text-[12px] text-muted-foreground hover:text-foreground"
      >
        + Add Text
      </button>
      {overlay && (
        <button
          onClick={onRemove}
          className="rounded-[50px] bg-muted px-[14px] py-[6px] text-[12px] text-red-400 hover:text-red-300"
        >
          Remove Text
        </button>
      )}
    </div>
  );
}
