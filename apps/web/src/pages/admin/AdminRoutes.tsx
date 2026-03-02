import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { RoleRoute } from '../../components/RoleRoute';

const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminProfile = lazy(() => import('./AdminProfile'));
const AdminProfileEdit = lazy(() => import('./AdminProfileEdit'));
const AdminBookings = lazy(() => import('./AdminBookings'));
const AdminEarnings = lazy(() => import('./AdminEarnings'));
const AdminReports = lazy(() => import('./AdminReports'));
const SubscriptionHistory = lazy(() => import('./finance/SubscriptionHistory'));
const WithdrawalList = lazy(() => import('./finance/WithdrawalList'));
const PayoutsList = lazy(() => import('./finance/PayoutsList'));
const VatList = lazy(() => import('./finance/VatList'));
const W1099List = lazy(() => import('./finance/W1099List'));
const ModelTaxForms = lazy(() => import('./finance/ModelTaxForms'));
const CmsList = lazy(() => import('./masters/CmsList'));
const EmailTemplateList = lazy(() => import('./masters/EmailTemplateList'));
const FaqsList = lazy(() => import('./masters/FaqsList'));
const ProfileStatTypeList = lazy(() => import('./masters/ProfileStatTypeList'));
const ProfileStatList = lazy(() => import('./masters/ProfileStatList'));
const ProfileTypeList = lazy(() => import('./masters/ProfileTypeList'));
const PlatformList = lazy(() => import('./masters/PlatformList'));
const TranslationList = lazy(() => import('./masters/TranslationList'));
const SubscriptionPlanList = lazy(() => import('./masters/SubscriptionPlanList'));
const CountryList = lazy(() => import('./masters/CountryList'));
const CountryFormList = lazy(() => import('./masters/CountryFormList'));
const HomeSetting = lazy(() => import('./settings/HomeSetting'));
const GeneralSetting = lazy(() => import('./settings/GeneralSetting'));
const MakeMoneySetting = lazy(() => import('./settings/MakeMoneySetting'));
const BannerSetting = lazy(() => import('./settings/BannerSetting'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminAuditLog = lazy(() => import('./AdminAuditLog'));
const AdminContent = lazy(() => import('./AdminContent'));
const AdminBadges = lazy(() => import('./AdminBadges'));
const AdminAnnouncements = lazy(() => import('./AdminAnnouncements'));
const AdminVerification = lazy(() => import('./AdminVerification'));
const AdminHealth = lazy(() => import('./AdminHealth'));

export function adminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/audit-log" element={<AdminAuditLog />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/profile/edit" element={<AdminProfileEdit />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/earnings" element={<AdminEarnings />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/finance/subscriptions" element={<SubscriptionHistory />} />
            <Route path="/admin/finance/withdrawals" element={<WithdrawalList />} />
            <Route path="/admin/finance/payouts" element={<PayoutsList />} />
            <Route path="/admin/finance/vat" element={<VatList />} />
            <Route path="/admin/finance/w1099" element={<W1099List />} />
            <Route path="/admin/finance/tax-forms" element={<ModelTaxForms />} />
            <Route path="/admin/masters/cms" element={<CmsList />} />
            <Route path="/admin/masters/email-templates" element={<EmailTemplateList />} />
            <Route path="/admin/masters/faqs" element={<FaqsList />} />
            <Route path="/admin/masters/profile-stat-types" element={<ProfileStatTypeList />} />
            <Route path="/admin/masters/profile-stats" element={<ProfileStatList />} />
            <Route path="/admin/masters/profile-types" element={<ProfileTypeList />} />
            <Route path="/admin/masters/platforms" element={<PlatformList />} />
            <Route path="/admin/masters/translations" element={<TranslationList />} />
            <Route path="/admin/masters/subscription-plans" element={<SubscriptionPlanList />} />
            <Route path="/admin/masters/countries" element={<CountryList />} />
            <Route path="/admin/masters/country-forms" element={<CountryFormList />} />
            <Route path="/admin/settings/home" element={<HomeSetting />} />
            <Route path="/admin/settings/general" element={<GeneralSetting />} />
            <Route path="/admin/settings/make-money" element={<MakeMoneySetting />} />
            <Route path="/admin/settings/banner" element={<BannerSetting />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/badges" element={<AdminBadges />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/verification" element={<AdminVerification />} />
            <Route path="/admin/health" element={<AdminHealth />} />
          </Route>
        </Route>
      </Route>
    </>
  );
}
