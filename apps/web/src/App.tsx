import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { adminRoutes } from './pages/admin/AdminRoutes';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { AuthBootstrap } from './components/AuthBootstrap';
import { AgeVerification } from './components/AgeVerification';
import { NotificationToastContainer } from './components/shared/NotificationToast';
import {
  LandingPage,
  MakeMoney,
  Creators,
  CreatorsLive,
  Home,
  Login,
  Register,
  Profile,
  ProfileEdit,
  Messages,
  MessageChat,
  Wallet,
  Followers,
  Subscriptions,
  Notifications,
  Explore,
  Settings,
  HelpSupport,
  About,
  Contact,
  HowItWorks,
  Privacy,
  Terms,
  Cookies,
  Complaints,
  FAQ,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  SinglePost,
  Following,
  CreateStory,
  SearchPage,
  BecomeCreator,
  TwoFactorVerify,
  Onboarding,
  Language,
  MarketplacePage,
  LeaderboardPage,
  BadgesPage,
  MarketplaceDetail,
  MarketplaceCreate,
  HashtagFeed,
  LiveBrowse,
  NotFound,
  CreatorProfileOwner,
  CreatorProfileEdit,
  CreatorWallet,
  CreatorEarnings,
  CreatorReferrals,
  CreatorSubscriptionTiers,
  CreatorBookings,
  CreatorPublicProfile,
  CreatePost,
  EditPost,
  GoLive,
  LiveBroadcasting,
  CreatorDashboardHome,
  CreatorAnalytics,
  LiveWatch,
  VideoCallScreen,
  PaymentGateway,
  CreatorAISettings,
  UpsellAdvisor,
} from './lazyPages';

const VerifyIdentity = lazy(() => import('./pages/VerifyIdentity'));
const MyPurchases = lazy(() => import('./pages/MyPurchases'));
const MySales = lazy(() => import('./pages/creator/MySales'));
const AIClips = lazy(() => import('./pages/creator/AIClips'));

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AgeVerification>
          <AuthBootstrap>
            <NotificationToastContainer />
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

                {/* Payment checkout (no layout) */}
                <Route path="/payment/checkout" element={<PaymentGateway />} />

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
                    <Route path="/verify-identity" element={<VerifyIdentity />} />
                    {/* Shared routes (both fan + creator) */}
                    <Route path="/feed" element={<Home />} />
                    <Route path="/post/:id" element={<SinglePost />} />
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

                    {/* Live browsing + viewer + Video call */}
                    <Route path="/live-browse" element={<LiveBrowse />} />
                    <Route path="/live/:sessionId" element={<LiveWatch />} />
                    <Route path="/call/:callId" element={<VideoCallScreen />} />

                    {/* Public creator profile (requires login) */}
                    <Route path="/u/:username" element={<CreatorPublicProfile />} />

                    {/* Fan-only routes */}
                    <Route element={<RoleRoute allowedRoles={['FAN', 'ADMIN']} />}>
                      <Route path="/become-creator" element={<BecomeCreator />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/purchases" element={<MyPurchases />} />
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
                      <Route path="/creator/post/edit/:id" element={<EditPost />} />
                      <Route path="/creator/go-live" element={<GoLive />} />
                      <Route path="/creator/live" element={<LiveBroadcasting />} />
                      <Route path="/creator/ai-settings" element={<CreatorAISettings />} />
                      <Route path="/creator/upsell" element={<UpsellAdvisor />} />
                      <Route path="/creator/sales" element={<MySales />} />
                      <Route path="/creator/ai-clips" element={<AIClips />} />
                    </Route>
                  </Route>
                </Route>

                {adminRoutes()}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthBootstrap>
        </AgeVerification>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
