import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function VerificationBanner() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;
  // Don't show if already approved
  if (user.verificationStatus === 'APPROVED') return null;

  const config = {
    UNVERIFIED: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'Verify your identity to unlock full access.',
      cta: 'Verify Now',
      show: true,
    },
    PENDING: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'Your identity verification is in progress.',
      cta: 'Check Status',
      show: true,
    },
    MANUAL_REVIEW: {
      bg: 'bg-purple-500/10 border-purple-500/30',
      text: "Your verification is under manual review. We'll email you within 24 hours.",
      cta: null,
      show: true,
    },
    REJECTED: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'Your verification was rejected. Please try again.',
      cta: 'Try Again',
      show: true,
    },
  };

  const status = (user.verificationStatus ?? 'UNVERIFIED') as keyof typeof config;
  const c = config[status];
  if (!c?.show) return null;

  return (
    <div
      className={`mb-4 flex items-center justify-between rounded-[10px] border px-4 py-3 ${c.bg}`}
    >
      <p className="text-sm text-foreground">{c.text}</p>
      {c.cta && (
        <Link
          to="/verify-identity"
          className="ml-4 shrink-0 rounded-[20px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-4 py-1.5 text-xs font-medium text-white"
        >
          {c.cta}
        </Link>
      )}
    </div>
  );
}
