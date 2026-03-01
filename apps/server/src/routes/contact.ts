import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { logger } from '../utils/logger.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(5000),
});

// POST /api/contact — unauthenticated contact form
router.post('/', authLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Try to find existing user by email, or create a guest ticket
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.supportTicket.create({
        data: {
          userId: user.id,
          title: subject || `Contact from ${name}`,
          description: message,
        },
      });
    } else {
      // Log for now - no user account means we store minimally
      logger.info(`[contact] Guest message from ${name} <${email}>: ${subject || 'No subject'}`);
    }

    res.json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
