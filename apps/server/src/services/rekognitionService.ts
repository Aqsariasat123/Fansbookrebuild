import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const CONFIDENCE_THRESHOLD = 75;

function getClient(): RekognitionClient | null {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_REGION) return null;
  return new RekognitionClient({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

interface ModerationLabel {
  name: string;
  confidence: number;
  parentName?: string;
}

export async function moderateImage(postMediaId: string, filePath: string): Promise<void> {
  const client = getClient();
  if (!client) {
    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: { moderationStatus: 'SKIPPED' },
    });
    return;
  }

  try {
    const imageBytes = fs.readFileSync(filePath);
    const command = new DetectModerationLabelsCommand({
      Image: { Bytes: imageBytes },
      MinConfidence: CONFIDENCE_THRESHOLD,
    });
    const result = await client.send(command);
    const labels: ModerationLabel[] = (result.ModerationLabels ?? []).map((l) => ({
      name: l.Name ?? '',
      confidence: Math.round((l.Confidence ?? 0) * 100) / 100,
      parentName: l.ParentName ?? undefined,
    }));

    const topScore = labels.length > 0 ? labels[0].confidence : 0;
    const status = labels.length > 0 ? 'FLAGGED' : 'SAFE';

    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: {
        moderationStatus: status,
        moderationLabels: labels as object[],
        moderationScore: topScore,
      },
    });

    if (status === 'FLAGGED') {
      logger.warn({ postMediaId, labels }, 'Content flagged by Rekognition');
    }
  } catch (err) {
    logger.error({ err, postMediaId }, 'Rekognition moderation failed');
    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: { moderationStatus: 'SKIPPED' },
    });
  }
}
