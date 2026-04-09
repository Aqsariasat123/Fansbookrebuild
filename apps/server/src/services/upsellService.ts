import Anthropic from '@anthropic-ai/sdk';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const MODEL = 'claude-haiku-4-5-20251001';
const CACHE_HOURS = 0; // 0 = always regenerate (set to 6 after testing)
const MAX_SUGGESTIONS = 5;

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
  actionData?: Record<string, unknown>;
}

async function collectCreatorContext(creatorId: string): Promise<string> {
  const now = new Date();
  const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const days7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const days14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [creator, recentPosts, tips30d, activeFans, dormantFans, subCount, ppvSales] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: creatorId },
        select: { displayName: true, username: true, category: true },
      }),
      prisma.post.findMany({
        where: { authorId: creatorId, createdAt: { gte: days30 } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { createdAt: true, likeCount: true, commentCount: true, ppvPrice: true },
      }),
      prisma.tip.aggregate({
        where: { receiverId: creatorId, createdAt: { gte: days30 } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.subscription.count({
        where: { creatorId, status: 'ACTIVE', updatedAt: { gte: days7 } },
      }),
      prisma.subscription.findMany({
        where: { creatorId, status: 'ACTIVE', updatedAt: { lte: days14 } },
        take: 5,
        select: { subscriberId: true },
      }),
      prisma.subscription.count({ where: { creatorId, status: 'ACTIVE' } }),
      prisma.ppvPurchase.count({
        where: { post: { authorId: creatorId }, createdAt: { gte: days30 } },
      }),
    ]);

  const daysSinceLastPost =
    recentPosts.length > 0
      ? Math.floor((now.getTime() - recentPosts[0].createdAt.getTime()) / 86400000)
      : 999;

  const avgEngagement =
    recentPosts.length > 0
      ? Math.round(
          recentPosts.reduce((s, p) => s + p.likeCount + p.commentCount, 0) / recentPosts.length,
        )
      : 0;

  const hasPpvPosts = recentPosts.some((p) => p.ppvPrice && p.ppvPrice > 0);

  return `Creator: ${creator?.displayName} (@${creator?.username}), Category: ${creator?.category ?? 'general'}
Active subscribers: ${subCount}
Subscribers active in last 7 days: ${activeFans}
Dormant subscribers (no activity 14+ days): ${dormantFans.length}
Posts in last 30 days: ${recentPosts.length}
Days since last post: ${daysSinceLastPost}
Average engagement per post (likes + comments): ${avgEngagement}
Tips received in 30 days: ${tips30d._count} tips worth $${((tips30d._sum as { amount?: number | null }).amount ?? 0).toFixed(2)}
PPV sales in 30 days: ${ppvSales}
Has PPV content: ${hasPpvPosts ? 'yes' : 'no'}`;
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
  const context = await collectCreatorContext(creatorId);

  const system = `You are a revenue advisor for adult content creators on a subscription platform.
Analyze the creator's data and return exactly ${MAX_SUGGESTIONS} actionable suggestions to increase their revenue.
Each suggestion must be specific and immediately actionable.
Return ONLY a JSON array. Each item must have: type (POST_TIMING|FAN_ENGAGEMENT|PPV_OPPORTUNITY|REENGAGEMENT|CONTENT_STRATEGY), title (max 10 words), description (1-2 sentences, specific), priority (HIGH|MEDIUM|LOW), actionLabel (optional short CTA text), actionData (optional object).
Example: [{"type":"REENGAGEMENT","title":"Re-engage 3 dormant subscribers","description":"3 fans haven't interacted in 14+ days and may unsubscribe soon. A personal message could bring them back.","priority":"HIGH","actionLabel":"Send Message"}]`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 800,
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

  await prisma.upsellSuggestion.deleteMany({ where: { creatorId } });
  if (suggestions.length > 0) {
    await prisma.upsellSuggestion.createMany({
      data: suggestions.map((s) => ({
        creatorId,
        type: s.type,
        title: s.title,
        description: s.description,
        priority: s.priority,
        actionLabel: s.actionLabel ?? null,
        actionData: s.actionData ? (s.actionData as Prisma.InputJsonValue) : Prisma.JsonNull,
      })),
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
