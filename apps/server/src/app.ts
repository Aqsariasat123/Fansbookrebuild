import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import authExtendedRouter from './routes/auth-extended.js';
import profileRouter from './routes/profile.js';
import creatorsRouter from './routes/creators.js';
import liveRouter from './routes/live.js';
import feedRouter from './routes/feed.js';
import messagesRouter from './routes/messages.js';
import walletRouter from './routes/wallet.js';
import followersRouter from './routes/followers.js';
import subscriptionsRouter from './routes/subscriptions.js';
import notificationsRouter from './routes/notifications.js';
import supportRouter from './routes/support.js';
import postsRouter from './routes/posts.js';
import postsBookmarksRouter from './routes/posts-bookmarks.js';
import postsInteractionsRouter from './routes/posts-interactions.js';
import postsPpvRouter from './routes/posts-ppv.js';
import creatorProfileRouter from './routes/creator-profile.js';
import creatorProfilePostsRouter from './routes/creator-profile-posts.js';
import creatorSettingsRouter from './routes/creator-settings.js';
import creatorWalletRouter from './routes/creator-wallet.js';
import creatorEarningsRouter from './routes/creator-earnings.js';
import creatorReferralsRouter from './routes/creator-referrals.js';
import creatorTiersRouter from './routes/creator-tiers.js';
import creatorBookingsRouter from './routes/creator-bookings.js';
import creatorDashboardRouter from './routes/creator-dashboard.js';
import storiesRouter from './routes/stories.js';
import settingsRouter from './routes/settings.js';
import socialRouter from './routes/social.js';
import searchRouter from './routes/search.js';
import hashtagsRouter from './routes/hashtags.js';
import becomeCreatorRouter from './routes/become-creator.js';
import twoFactorRouter from './routes/two-factor.js';
import marketplaceRouter from './routes/marketplace.js';
import leaderboardRouter from './routes/leaderboard.js';
import badgesRouter from './routes/badges.js';
import adminRouter from './routes/admin/index.js';
import uploadsRouter from './routes/uploads.js';
import contactRouter from './routes/contact.js';
import tipsRouter from './routes/tips.js';
import announcementsRouter from './routes/announcements.js';
import { logger } from './utils/logger.js';

const app = express();

// Trust Nginx proxy (fixes express-rate-limit X-Forwarded-For error)
app.set('trust proxy', 1);

// Compression
app.use(compression());

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'wss:', 'ws:'],
        mediaSrc: ["'self'", 'blob:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Cookie parsing (for httpOnly refresh tokens)
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan('short', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Static file serving with cache headers
app.use('/uploads', express.static('uploads', { maxAge: '7d', etag: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', authExtendedRouter);
app.use('/api/profile', profileRouter);
app.use('/api/creators', creatorsRouter);
app.use('/api/live', liveRouter);
app.use('/api/feed', feedRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/followers', followersRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/support', supportRouter);
app.use('/api/posts', postsRouter);
app.use('/api/posts', postsBookmarksRouter);
app.use('/api/posts', postsInteractionsRouter);
app.use('/api/posts', postsPpvRouter);
app.use('/api/creator-profile', creatorProfileRouter);
app.use('/api/creator-profile', creatorProfilePostsRouter);
app.use('/api/creator', creatorSettingsRouter);
app.use('/api/creator/wallet', creatorWalletRouter);
app.use('/api/creator/earnings', creatorEarningsRouter);
app.use('/api/creator/referrals', creatorReferralsRouter);
app.use('/api/creator/tiers', creatorTiersRouter);
app.use('/api/creator/bookings', creatorBookingsRouter);
app.use('/api/creator/dashboard', creatorDashboardRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/social', socialRouter);
app.use('/api/search', searchRouter);
app.use('/api/hashtags', hashtagsRouter);
app.use('/api/auth', becomeCreatorRouter);
app.use('/api/auth/2fa', twoFactorRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/tips', tipsRouter);
app.use('/api/announcements', announcementsRouter);

// Error handling
app.use(errorHandler);

export default app;
