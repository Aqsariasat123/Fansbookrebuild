import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { redis } from '../config/redis.js';
import { logAIUsage, updateToneProfile, getMonthlyUsage } from './botAnalytics.js';

export { updateToneProfile, getMonthlyUsage };

const SUGGEST_MODEL = 'claude-haiku-4-5-20251001';
const POLISH_MODEL = 'claude-sonnet-4-6';
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
  data: { suggestEnabled?: boolean; polishEnabled?: boolean; persona?: string; greeting?: string },
) {
  return prisma.creatorBot.upsert({
    where: { creatorId },
    create: { creatorId, ...data },
    update: { ...data },
  });
}

async function buildSuggestContext(
  creatorId: string,
  bot: Awaited<ReturnType<typeof getBotConfig>>,
) {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { displayName: true, username: true },
  });
  const toneNote = bot?.toneProfile ? `\nYour communication style: ${bot.toneProfile}` : '';
  const personaNote = bot?.persona?.trim() ? `\nPersona note: ${bot.persona.trim()}` : '';
  return `You are helping ${creator?.displayName ?? 'a creator'} (@${creator?.username ?? 'creator'}) draft replies to fans on Inscrio, a premium adult content creator platform for adults. Fans may send flirty, suggestive, or adult-oriented messages — this is expected and normal on this platform.${toneNote}${personaNote}
Generate exactly 3 short, engaging reply options. Each reply must be under 2 sentences. Replies can be flirty, playful, or suggestive to match the nature of the conversation — keep them sounding natural and authentic to the creator's voice.
Return ONLY a JSON array of 3 strings, nothing else. Example: ["Reply 1", "Reply 2", "Reply 3"]`;
}

function parseSuggestions(raw: string): string[] {
  const m = raw.match(/\[[\s\S]*?\]/);
  if (m) {
    try {
      const p = JSON.parse(m[0]) as unknown;
      if (Array.isArray(p))
        return (p as unknown[])
          .filter((x): x is string => typeof x === 'string' && x.length > 0)
          .slice(0, 3);
    } catch {
      /* fall through */
    }
  }
  return raw
    .split('\n')
    .map((l) => l.replace(/^[\d.\-*\s]+/, '').trim())
    .filter((l) => l.length > 3 && l.length < 200)
    .slice(0, 3);
}

async function callSuggestLLM(
  system: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  creatorId: string,
): Promise<string[]> {
  const response = await getClient().messages.create({
    model: SUGGEST_MODEL,
    max_tokens: 250,
    system,
    messages: [...history, { role: 'assistant', content: '[' }],
  });
  const raw = '[' + (response.content[0]?.type === 'text' ? response.content[0].text.trim() : '"]');
  await logAIUsage(
    creatorId,
    'suggest_reply',
    response.usage.input_tokens,
    response.usage.output_tokens,
  );
  return parseSuggestions(raw);
}

export async function generateSuggestions(
  creatorId: string,
  conversationId: string,
): Promise<string[]> {
  const bot = await getBotConfig(creatorId);
  const messages = await prisma.message.findMany({
    where: { conversationId, mediaType: 'TEXT' },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: { senderId: true, text: true },
  });
  const history = messages
    .reverse()
    .filter((m) => m.text)
    .map((m) => ({
      role: (m.senderId === creatorId ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.text!,
    }));
  const effectiveHistory =
    history.length > 0
      ? history
      : [{ role: 'user' as const, content: 'Hi! I just joined your page.' }];
  const system = await buildSuggestContext(creatorId, bot);
  try {
    return await callSuggestLLM(system, effectiveHistory, creatorId);
  } catch (err) {
    logger.error({ err }, 'generateSuggestions failed');
    return [];
  }
}

export async function generateAutoReply(
  creatorId: string,
  conversationId: string,
): Promise<string | null> {
  const suggestions = await generateSuggestions(creatorId, conversationId);
  return suggestions[0] ?? null;
}

const SENDER_SELECT = { id: true, username: true, displayName: true, avatar: true };

export async function sendAutoReplyIfOffline(
  creatorId: string,
  fanId: string,
  conversationId: string,
  emitFn: (userId: string, event: string, data: unknown) => void,
): Promise<void> {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { role: true },
  });
  if (creator?.role !== 'CREATOR') return;
  const bot = await getBotConfig(creatorId);
  if (!bot?.suggestEnabled) return;
  const isOnline = await redis.sismember('online_users', creatorId);
  if (isOnline) return;
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
  const reply = await generateAutoReply(creatorId, conversationId);
  if (!reply) return;
  const botMsg = await prisma.message.create({
    data: { conversationId, senderId: creatorId, text: reply, mediaType: 'TEXT' },
    include: { sender: { select: SENDER_SELECT } },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessage: reply, lastMessageAt: new Date() },
  });
  emitFn(fanId, 'message:new', botMsg);
  emitFn(fanId, 'conversation:update', {
    conversationId,
    lastMessage: reply,
    lastMessageAt: new Date(),
  });
}

export async function polishMessage(creatorId: string, roughText: string): Promise<string | null> {
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { displayName: true },
  });
  const system = `You are helping ${creator?.displayName ?? 'a creator'} rewrite a rough message into a warm, engaging reply for a fan on Fansbook.
Keep the same meaning. Make it more natural and engaging. Keep it concise (1-3 sentences).
Return ONLY the polished message text, nothing else.`;
  try {
    const response = await getClient().messages.create({
      model: POLISH_MODEL,
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: `Rough message: "${roughText}"` }],
    });
    const polished = response.content[0]?.type === 'text' ? response.content[0].text.trim() : null;
    if (polished)
      await logAIUsage(
        creatorId,
        'polish',
        response.usage.input_tokens,
        response.usage.output_tokens,
      );
    return polished;
  } catch (err) {
    logger.error({ err }, 'polishMessage failed');
    return null;
  }
}
