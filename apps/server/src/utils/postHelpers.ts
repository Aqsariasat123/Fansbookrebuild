import { AppError } from '../middleware/errorHandler.js';

export function buildPostUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (body.text !== undefined) {
    if (typeof body.text !== 'string' || (body.text as string).trim().length === 0)
      throw new AppError(400, 'Text cannot be empty');
    data.text = (body.text as string).trim();
  }
  if (body.visibility !== undefined) {
    if (!['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'].includes(body.visibility as string))
      throw new AppError(400, 'Invalid visibility value');
    data.visibility = body.visibility;
  }
  if (body.ppvPrice !== undefined) {
    const price = parseFloat(body.ppvPrice as string);
    data.ppvPrice = isNaN(price) || price <= 0 ? null : price;
  }
  return data;
}

export type PostVisibility = 'PUBLIC' | 'SUBSCRIBERS' | 'TIER_SPECIFIC';
const VALID_VISIBILITIES: PostVisibility[] = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];

export function resolveVisibility(visibility?: string): PostVisibility {
  return VALID_VISIBILITIES.includes(visibility as PostVisibility)
    ? (visibility as PostVisibility)
    : 'PUBLIC';
}

export function parsePpvPrice(ppvPrice?: string): number | null {
  if (!ppvPrice) return null;
  const parsed = parseFloat(ppvPrice);
  if (parsed < 1 || parsed > 500) {
    throw new AppError(400, 'PPV price must be between $1 and $500');
  }
  return parsed;
}

/** Append explicit hashtags (entered via the HashtagPanel) to the post text so
 *  they're persisted and rendered by the existing #tag link logic. */
function withHashtags(text: string, hashtagsCsv?: string): string {
  if (!hashtagsCsv) return text;
  const tags = hashtagsCsv
    .split(',')
    .map((t) => t.trim().replace(/^#+/, ''))
    .filter(Boolean);
  if (tags.length === 0) return text;
  const tagStr = tags.map((t) => `#${t}`).join(' ');
  const base = text.trim();
  return base ? `${base}\n\n${tagStr}` : tagStr;
}

export function buildPostCreateData(userId: string, body: Record<string, string>) {
  const resolvedVis = resolveVisibility(body.visibility);
  const parsedPpv = parsePpvPrice(body.ppvPrice);
  const text = withHashtags(body.text?.trim() || '', body.hashtags);
  return {
    authorId: userId,
    text,
    visibility: resolvedVis,
    ...(parsedPpv ? { ppvPrice: parsedPpv } : {}),
    ...(body.isPinned === 'true' ? { isPinned: true } : {}),
    watermarkEnabled: body.watermarkEnabled !== 'false',
  };
}
