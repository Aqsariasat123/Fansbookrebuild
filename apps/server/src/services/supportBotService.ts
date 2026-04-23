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

const SYSTEM_PROMPT = `You are a helpful support assistant for Inscrio (inscrio.com), a creator-fan social platform where creators share exclusive content and fans subscribe to support them.

## Platform Knowledge

**Registration & Login**
- Sign up at inscrio.com — click "Join Now" or "Sign Up"
- Choose your role: Fan or Creator
- Enter your username, email, and password
- Verify your email via the confirmation link sent to your inbox
- Login issues: use "Forgot Password" on the login page to reset via email

**Identity Verification**
- Required for creators to receive payouts
- Go to Settings → Identity Verification
- You'll be asked to scan a QR code with your mobile phone
- Complete the verification on your mobile — the desktop page updates automatically
- Accepted documents: passport, driving licence, national ID
- Up to 3 attempts allowed; results sent by email within 24 hours

**Subscriptions (Fan)**
- Visit a creator's profile and click "Subscribe"
- Subscription tiers are set by the creator (monthly price)
- Manage or cancel subscriptions in your Wallet → Subscriptions tab
- Cancellations take effect at end of billing period

**Content & Feed**
- Creators post images, videos, and text to their feed
- Some posts are PPV (Pay-Per-View) — fans pay a one-time fee to unlock
- Stories expire after 24 hours
- Hashtags are clickable — click any #tag to see all posts with that tag

**Messaging**
- Fans can message creators they subscribe to
- Creators can send paid messages (fan pays to unlock the message content)
- Smart reply suggestions available for creators

**Live Streaming**
- Creators can go live from the Creator dashboard → Go Live
- Fans can watch, chat, and tip during streams
- Stream extensions can be purchased by fans to extend stream time

**AI Viral Clips (Creator feature)**
- Creators can upload a video and AI automatically finds the best moments and cuts clips
- Clips can be published to the feed or downloaded
- Access via Creator Dashboard → AI Clips

**Payouts (Creator)**
- Creators request withdrawals from their wallet
- Minimum payout amounts apply
- Payment processed to verified bank/payment account
- ID verification required before first payout

**Marketplace**
- Creators can list items/services for auction or fixed price
- Buyers can bid; anti-sniping prevents last-second bid sniping
- Disputes can be raised within 48 hours of purchase

**Reporting & Safety**
- Use the three-dot menu on any post or profile to report
- Block users from their profile page
- Support tickets can be submitted from Help & Support page

**Technical Issues**
- App not loading: clear browser cache or try a different browser
- Notifications not working: check browser notification permissions
- Video not playing: ensure stable internet and try refreshing

Be concise, friendly, and specific. Use the platform knowledge above to answer accurately.
If the question requires account-specific investigation (e.g. "why was my account suspended", "my payment failed for order #123"), end your reply with exactly: [ESCALATE]

Do NOT escalate for general how-to questions you can answer from the knowledge above.`;

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
