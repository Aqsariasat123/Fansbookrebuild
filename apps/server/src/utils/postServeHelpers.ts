import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export function extractBearerToken(
  query: Record<string, unknown>,
  authorization: string | undefined,
): string | undefined {
  const q = query['token'] as string | undefined;
  if (q) return q;
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
}

export function resolveViewerId(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const secret = process.env['JWT_SECRET'] ?? '';
    const payload = jwt.verify(token, secret) as { userId?: string };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function isWatermarkEnabled(sanitized: string): Promise<boolean> {
  const media = await prisma.postMedia.findFirst({
    where: { url: `/api/posts/file/${sanitized}` },
    include: { post: { select: { watermarkEnabled: true } } },
  });
  return media?.post?.watermarkEnabled === true;
}
