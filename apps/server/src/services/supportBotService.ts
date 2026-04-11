import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const BOT_MODEL = 'claude-haiku-4-5-20251001';
let anthropic: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropic) {
    if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

const SYSTEM_PROMPT = `You are a helpful support assistant for Inscrio, a creator-fan social platform (similar to OnlyFans/Patreon).

Your job is to help users with common questions about:
- Account setup, login, and email verification
- Subscriptions: how to subscribe to creators, billing, cancellations
- Payments: adding payment methods, failed payments, refunds
- Content: how to post, upload limits, content guidelines
- Creator features: going live, setting subscription prices, payouts
- ID verification: how the process works, what documents are accepted
- Privacy & safety: reporting, blocking, privacy settings
- Technical issues: app not loading, notifications not working

Be concise, friendly, and helpful. If you cannot answer the question or it requires account-specific investigation, end your reply with exactly: [ESCALATE]

Do NOT escalate for general questions you can answer. Only escalate for account-specific issues that need human review.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function shouldEscalate(text: string): boolean {
  return text.includes('[ESCALATE]');
}

function cleanReply(text: string): string {
  return text.replace('[ESCALATE]', '').trim();
}

export async function chatWithBot(
  userId: string,
  userMessage: string,
  ticketId?: string,
): Promise<{ reply: string; escalated: boolean; ticketId: string }> {
  // Get or create ticket
  let ticket = ticketId
    ? await prisma.supportTicket.findUnique({
        where: { id: ticketId, userId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
      })
    : null;

  if (!ticket) {
    ticket = await prisma.supportTicket.create({
      data: {
        userId,
        title: userMessage.slice(0, 80),
        description: userMessage,
        status: 'OPEN',
        messages: {
          create: { role: 'USER', content: userMessage },
        },
      },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  } else {
    await prisma.supportMessage.create({
      data: { ticketId: ticket.id, role: 'USER', content: userMessage },
    });
  }

  // Build message history for Claude
  const history: Message[] = ticket.messages
    .filter((m) => m.role === 'USER' || m.role === 'BOT')
    .map((m) => ({ role: m.role === 'USER' ? 'user' : 'assistant', content: m.content }));

  // Add the new user message if this is an existing ticket
  if (ticketId) {
    history.push({ role: 'user', content: userMessage });
  }

  let reply = "I'm sorry, I'm having trouble right now. Please try again in a moment.";
  let escalated = false;

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: BOT_MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    escalated = shouldEscalate(raw);
    reply = cleanReply(raw);
  } catch (err) {
    logger.error({ err }, 'Support bot AI error');
    escalated = true;
    reply =
      "I'm having trouble answering right now. I'll connect you with our support team instead.";
  }

  // Save bot reply
  await prisma.supportMessage.create({
    data: { ticketId: ticket.id, role: 'BOT', content: reply },
  });

  // If escalated, mark ticket for admin attention
  if (escalated) {
    await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: { status: 'ESCALATED' },
    });
  }

  // Log AI usage
  try {
    await prisma.aIUsageLog.create({
      data: {
        creatorId: userId,
        feature: 'support',
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
      },
    });
  } catch {
    // non-critical
  }

  return { reply, escalated, ticketId: ticket.id };
}

export async function getMyTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
}

export async function getTicketById(ticketId: string, userId: string) {
  return prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
}
