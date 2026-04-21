import { ImageWatermark } from '../shared/ImageWatermark';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export function MultiImageGrid({
  images,
  onClickImage,
  username,
}: {
  images: Media[];
  onClickImage: (idx: number) => void;
  username?: string;
}) {
  const total = images.length;

  // Single image — full width, taller
  if (total === 1) {
    return (
      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-[16px] aspect-[16/9]"
        onClick={() => onClickImage(0)}
      >
        <img src={images[0]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {username && <ImageWatermark username={username} />}
      </div>
    );
  }

  // Two images — side by side
  if (total === 2) {
    return (
      <div className="grid grid-cols-2 gap-[8px]">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-[16px]"
            onClick={() => onClickImage(i)}
          >
            <img src={img.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {i === 0 && username && <ImageWatermark username={username} />}
          </div>
        ))}
      </div>
    );
  }

  // 3+ images — 3-column grid, max 6 shown, overflow badge on last
  const maxVisible = 6;
  const visible = images.slice(0, maxVisible);
  const overflow = total > maxVisible ? total - maxVisible : 0;

  return (
    <div className="grid grid-cols-3 gap-[8px]">
      {visible.map((img, i) => {
        const isLast = i === visible.length - 1 && overflow > 0;
        return (
          <div
            key={img.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-[16px]"
            onClick={() => onClickImage(i)}
          >
            <img
              src={img.url}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover${isLast ? ' blur-sm' : ''}`}
            />
            {i === 0 && username && <ImageWatermark username={username} />}
            {isLast && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-[18px] font-semibold text-white">+{overflow}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
