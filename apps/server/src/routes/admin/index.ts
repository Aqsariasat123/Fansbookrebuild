import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';
import usersRouter from './admin-users.js';
import bookingsRouter from './admin-bookings.js';
import earningsRouter from './admin-earnings.js';
import reportsRouter from './admin-reports.js';
import financeRouter from './admin-finance.js';
import mastersRouter from './admin-masters.js';
import settingsRouter from './admin-settings.js';
import profileRouter from './admin-profile.js';
import dashboardRouter from './admin-dashboard.js';
import auditLogRouter from './admin-audit-log.js';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.use('/users', usersRouter);
router.use('/bookings', bookingsRouter);
router.use('/earnings', earningsRouter);
router.use('/reports', reportsRouter);
router.use('/finance', financeRouter);
router.use('/masters', mastersRouter);
router.use('/settings', settingsRouter);
router.use('/profile', profileRouter);
router.use('/dashboard', dashboardRouter);
router.use('/audit-log', auditLogRouter);

export default router;
