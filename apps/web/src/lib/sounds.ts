const cache: Record<string, HTMLAudioElement> = {};

export function playSound(name: 'notification' | 'message' | 'call') {
  const enabled = localStorage.getItem('soundEnabled') !== 'false';
  if (!enabled) return;
  if (!cache[name]) cache[name] = new Audio(`/sounds/${name}.wav`);
  cache[name].currentTime = 0;
  cache[name].play().catch(() => {});
}
