import type { PostMedia } from './PostCard';
import { ImageWatermark } from '../shared/ImageWatermark';

interface ImageGridProps {
  media: PostMedia[];
  onImageClick: (index: number) => void;
  username: string;
}

export function ImageGrid({ media, onImageClick, username }: ImageGridProps) {
  const images = media.filter((m) => m.type === 'IMAGE');
  if (images.length === 0) return null;
  const extra = images.length > 4 ? images.length - 3 : 0;
  const shown = images.slice(0, extra > 0 ? 3 : images.length);

  if (shown.length === 1) {
    return (
      <div
        className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[16px]"
        onClick={() => onImageClick(0)}
      >
        <img src={shown[0].url} alt="" className="h-full w-full object-cover" />
        <ImageWatermark username={username} />
      </div>
    );
  }

  return (
    <div className="grid h-[220px] grid-cols-2 gap-[4px] overflow-hidden rounded-[12px] md:h-[360px] md:gap-[6px] md:rounded-[16px]">
      <div
        className="relative cursor-pointer overflow-hidden"
        style={{ gridRow: shown.length > 2 ? '1 / 3' : undefined }}
        onClick={() => onImageClick(0)}
      >
        <img src={shown[0].url} alt="" className="h-full w-full object-cover" />
        <ImageWatermark username={username} />
      </div>
      {shown.slice(1).map((img, i) => (
        <div
          key={img.id}
          className="relative h-full w-full cursor-pointer overflow-hidden"
          onClick={() => onImageClick(i + 1)}
        >
          <img src={img.url} alt="" className="h-full w-full object-cover" />
          {extra > 0 && i === shown.length - 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-[18px] font-semibold text-white md:text-[24px]">
                +{extra < 10 ? `0${extra}` : extra}
                <br />
                <span className="text-[13px] font-normal">More</span>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
