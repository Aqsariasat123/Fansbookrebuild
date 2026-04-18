import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/creators',
  '/creators-live',
  '/make-money',
  '/how-it-works',
  '/about',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/cookies',
  '/complaints',
  '/verify-identity',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

export function AgeVerification({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!authUser) return;
    if (authUser.role === 'ADMIN') return;
    if (authUser.verificationStatus === 'APPROVED') return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (isPublic) return;
    navigate('/verify-identity', { replace: true });
  }, [authUser, navigate, pathname]);

  return <>{children}</>;
}
