import { prisma } from '../config/database.js';

interface TxLike {
  referenceId: string | null;
}

// Look up the user behind each transaction's referenceId (where present) and
// attach a `recipient` field so the FE can render a link to the creator.
export async function enrichWithRecipients<T extends TxLike>(items: T[]) {
  const ids = [...new Set(items.map((i) => i.referenceId).filter((x): x is string => !!x))];
  if (ids.length === 0) return items.map((t) => ({ ...t, recipient: null }));
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, username: true, displayName: true, avatar: true },
  });
  const map = new Map(users.map((u) => [u.id, u]));
  return items.map((t) => ({
    ...t,
    recipient: t.referenceId ? (map.get(t.referenceId) ?? null) : null,
  }));
}
