import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import creatorsRouter from './routes/creators.js';
import liveRouter from './routes/live.js';
import feedRouter from './routes/feed.js';
import { logger } from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan('short', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Rate limiting
app.use('/api', apiLimiter);

// Serve uploaded files (under /api so Nginx proxies it)
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/creators', creatorsRouter);
app.use('/api/live', liveRouter);
app.use('/api/feed', feedRouter);

// Error handling
app.use(errorHandler);

export default app;
