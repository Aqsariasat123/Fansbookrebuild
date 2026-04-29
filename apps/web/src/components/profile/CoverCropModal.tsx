import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

const COVER_ASPECT = 920 / 216;
const OUT_W = 1840;
const OUT_H = Math.round(OUT_W / COVER_ASPECT);

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

async function cropToFile(src: string, area: Area): Promise<File> {
  const image = await createImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, OUT_W, OUT_H);
  return new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(new File([blob!], 'cover.jpg', { type: 'image/jpeg' })),
      'image/jpeg',
      0.95,
    ),
  );
}

interface Props {
  src: string;
  onApply: (file: File) => void;
  onCancel: () => void;
}

export function CoverCropModal({ src, onApply, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleApply() {
    if (!croppedArea) return;
    setApplying(true);
    try {
      const file = await cropToFile(src, croppedArea);
      onApply(file);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <div className="flex items-center justify-between px-[20px] py-[16px]">
        <button onClick={onCancel} className="text-[16px] text-white/60">
          Cancel
        </button>
        <p className="text-[16px] font-semibold text-white">Crop Cover Photo</p>
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
          aspect={COVER_ASPECT}
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex flex-col items-center gap-[8px] px-[24px] py-[20px]">
        <p className="text-[12px] text-white/40">Pinch or use slider to zoom</p>
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
