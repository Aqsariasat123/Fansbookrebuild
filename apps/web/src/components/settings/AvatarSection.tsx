import { useRef } from 'react';
import { SmallBtn } from './SettingsShared';

interface AvatarSectionProps {
  avatar: string | null | undefined;
  avatarMsg: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export function AvatarSection({ avatar, avatarMsg, onUpload, onDelete }: AvatarSectionProps) {
  const avatarRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex items-center justify-between py-[12px]">
        <div className="flex items-center gap-[15px]">
          <img
            src={avatar || '/icons/dashboard/person.svg'}
            alt=""
            className="size-[58px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-[16px] text-foreground">Profile picture</p>
            <p className="text-[12px] text-muted-foreground">PNG, JPEG Under 15mb</p>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          {avatarMsg && <span className="text-[12px] text-primary">{avatarMsg}</span>}
          <SmallBtn label="Upload new picture" onClick={() => avatarRef.current?.click()} />
          <SmallBtn label="Delete" onClick={onDelete} />
        </div>
      </div>
      <input
        ref={avatarRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onUpload}
      />
    </>
  );
}
