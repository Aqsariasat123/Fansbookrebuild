/* eslint-disable no-console */
/**
 * One-time script: embed watermark into all existing post images.
 * Run with: npx tsx src/scripts/backfill-watermarks.ts
 */
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { embedWatermark } from '../utils/imageProcessing.js';

const uploadsDir = path.join(process.cwd(), 'uploads', 'posts');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.avif']);

async function main() {
  const rows = await prisma.postMedia.findMany({
    where: { type: 'IMAGE' },
    select: {
      id: true,
      url: true,
      post: { select: { author: { select: { username: true } } } },
    },
  });

  console.log(`Found ${rows.length} image records.`);
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const filename = row.url.replace('/api/posts/file/', '');
    const filePath = path.join(uploadsDir, filename);
    const ext = path.extname(filename).toLowerCase();

    if (!IMAGE_EXTS.has(ext)) {
      skipped++;
      continue;
    }
    if (!fs.existsSync(filePath)) {
      console.warn(`  MISSING: ${filename}`);
      skipped++;
      continue;
    }

    const username = row.post?.author?.username ?? 'fansbook';
    try {
      await embedWatermark(filePath, username);
      console.log(`  ✓ ${filename} (@${username})`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${filename}`, err);
      failed++;
    }
  }

  console.log(`\nDone. ✓${ok}  skipped:${skipped}  failed:${failed}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
