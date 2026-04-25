import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';

// Renders a slowly-drifting semi-transparent username overlay on top of video.
// Canvas is pointer-events-none so it doesn't block playback controls.
// Survives screen recording — the watermark floats into every recorded frame.

function syncSize(c: HTMLCanvasElement) {
  const w = c.offsetWidth || c.parentElement?.offsetWidth || 400;
  const h = c.offsetHeight || c.parentElement?.offsetHeight || 300;
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  return { w: c.width, h: c.height };
}

export function VideoWatermarkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const user = useAuthStore((s) => s.user);
  const label = user ? `inscrio.com/u/${user.username}` : 'inscrio.com';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = 0.1 + Math.random() * 0.5;
    let y = 0.15 + Math.random() * 0.5;
    let dx = 0.00018;
    let dy = 0.00014;
    let frameId: number;

    function draw() {
      const { w, h } = syncSize(canvas!);
      ctx!.clearRect(0, 0, w, h);
      x += dx;
      y += dy;
      if (x < 0.02 || x > 0.72) dx = -dx;
      if (y < 0.05 || y > 0.82) dy = -dy;
      ctx!.font = 'bold 13px Outfit, Arial, sans-serif';
      ctx!.fillStyle = 'rgba(255,255,255,0.15)';
      ctx!.fillText(label, x * w, y * h + 13);
      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [label]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
