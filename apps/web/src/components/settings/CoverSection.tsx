import { useRef } from 'react';
import { SmallBtn } from './SettingsShared';

interface CoverSectionProps {
  cover: string | null | undefined;
  coverMsg: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export function CoverSection({ cover, coverMsg, onUpload, onDelete }: CoverSectionProps) {
  const coverRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="relative w-full h-[136px] rounded-[22px] overflow-hidden bg-muted">
        {cover ? (
          <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[14px]">
            No cover photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 rounded-[22px]" />
      </div>
      <div className="flex items-center justify-between mt-[8px] mb-[4px]">
        <div>
          <p className="text-[16px] text-foreground">Cover Photo</p>
          <p className="text-[12px] text-muted-foreground">Recommended 920 x 216</p>
        </div>
        <div className="flex items-center gap-[10px]">
          {coverMsg && <span className="text-[12px] text-primary">{coverMsg}</span>}
          <SmallBtn label="Upload Cover" onClick={() => coverRef.current?.click()} />
          <SmallBtn label="Delete" onClick={onDelete} />
        </div>
      </div>
      <input
        ref={coverRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onUpload}
      />
    </>
  );
}
