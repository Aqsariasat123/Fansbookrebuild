import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  StartContentModerationCommand,
  GetContentModerationCommand,
} from '@aws-sdk/client-rekognition';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { getS3 } from '../config/s3.js';

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
  timestamp?: number;
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

export async function startVideoModeration(
  postMediaId: string,
  localPath: string,
): Promise<{ jobId: string; s3Key: string } | null> {
  const client = getClient();
  if (!client || !env.AWS_BUCKET) {
    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: { moderationStatus: 'SKIPPED' },
    });
    return null;
  }

  const ext = path.extname(localPath) || '.mp4';
  const s3Key = `moderation-temp/${postMediaId}${ext}`;

  try {
    const fileBytes = fs.readFileSync(localPath);
    await getS3().send(
      new PutObjectCommand({ Bucket: env.AWS_BUCKET, Key: s3Key, Body: fileBytes }),
    );

    const result = await client.send(
      new StartContentModerationCommand({
        Video: { S3Object: { Bucket: env.AWS_BUCKET, Name: s3Key } },
        MinConfidence: CONFIDENCE_THRESHOLD,
      }),
    );

    logger.info({ postMediaId, jobId: result.JobId }, 'Video moderation job started');
    return { jobId: result.JobId!, s3Key };
  } catch (err) {
    logger.error({ err, postMediaId }, 'Failed to start video moderation');
    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: { moderationStatus: 'SKIPPED' },
    });
    return null;
  }
}

export async function checkVideoModerationJob(
  jobId: string,
  postMediaId: string,
  s3TempKey: string,
): Promise<boolean> {
  const client = getClient();
  if (!client) return true;

  try {
    const result = await client.send(new GetContentModerationCommand({ JobId: jobId }));
    if (result.JobStatus === 'IN_PROGRESS') return false;

    const labels: ModerationLabel[] = (result.ModerationLabels ?? []).map((l) => ({
      name: l.ModerationLabel?.Name ?? '',
      confidence: Math.round((l.ModerationLabel?.Confidence ?? 0) * 100) / 100,
      parentName: l.ModerationLabel?.ParentName ?? undefined,
      timestamp: l.Timestamp ?? undefined,
    }));

    const status = labels.length > 0 ? 'FLAGGED' : 'SAFE';
    const topScore = labels.length > 0 ? labels[0].confidence : 0;

    await prisma.postMedia.update({
      where: { id: postMediaId },
      data: {
        moderationStatus: status,
        moderationLabels: labels as object[],
        moderationScore: topScore,
      },
    });

    if (status === 'FLAGGED')
      logger.warn({ postMediaId, labels }, 'Video content flagged by Rekognition');

    // Clean up temp S3 file
    getS3()
      .send(new DeleteObjectCommand({ Bucket: env.AWS_BUCKET, Key: s3TempKey }))
      .catch(() => {});

    return true;
  } catch (err) {
    logger.error({ err, postMediaId, jobId }, 'Failed to check video moderation job');
    return false;
  }
}
