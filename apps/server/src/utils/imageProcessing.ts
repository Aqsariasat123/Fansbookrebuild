import sharp from 'sharp';
import path from 'path';
import { MEDIA_CONFIG } from '@fansbook/shared';

interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export async function resizeImage(
  inputPath: string,
  width: number,
  height: number,
): Promise<ProcessedImage> {
  const buffer = await sharp(inputPath)
    .resize(width, height, { fit: 'cover', withoutEnlargement: true })
    .webp({ quality: MEDIA_CONFIG.IMAGE_QUALITY })
    .toBuffer();

  const ext = '.webp';
  const basename = path.basename(inputPath, path.extname(inputPath));
  return { buffer, filename: `${basename}_${width}x${height}${ext}`, mimeType: 'image/webp' };
}

export async function createThumbnail(inputPath: string): Promise<ProcessedImage> {
  return resizeImage(inputPath, MEDIA_CONFIG.THUMBNAIL_WIDTH, MEDIA_CONFIG.THUMBNAIL_HEIGHT);
}

export async function processAvatar(inputPath: string): Promise<ProcessedImage> {
  const size = MEDIA_CONFIG.AVATAR_SIZE;
  return resizeImage(inputPath, size, size);
}

export async function processCover(inputPath: string): Promise<ProcessedImage> {
  return resizeImage(inputPath, MEDIA_CONFIG.COVER_WIDTH, MEDIA_CONFIG.COVER_HEIGHT);
}

export async function convertToWebP(inputPath: string): Promise<ProcessedImage> {
  const buffer = await sharp(inputPath).webp({ quality: MEDIA_CONFIG.IMAGE_QUALITY }).toBuffer();

  const basename = path.basename(inputPath, path.extname(inputPath));
  return { buffer, filename: `${basename}.webp`, mimeType: 'image/webp' };
}
