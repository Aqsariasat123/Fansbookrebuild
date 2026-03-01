export interface AdminNavItem {
  to: string;
  label: string;
  icon?: string;
  children?: AdminNavItem[];
}

export const adminNavItems: AdminNavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/users', label: 'User', icon: 'person' },
  { to: '/admin/bookings', label: 'Booking', icon: 'booking' },
  { to: '/admin/earnings', label: 'Earnings', icon: 'earnings' },
  { to: '/admin/reports', label: 'Report', icon: 'report' },
  { to: '/admin/audit-log', label: 'Audit Log', icon: 'audit' },
  { to: '/admin/content', label: 'Content', icon: 'content' },
  { to: '/admin/badges', label: 'Badges', icon: 'badges' },
  { to: '/admin/announcements', label: 'Announcements', icon: 'announcements' },
  {
    to: '#finance',
    label: 'Finance',
    icon: 'finance',
    children: [
      { to: '/admin/finance/subscriptions', label: 'Subscription History' },
      { to: '/admin/finance/withdrawals', label: 'Withdrawal' },
      { to: '/admin/finance/payouts', label: 'Payouts' },
      { to: '/admin/finance/vat', label: 'VAT' },
      { to: '/admin/finance/w1099', label: 'W1099 NEC' },
      { to: '/admin/finance/tax-forms', label: 'Model Tax Form' },
    ],
  },
  {
    to: '#masters',
    label: 'Masters',
    icon: 'masters',
    children: [
      { to: '/admin/masters/cms', label: 'CMS' },
      { to: '/admin/masters/email-templates', label: 'Email Template' },
      { to: '/admin/masters/faqs', label: 'FAQs' },
      { to: '/admin/masters/profile-stat-types', label: 'Profile Stat Type' },
      { to: '/admin/masters/profile-stats', label: 'Profile Stat' },
      { to: '/admin/masters/profile-types', label: 'Profile Type' },
      { to: '/admin/masters/platforms', label: 'Platform' },
      { to: '/admin/masters/translations', label: 'Translation' },
      { to: '/admin/masters/subscription-plans', label: 'Subscription Plans' },
      { to: '/admin/masters/countries', label: 'Country' },
      { to: '/admin/masters/country-forms', label: 'Country Form' },
    ],
  },
  {
    to: '#settings',
    label: 'Settings',
    icon: 'settings',
    children: [
      { to: '/admin/settings/home', label: 'Home Setting' },
      { to: '/admin/settings/general', label: 'General Setting' },
      { to: '/admin/settings/make-money', label: 'Make Money' },
      { to: '/admin/settings/banner', label: 'Banner Image' },
    ],
  },
];
