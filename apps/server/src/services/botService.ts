import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Haiku: fast + cheap for real-time suggestions
const SUGGEST_MODEL = 'claude-haiku-4-5-20251001';
// Sonnet: better quality for polish
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
  data: {
    suggestEnabled?: boolean;
    polishEnabled?: boolean;
    persona?: string;
    greeting?: string;
  },
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
  return `You are helping ${creator?.displayName ?? 'a creator'} (@${creator?.username ?? 'creator'}) draft replies to fans on Fansbook.${toneNote}${personaNote}
Generate exactly 3 short, natural reply options. Each reply must be under 2 sentences. Be warm and authentic.
Return ONLY a JSON array of 3 strings, nothing else. Example: ["Reply 1", "Reply 2", "Reply 3"]`;
}

function parseSuggestions(raw: string): string[] {
  const m = raw.match(/\[[\s\S]*?\]/);
  if (m) {
    try {
      const p = JSON.parse(m[0]) as unknown;
      if (Array.isArray(p)) return (p as string[]).filter(Boolean).slice(0, 3);
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
    messages: history,
  });
  const raw = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
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

  // If no text history, use a generic opening prompt so AI still generates useful starters
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
    if (polished) {
      await logAIUsage(
        creatorId,
        'polish',
        response.usage.input_tokens,
        response.usage.output_tokens,
      );
    }
    return polished;
  } catch (err) {
    logger.error({ err }, 'polishMessage failed');
    return null;
  }
}

export async function updateToneProfile(creatorId: string): Promise<string | null> {
  const sentMessages = await prisma.message.findMany({
    where: { senderId: creatorId, mediaType: 'TEXT', text: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { text: true },
  });

  if (sentMessages.length < 10) return null;

  const sample = sentMessages
    .slice(0, 30)
    .map((m) => m.text)
    .join('\n---\n');

  const system = `Analyze these messages and describe the sender's communication style in 2-3 sentences.
Focus on: tone (formal/casual), emoji usage, message length, warmth. Be concise.
This will help an AI assistant match their writing style.`;

  try {
    const response = await getClient().messages.create({
      model: SUGGEST_MODEL,
      max_tokens: 150,
      system,
      messages: [{ role: 'user', content: sample }],
    });

    const profile = response.content[0]?.type === 'text' ? response.content[0].text.trim() : null;
    if (profile) {
      await prisma.creatorBot.upsert({
        where: { creatorId },
        create: { creatorId, toneProfile: profile },
        update: { toneProfile: profile },
      });
    }
    return profile;
  } catch (err) {
    logger.error({ err }, 'updateToneProfile failed');
    return null;
  }
}

export async function getMonthlyUsage(creatorId: string, month: string) {
  const [year, mon] = month.split('-').map(Number);
  const logs = await prisma.aIUsageLog.findMany({
    where: {
      creatorId,
      createdAt: { gte: new Date(year, mon - 1, 1), lt: new Date(year, mon, 1) },
    },
  });
  return logs.reduce(
    (acc, l) => {
      acc.inputTokens += l.inputTokens;
      acc.outputTokens += l.outputTokens;
      acc.cost += l.cost;
      if (!acc.byFeature[l.feature]) acc.byFeature[l.feature] = { count: 0, cost: 0 };
      acc.byFeature[l.feature].count++;
      acc.byFeature[l.feature].cost += l.cost;
      return acc;
    },
    {
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
      byFeature: {} as Record<string, { count: number; cost: number }>,
    },
  );
}

async function logAIUsage(
  creatorId: string,
  feature: string,
  inputTokens: number,
  outputTokens: number,
) {
  const cost = (inputTokens * 0.00025 + outputTokens * 0.00125) / 1000;
  await prisma.aIUsageLog.create({
    data: { creatorId, feature, inputTokens, outputTokens, cost },
  });
}
