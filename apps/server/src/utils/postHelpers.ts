import { AppError } from '../middleware/errorHandler.js';

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

export function buildPostCreateData(userId: string, body: Record<string, string>) {
  const resolvedVis = resolveVisibility(body.visibility);
  const parsedPpv = parsePpvPrice(body.ppvPrice);
  return {
    authorId: userId,
    text: body.text?.trim() || '',
    visibility: resolvedVis,
    ...(parsedPpv && resolvedVis !== 'PUBLIC' ? { ppvPrice: parsedPpv } : {}),
    ...(body.isPinned === 'true' ? { isPinned: true } : {}),
  };
}
