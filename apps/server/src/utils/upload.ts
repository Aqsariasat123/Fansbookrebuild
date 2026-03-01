import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3, isS3Enabled } from '../config/s3.js';
import { env } from '../config/env.js';
import crypto from 'crypto';

const EXPIRY_SECONDS = 300; // 5 minutes

interface PresignedResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

/**
 * Generate a presigned S3 PUT URL for direct browser upload.
 */
export async function generatePresignedUrl(
  category: string,
  contentType: string,
  extension: string,
): Promise<PresignedResult> {
  const key = `${category}/${crypto.randomUUID()}${extension}`;
  const bucket = env.AWS_BUCKET;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getS3(), command, { expiresIn: EXPIRY_SECONDS });
  const fileUrl = `https://${bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl, key };
}

/**
 * Delete a file from S3 by key.
 */
export async function deleteS3File(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  });
  await getS3().send(command);
}

/**
 * Resolve a file URL — handles both local paths and S3 URLs transparently.
 */
export function resolveFileUrl(urlOrPath: string | null | undefined): string | null {
  if (!urlOrPath) return null;
  // Already a full URL
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) return urlOrPath;
  // Local path — prepend API base
  return urlOrPath;
}

/**
 * Check if S3 is the active upload provider.
 */
export { isS3Enabled };
