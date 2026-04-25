import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';

// Renders a slowly-drifting semi-transparent username overlay on top of video.
// Canvas is pointer-events-none so it doesn't block playback controls.
// Survives screen recording — the watermark floats into every recorded frame.
export function VideoWatermarkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const user = useAuthStore((s) => s.user);
  const label = user ? `inscrio.com/u/${user.username}` : 'inscrio.com';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = Math.random() * 0.6;
    let y = Math.random() * 0.6;
    let dx = 0.00015;
    let dy = 0.00012;
    let frameId: number;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      x += dx;
      y += dy;
      if (x < 0 || x > 0.75) dx = -dx;
      if (y < 0 || y > 0.85) dy = -dy;

      ctx.font = 'bold 13px Outfit, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillText(label, x * w, y * h + 13);
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
