import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { adminRoutes } from './pages/admin/AdminRoutes';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { useAuthStore } from './stores/authStore';
import { getMeApi } from './lib/auth';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const MakeMoney = lazy(() => import('./pages/MakeMoney'));
const Creators = lazy(() => import('./pages/Creators'));
const CreatorsLive = lazy(() => import('./pages/CreatorsLive'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const Messages = lazy(() => import('./pages/Messages'));
const MessageChat = lazy(() => import('./pages/MessageChat'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Followers = lazy(() => import('./pages/Followers'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Explore = lazy(() => import('./pages/Explore'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const Language = lazy(() => import('./pages/Language'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Complaints = lazy(() => import('./pages/Complaints'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const SinglePost = lazy(() => import('./pages/SinglePost'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Following = lazy(() => import('./pages/Following'));
const CreateStory = lazy(() => import('./pages/CreateStory'));
const SearchPage = lazy(() => import('./pages/Search'));
const BecomeCreator = lazy(() => import('./pages/BecomeCreator'));
const TwoFactorVerify = lazy(() => import('./pages/TwoFactorVerify'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const MarketplacePage = lazy(() => import('./pages/Marketplace'));
const LeaderboardPage = lazy(() => import('./pages/Leaderboard'));
const BadgesPage = lazy(() => import('./pages/Badges'));
const MarketplaceDetail = lazy(() => import('./pages/MarketplaceDetail'));
const MarketplaceCreate = lazy(() => import('./pages/MarketplaceCreate'));
const HashtagFeed = lazy(() => import('./pages/HashtagFeed'));
const NotFound = lazy(() => import('./pages/NotFound'));

const CreatorProfileOwner = lazy(() => import('./pages/CreatorProfileOwner'));
const CreatorProfileEdit = lazy(() => import('./pages/CreatorProfileEdit'));
const CreatorWallet = lazy(() => import('./pages/CreatorWallet'));
const CreatorEarnings = lazy(() => import('./pages/CreatorEarnings'));
const CreatorReferrals = lazy(() => import('./pages/CreatorReferrals'));
const CreatorSubscriptionTiers = lazy(() => import('./pages/CreatorSubscriptionTiers'));
const CreatorBookings = lazy(() => import('./pages/CreatorBookings'));
const CreatorPublicProfile = lazy(() => import('./pages/CreatorPublicProfile'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const GoLive = lazy(() => import('./pages/GoLive'));
const LiveBroadcasting = lazy(() => import('./pages/LiveBroadcasting'));
const CreatorDashboardHome = lazy(() => import('./pages/CreatorDashboardHome'));
const CreatorAnalytics = lazy(() => import('./pages/CreatorAnalytics'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return;
    }
    getMeApi()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [setUser]);
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Marketing pages (no layout) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/make-money" element={<MakeMoney />} />
              <Route path="/creators" element={<Creators />} />
              <Route path="/creators-live" element={<CreatorsLive />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Auth pages (no layout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/2fa/verify" element={<TwoFactorVerify />} />

              {/* Protected app routes with layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  {/* Shared routes (both fan + creator) */}
                  <Route path="/feed" element={<Home />} />
                  <Route path="/post/:id" element={<SinglePost />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/stories/create" element={<CreateStory />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:conversationId" element={<MessageChat />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/hashtag/:tag" element={<HashtagFeed />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help-support" element={<HelpSupport />} />
                  <Route path="/language" element={<Language />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/marketplace/:id" element={<MarketplaceDetail />} />
                  <Route path="/marketplace/create" element={<MarketplaceCreate />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/badges" element={<BadgesPage />} />

                  {/* Public creator profile (requires login) */}
                  <Route path="/u/:username" element={<CreatorPublicProfile />} />

                  {/* Fan-only routes */}
                  <Route element={<RoleRoute allowedRoles={['FAN', 'ADMIN']} />}>
                    <Route path="/become-creator" element={<BecomeCreator />} />
                  </Route>
                  <Route element={<RoleRoute allowedRoles={['FAN', 'ADMIN']} />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/followers" element={<Followers />} />
                    <Route path="/subscription" element={<Subscriptions />} />
                  </Route>

                  {/* Creator-only routes */}
                  <Route element={<RoleRoute allowedRoles={['CREATOR', 'ADMIN']} />}>
                    <Route path="/creator/dashboard" element={<CreatorDashboardHome />} />
                    <Route path="/creator/analytics" element={<CreatorAnalytics />} />
                    <Route path="/creator/profile" element={<CreatorProfileOwner />} />
                    <Route path="/creator/profile/edit" element={<CreatorProfileEdit />} />
                    <Route path="/creator/wallet" element={<CreatorWallet />} />
                    <Route path="/creator/earnings" element={<CreatorEarnings />} />
                    <Route path="/creator/referrals" element={<CreatorReferrals />} />
                    <Route path="/creator/subscriptions" element={<CreatorSubscriptionTiers />} />
                    <Route path="/creator/bookings" element={<CreatorBookings />} />
                    <Route path="/creator/post/new" element={<CreatePost />} />
                    <Route path="/creator/go-live" element={<GoLive />} />
                    <Route path="/creator/live" element={<LiveBroadcasting />} />
                  </Route>
                </Route>
              </Route>

              {adminRoutes()}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthBootstrap>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
