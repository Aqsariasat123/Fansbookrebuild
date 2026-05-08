import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

type Aspect = '1:1' | '4:5' | '16:9';

const ASPECT_VAL: Record<Aspect, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

async function cropToFile(src: string, area: Area, name: string): Promise<File> {
  const image = await createImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  // Quality 0.97 + high-quality smoothing — keeps the cropped image visually identical
  // to the original. JPEG (not PNG) since post images can be many and PNG is much larger.
  return new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(new File([blob!], name, { type: 'image/jpeg' })),
      'image/jpeg',
      0.97,
    ),
  );
}

interface Props {
  src: string;
  fileName: string;
  originalFile: File;
  remaining: number;
  onApply: (file: File) => void;
  onUseOriginal: () => void;
  onCancelAll: () => void;
}

export function PostImageCropModal({
  src,
  fileName,
  originalFile,
  remaining,
  onApply,
  onUseOriginal,
  onCancelAll,
}: Props) {
  const [aspect, setAspect] = useState<Aspect>('4:5');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  async function handleApply() {
    if (!area) return;
    setApplying(true);
    try {
      const cropped = await cropToFile(src, area, fileName);
      onApply(cropped);
    } finally {
      setApplying(false);
    }
  }

  const titleSuffix = remaining > 1 ? ` (${remaining} left)` : '';

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <div className="flex items-center justify-between px-[20px] py-[16px]">
        <button onClick={onCancelAll} className="text-[16px] text-white/60">
          Cancel
        </button>
        <p className="text-[16px] font-semibold text-white">Crop Image{titleSuffix}</p>
        <button
          onClick={handleApply}
          disabled={applying}
          className="text-[16px] font-semibold text-[#01adf1] disabled:opacity-50"
        >
          {applying ? 'Saving...' : 'Apply'}
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT_VAL[aspect]}
          showGrid
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex flex-col items-center gap-[12px] px-[20px] py-[16px]">
        <div className="flex flex-wrap justify-center gap-[8px]">
          {(['1:1', '4:5', '16:9'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={`rounded-[20px] border px-[14px] py-[6px] text-[12px] font-medium transition-colors ${
                aspect === a
                  ? 'border-[#01adf1] bg-[#01adf1] text-white'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              {a}
            </button>
          ))}
          <button
            onClick={onUseOriginal}
            title={`Skip crop and use ${originalFile.name}`}
            className="rounded-[20px] border border-white/20 px-[14px] py-[6px] text-[12px] font-medium text-white/60 hover:border-white/40"
          >
            Original
          </button>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full max-w-[280px] accent-[#01adf1]"
        />
      </div>
    </div>
  );
}
