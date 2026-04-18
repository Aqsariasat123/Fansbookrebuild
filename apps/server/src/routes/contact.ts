import { Router } from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(5000),
});

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() }))
    .max(20)
    .optional()
    .default([]),
});

const SYSTEM_PROMPT = `You are Inscrio's friendly support assistant. Inscrio is a creator-fan platform where creators can earn through subscriptions, pay-per-view content, tips, live streaming, marketplace sales, and crowdfunding.

Key features of Inscrio:
- **Earnings**: Subscriptions, PPV content, Tipping, Marketplace (auctions & direct sales), Crowdfunding
- **Streaming**: Public live streams, 1-to-1 private streams, in-stream shopping
- **AI Tools**: Smart-pricing suggestions, upsell advisor, viral clip generator, content moderation
- **Security**: AI ID/age verification, fraud prevention, escrow payments, watermarking
- **Engagement**: Stories, chat with file sharing, leaderboards, subscriber badges

Answer questions clearly and concisely. If someone has an issue that needs human support, encourage them to submit the contact form. Do not make up features or prices that aren't mentioned above. Keep replies short (2-4 sentences max unless a list is needed).`;

let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

// POST /api/contact — unauthenticated contact form
router.post('/', authLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

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

// POST /api/contact/chat — AI support chat
router.post('/chat', authLimiter, validate(chatSchema), async (req, res, next) => {
  try {
    if (!env.ANTHROPIC_API_KEY) {
      res.json({
        reply:
          "I'm not available right now. Please submit the contact form and we'll get back to you soon.",
      });
      return;
    }

    const { message, history } = req.body as {
      message: string;
      history: { role: 'user' | 'assistant'; content: string }[];
    };

    const messages: Anthropic.MessageParam[] = [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const response = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : "I couldn't generate a response. Please try again.";

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

export default router;
