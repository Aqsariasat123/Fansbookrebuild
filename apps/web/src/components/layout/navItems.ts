export interface NavItem {
  to: string;
  icon: string;
  labelKey: string;
}

export const fanNavItems: NavItem[] = [
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
  { to: '/search', icon: '/icons/dashboard/search.svg', labelKey: 'nav.search' },
  { to: '/explore', icon: '/icons/dashboard/favorite.svg', labelKey: 'nav.explore' },
  { to: '/live-browse', icon: '/icons/dashboard/video-progress.svg', labelKey: 'nav.live' },
  { to: '/profile', icon: '/icons/dashboard/person.svg', labelKey: 'nav.myProfile' },
  { to: '/messages', icon: '/icons/dashboard/chat.svg', labelKey: 'nav.messages' },
  { to: '/wallet', icon: '/icons/dashboard/account-balance-wallet.svg', labelKey: 'nav.myWallet' },
  { to: '/followers', icon: '/icons/dashboard/person-heart.svg', labelKey: 'nav.myFollowersModel' },
  {
    to: '/subscription',
    icon: '/icons/dashboard/workspace-premium.svg',
    labelKey: 'nav.mySubscription',
  },
  {
    to: '/leaderboard',
    icon: '/icons/dashboard/volunteer-activism.svg',
    labelKey: 'nav.leaderboard',
  },
  { to: '/badges', icon: '/icons/dashboard/badge-shield.svg', labelKey: 'nav.badges' },
  { to: '/marketplace', icon: '/icons/dashboard/wallet-card.svg', labelKey: 'nav.marketplace' },
  {
    to: '/notifications',
    icon: '/icons/dashboard/notifications.svg',
    labelKey: 'nav.notifications',
  },
  { to: '/settings', icon: '/icons/dashboard/settings.svg', labelKey: 'nav.settings' },
  { to: '/help-support', icon: '/icons/dashboard/help-center.svg', labelKey: 'nav.helpSupport' },
  { to: '/become-creator', icon: '/icons/dashboard/add-circle.svg', labelKey: 'nav.becomeCreator' },
];

export const creatorNavItems: NavItem[] = [
  { to: '/creator/dashboard', icon: '/icons/dashboard/home.svg', labelKey: 'nav.dashboard' },
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
  { to: '/search', icon: '/icons/dashboard/search.svg', labelKey: 'nav.search' },
  {
    to: '/creator/post/new',
    icon: '/icons/dashboard/add-circle.svg',
    labelKey: 'nav.createPost',
  },
  {
    to: '/creator/analytics',
    icon: '/icons/dashboard/account-balance-wallet.svg',
    labelKey: 'nav.analytics',
  },
  { to: '/creator/profile', icon: '/icons/dashboard/person.svg', labelKey: 'nav.myProfile' },
  { to: '/messages', icon: '/icons/dashboard/chat.svg', labelKey: 'nav.messages' },
  {
    to: '/creator/wallet',
    icon: '/icons/dashboard/account-balance-wallet.svg',
    labelKey: 'nav.myWallet',
  },
  {
    to: '/creator/earnings',
    icon: '/icons/dashboard/account-balance-wallet.svg',
    labelKey: 'nav.myEarning',
  },
  {
    to: '/creator/referrals',
    icon: '/icons/dashboard/person-heart.svg',
    labelKey: 'nav.myReferrals',
  },
  {
    to: '/creator/subscriptions',
    icon: '/icons/dashboard/workspace-premium.svg',
    labelKey: 'nav.mySubscription',
  },
  { to: '/creator/bookings', icon: '/icons/dashboard/pending.svg', labelKey: 'nav.myBookings' },
  {
    to: '/creator/go-live',
    icon: '/icons/dashboard/video-progress.svg',
    labelKey: 'nav.goLive',
  },
  { to: '/marketplace', icon: '/icons/dashboard/wallet-card.svg', labelKey: 'nav.marketplace' },
  {
    to: '/notifications',
    icon: '/icons/dashboard/notifications.svg',
    labelKey: 'nav.notifications',
  },
  { to: '/settings', icon: '/icons/dashboard/settings.svg', labelKey: 'nav.settings' },
  { to: '/help-support', icon: '/icons/dashboard/help-center.svg', labelKey: 'nav.helpSupport' },
];

export const fallbackLabels: Record<string, string> = {
  'nav.home': 'Home',
  'nav.search': 'Search',
  'nav.explore': 'Explore',
  'nav.myProfile': 'My Profile',
  'nav.messages': 'Messages',
  'nav.myWallet': 'My Wallet',
  'nav.myFollowersModel': 'My Followers Model',
  'nav.mySubscription': 'My Subscription',
  'nav.leaderboard': 'Leaderboard',
  'nav.badges': 'Badges',
  'nav.marketplace': 'Marketplace',
  'nav.notifications': 'Notifications',
  'nav.settings': 'Settings',
  'nav.helpSupport': 'Help & Support',
  'nav.live': 'Live',
  'nav.becomeCreator': 'Become Creator',
  'nav.myEarning': 'My Earning',
  'nav.myReferrals': 'My Referrals',
  'nav.myBookings': 'My Bookings',
  'nav.dashboard': 'Dashboard',
  'nav.analytics': 'Analytics',
  'nav.createPost': 'Create Post',
  'nav.goLive': 'Go Live',
  'nav.english': 'English',
  'nav.logout': 'Logout',
};

export const REVERSE_LANG: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ur: 'Urdu',
  ar: 'Arabic',
  zh: 'Chinese',
  hi: 'Hindi',
  bn: 'Bangla',
  tr: 'Turkish',
};
