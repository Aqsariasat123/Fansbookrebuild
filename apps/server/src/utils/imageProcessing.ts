import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
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

export async function embedWatermark(filePath: string, username: string): Promise<void> {
  const image = sharp(filePath);
  const { width = 800, height = 600 } = await image.metadata();

  const fontSize = Math.max(13, Math.round(width * 0.022));
  const padding = Math.round(fontSize * 0.65);
  const label = `INSCRIO  ·  inscrio.com/u/${username}`;
  const approxCharWidth = fontSize * 0.55;
  const boxW = Math.round(label.length * approxCharWidth + padding * 2 + 4);
  const boxH = fontSize + padding * 2;
  const margin = Math.round(Math.min(width, height) * 0.018);

  const svg = Buffer.from(
    `<svg width="${boxW}" height="${boxH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${boxW}" height="${boxH}" rx="5" fill="rgba(0,0,0,0.58)"/>
      <text x="${padding}" y="${fontSize + padding - 3}"
        font-family="Arial,Helvetica,sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="rgba(255,255,255,0.92)"
        letter-spacing="0.3">${label}</text>
    </svg>`,
  );

  const output = await sharp(filePath)
    .composite([{ input: svg, gravity: 'southeast', left: margin, top: height - boxH - margin }])
    .toBuffer();

  fs.writeFileSync(filePath, output);
}
