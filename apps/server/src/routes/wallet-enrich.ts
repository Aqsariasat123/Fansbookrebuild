import { prisma } from '../config/database.js';

interface TxLike {
  referenceId: string | null;
  description: string | null;
}

/** Pull a `post {cuid}` reference out of older PPV-unlock descriptions that
 *  predate the referenceId being stored. */
function extractPostId(description: string | null): string | null {
  if (!description) return null;
  const m = description.match(/post ([a-z0-9]{20,32})/i);
  return m ? m[1] : null;
}

/**
 * Resolve each transaction's referenceId (and a few legacy description-embedded
 * IDs) to either the recipient *user* (for tips) or the linked *post* (for PPV
 * unlocks etc.) so the wallet's "Recipient" column can render a real link
 * rather than a bare cuid. Single batched query per type.
 */
export async function enrichWithRecipients<T extends TxLike>(items: T[]) {
  const refIds = items.map((i) => i.referenceId).filter((x): x is string => !!x);
  const descPostIds = items
    .map((i) => extractPostId(i.description))
    .filter((x): x is string => !!x);
  const allIds = [...new Set([...refIds, ...descPostIds])];

  if (allIds.length === 0) {
    return items.map((t) => ({ ...t, recipient: null, post: null }));
  }

  // Resolve in parallel — an ID will only match in one of the two tables.
  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: allIds } },
      select: { id: true, username: true, displayName: true, avatar: true },
    }),
    prisma.post.findMany({
      where: { id: { in: allIds } },
      select: { id: true, text: true },
    }),
  ]);
  const userMap = new Map(users.map((u) => [u.id, u]));
  const postMap = new Map(posts.map((p) => [p.id, p]));

  return items.map((t) => {
    const postId = t.referenceId ?? extractPostId(t.description);
    const recipient = t.referenceId ? (userMap.get(t.referenceId) ?? null) : null;
    const post = postId ? (postMap.get(postId) ?? null) : null;
    // If we matched a recipient user, that wins — never show the post link
    // alongside it (a TIP_SENT has the creator, not a post, as its target).
    return { ...t, recipient, post: recipient ? null : post };
  });
}
