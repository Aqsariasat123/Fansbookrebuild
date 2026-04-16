import { useAuthStore } from '../../stores/authStore';

export function VerificationBanner() {
  useAuthStore((s) => s.user);
  // Disabled for testing — re-enable before launch
  return null;
}
