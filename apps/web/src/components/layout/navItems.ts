export interface NavItem {
  to: string;
  icon: string;
  labelKey: string;
}

export const fanNavItems: NavItem[] = [
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
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
    to: '/notifications',
    icon: '/icons/dashboard/notifications.svg',
    labelKey: 'nav.notifications',
  },
  { to: '/settings', icon: '/icons/dashboard/settings.svg', labelKey: 'nav.settings' },
  { to: '/help-support', icon: '/icons/dashboard/help-center.svg', labelKey: 'nav.helpSupport' },
];

export const creatorNavItems: NavItem[] = [
  { to: '/feed', icon: '/icons/dashboard/home.svg', labelKey: 'nav.home' },
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
    to: '/notifications',
    icon: '/icons/dashboard/notifications.svg',
    labelKey: 'nav.notifications',
  },
  { to: '/settings', icon: '/icons/dashboard/settings.svg', labelKey: 'nav.settings' },
  { to: '/help-support', icon: '/icons/dashboard/help-center.svg', labelKey: 'nav.helpSupport' },
];

export const fallbackLabels: Record<string, string> = {
  'nav.home': 'Home',
  'nav.myProfile': 'My Profile',
  'nav.messages': 'Messages',
  'nav.myWallet': 'My Wallet',
  'nav.myFollowersModel': 'My Followers Model',
  'nav.mySubscription': 'My Subscription',
  'nav.notifications': 'Notifications',
  'nav.settings': 'Settings',
  'nav.helpSupport': 'Help & Support',
  'nav.myEarning': 'My Earning',
  'nav.myReferrals': 'My Referrals',
  'nav.myBookings': 'My Bookings',
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
