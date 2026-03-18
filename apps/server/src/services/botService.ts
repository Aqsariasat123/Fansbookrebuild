import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { emitToUser } from '../utils/notify.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const SENDER_SELECT = { id: true, username: true, displayName: true, avatar: true };

let anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropic) {
    if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

export async function getBotConfig(creatorId: string) {
  return prisma.creatorBot.findUnique({ where: { creatorId } });
}

export async function upsertBotConfig(
  creatorId: string,
  data: {
    enabled?: boolean;
    persona?: string;
    greeting?: string;
    explicitAllowed?: boolean;
  },
) {
  return prisma.creatorBot.upsert({
    where: { creatorId },
    create: { creatorId, ...data },
    update: { ...data },
  });
}

interface ReplyParams {
  creatorId: string;
  conversationId: string;
  fanMessage: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

async function buildSystemPrompt(
  creatorId: string,
  bot: { persona?: string | null; explicitAllowed: boolean },
) {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { displayName: true, username: true },
  });
  const displayName = creator?.displayName ?? 'Creator';
  const username = creator?.username ?? 'creator';
  const base = bot.persona?.trim()
    ? bot.persona.trim()
    : `You are ${displayName} (@${username}), a creator on Fansbook. Be friendly, engaging, and authentic.`;
  const explicitNote = bot.explicitAllowed
    ? ' You may engage with adult and explicit content in a consensual, creative way. Stay in character.'
    : ' Keep responses tasteful. Redirect explicit requests politely.';
  return `${base}${explicitNote}\n\nYou are responding to a fan in a private chat. Keep replies concise (1-3 sentences). Be personal and warm. Never break character or mention being an AI.`;
}

async function callLLM(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string | null> {
  try {
    const response = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    });
    const block = response.content[0];
    return block.type === 'text' ? block.text.trim() : null;
  } catch (err) {
    logger.error({ err }, 'Bot reply generation failed');
    return null;
  }
}

export async function generateBotReply(params: ReplyParams): Promise<string | null> {
  const { creatorId, fanMessage, history } = params;
  const bot = await getBotConfig(creatorId);
  if (!bot?.enabled) return null;
  const systemPrompt = await buildSystemPrompt(creatorId, bot);
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...history.slice(-10),
    { role: 'user', content: fanMessage },
  ];
  return callLLM(systemPrompt, messages);
}

export async function sendBotMessage(conversationId: string, creatorId: string, text: string) {
  const message = await prisma.message.create({
    data: { conversationId, senderId: creatorId, text, mediaType: 'TEXT' },
    include: { sender: { select: SENDER_SELECT } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessage: text, lastMessageAt: new Date() },
  });

  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (conv) {
    const fanId = conv.participant1Id === creatorId ? conv.participant2Id : conv.participant1Id;
    emitToUser(fanId, 'message:new', message);
    emitToUser(fanId, 'conversation:update', {
      conversationId,
      lastMessage: text,
      lastMessageAt: new Date(),
    });
  }

  return message;
}

export async function triggerBotReply(
  conversationId: string,
  creatorId: string,
  fanMessage: string,
) {
  try {
    const recentMessages = await prisma.message.findMany({
      where: { conversationId, mediaType: 'TEXT' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { senderId: true, text: true },
    });

    const history = recentMessages
      .reverse()
      .filter((m) => m.text)
      .map((m) => ({
        role: (m.senderId === creatorId ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.text!,
      }));

    const reply = await generateBotReply({ creatorId, conversationId, fanMessage, history });
    if (reply) {
      await sendBotMessage(conversationId, creatorId, reply);
    }
  } catch (err) {
    logger.error({ err }, 'triggerBotReply failed');
  }
}
