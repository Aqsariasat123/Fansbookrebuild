import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const SUGGEST_MODEL = 'claude-haiku-4-5-20251001';

function getClient(): Anthropic {
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

export async function logAIUsage(
  creatorId: string,
  feature: string,
  inputTokens: number,
  outputTokens: number,
) {
  const cost = (inputTokens * 0.00025 + outputTokens * 0.00125) / 1000;
  await prisma.aIUsageLog.create({ data: { creatorId, feature, inputTokens, outputTokens, cost } });
}

export async function updateToneProfile(creatorId: string): Promise<string | null> {
  const msgs = await prisma.message.findMany({
    where: { senderId: creatorId, mediaType: 'TEXT', text: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { text: true },
  });
  if (msgs.length < 10) return null;
  try {
    const response = await getClient().messages.create({
      model: SUGGEST_MODEL,
      max_tokens: 150,
      system: `Analyze these messages and describe the sender's communication style in 2-3 sentences.
Focus on: tone (formal/casual), emoji usage, message length, warmth. Be concise.`,
      messages: [
        {
          role: 'user',
          content: msgs
            .slice(0, 30)
            .map((m) => m.text)
            .join('\n---\n'),
        },
      ],
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
