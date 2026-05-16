import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { ALLOWED_ROUTES, buildUpsellSystemPrompt } from './upsellPrompt.js';
import { collectCreatorContext } from './upsellContext.js';
import { llmComplete } from './llmClient.js';

const FALLBACK_MODEL = 'claude-haiku-4-5-20251001';
const CACHE_HOURS = 168; // 7 days — only regenerate when user clicks Refresh
const MAX_SUGGESTIONS = 8;

interface SuggestionRaw {
  type: string;
  title: string;
  description: string;
  priority: string;
  actionLabel?: string;
  route?: string;
  actionData?: Record<string, unknown>;
}

function parseSuggestions(raw: string): SuggestionRaw[] {
  const m = raw.match(/\[[\s\S]*\]/);
  if (!m) return [];
  try {
    const parsed = JSON.parse(m[0]) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as unknown[])
      .filter(
        (s): s is SuggestionRaw =>
          typeof s === 'object' &&
          s !== null &&
          typeof (s as SuggestionRaw).title === 'string' &&
          typeof (s as SuggestionRaw).description === 'string',
      )
      .slice(0, MAX_SUGGESTIONS);
  } catch {
    return [];
  }
}

export async function generateUpsellSuggestions(creatorId: string): Promise<void> {
  const [context, dismissed] = await Promise.all([
    collectCreatorContext(creatorId),
    prisma.upsellSuggestion.findMany({
      where: { creatorId, dismissed: true },
      select: { title: true, type: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const avoidNote =
    dismissed.length > 0
      ? `\nDo NOT repeat these already-dismissed suggestions: ${dismissed.map((d) => `"${d.title}"`).join(', ')}. Generate completely different ones.`
      : '';

  const system = buildUpsellSystemPrompt(MAX_SUGGESTIONS, avoidNote);

  const c = await llmComplete({
    system,
    messages: [{ role: 'user', content: context }],
    maxTokens: 1400,
    anthropicModel: FALLBACK_MODEL,
  });

  const raw = c.text || '[]';
  const suggestions = parseSuggestions(raw);

  const cost = (c.inputTokens * 0.00025 + c.outputTokens * 0.00125) / 1000;
  await prisma.aIUsageLog.create({
    data: {
      creatorId,
      feature: 'upsell',
      inputTokens: c.inputTokens,
      outputTokens: c.outputTokens,
      cost,
    },
  });

  // Only delete non-dismissed — dismissed ones stay so they don't regenerate
  await prisma.upsellSuggestion.deleteMany({ where: { creatorId, dismissed: false } });
  if (suggestions.length > 0) {
    await prisma.upsellSuggestion.createMany({
      data: suggestions.map((s) => {
        const route = s.route && ALLOWED_ROUTES.has(s.route) ? s.route : null;
        const actionData = { ...(s.actionData ?? {}), ...(route ? { route } : {}) };
        return {
          creatorId,
          type: s.type,
          title: s.title,
          description: s.description,
          priority: s.priority,
          actionLabel: s.actionLabel ?? null,
          actionData:
            Object.keys(actionData).length > 0
              ? (actionData as Prisma.InputJsonValue)
              : Prisma.JsonNull,
        };
      }),
    });
  }
}

export async function getSuggestions(creatorId: string) {
  const recent = await prisma.upsellSuggestion.findFirst({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
  });

  const stale =
    !recent || new Date().getTime() - recent.createdAt.getTime() > CACHE_HOURS * 60 * 60 * 1000;

  if (stale) {
    try {
      await generateUpsellSuggestions(creatorId);
    } catch (err) {
      logger.error({ err }, 'generateUpsellSuggestions failed');
    }
  }

  return prisma.upsellSuggestion.findMany({
    where: { creatorId, dismissed: false },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function dismissSuggestion(id: string, creatorId: string) {
  return prisma.upsellSuggestion.updateMany({
    where: { id, creatorId },
    data: { dismissed: true },
  });
}
