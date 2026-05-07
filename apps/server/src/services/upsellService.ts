import Anthropic from '@anthropic-ai/sdk';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { ALLOWED_ROUTES, buildUpsellSystemPrompt } from './upsellPrompt.js';
import { collectCreatorContext } from './upsellContext.js';

const MODEL = 'claude-haiku-4-5-20251001';
const CACHE_HOURS = 168; // 7 days — only regenerate when user clicks Refresh
const MAX_SUGGESTIONS = 8;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

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

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1400,
    system,
    messages: [{ role: 'user', content: context }],
  });

  const raw = response.content[0]?.type === 'text' ? response.content[0].text : '[]';
  const suggestions = parseSuggestions(raw);

  const cost =
    (response.usage.input_tokens * 0.00025 + response.usage.output_tokens * 0.00125) / 1000;
  await prisma.aIUsageLog.create({
    data: {
      creatorId,
      feature: 'upsell',
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
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
