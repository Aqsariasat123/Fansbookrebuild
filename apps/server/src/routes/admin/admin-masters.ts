import { Router } from 'express';
import faqsRouter from './masters/faqs.js';
import cmsRouter from './masters/cms.js';
import emailTemplatesRouter from './masters/email-templates.js';
import profileStatTypesRouter from './masters/profile-stat-types.js';
import profileStatsRouter from './masters/profile-stats.js';
import profileTypesRouter from './masters/profile-types.js';
import platformsRouter from './masters/platforms.js';
import translationsRouter from './masters/translations.js';
import subscriptionPlansRouter from './masters/subscription-plans.js';
import countriesRouter from './masters/countries.js';
import countryFormsRouter from './masters/country-forms.js';

const router = Router();

router.use('/faqs', faqsRouter);
router.use('/cms', cmsRouter);
router.use('/email-templates', emailTemplatesRouter);
router.use('/profile-stat-types', profileStatTypesRouter);
router.use('/profile-stats', profileStatsRouter);
router.use('/profile-types', profileTypesRouter);
router.use('/platforms', platformsRouter);
router.use('/translations', translationsRouter);
router.use('/subscription-plans', subscriptionPlansRouter);
router.use('/countries', countriesRouter);
router.use('/country-forms', countryFormsRouter);

export default router;
