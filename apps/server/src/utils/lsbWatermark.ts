import sharp from 'sharp';

// Encodes 24 ASCII chars (CUID) into the least-significant bit of the R-channel
// of the first 192 pixels (24 chars × 8 bits). Operates on the raw pixel buffer.
// Only works reliably on lossless formats (WebP/PNG) — JPEG re-compression destroys it.

const CUID_LEN = 24;
const BITS = CUID_LEN * 8; // 192

export async function encodeUserIdIntoImage(inputBuffer: Buffer, userId: string): Promise<Buffer> {
  const id = userId.padEnd(CUID_LEN, '\0').slice(0, CUID_LEN);
  const image = sharp(inputBuffer);
  const { width = 0, height = 0 } = await image.metadata();

  if (width * height < BITS) return inputBuffer; // image too small — skip silently

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;

  for (let bit = 0; bit < BITS; bit++) {
    const charIdx = Math.floor(bit / 8);
    const bitPos = 7 - (bit % 8);
    const charCode = id.charCodeAt(charIdx);
    const bitVal = (charCode >> bitPos) & 1;
    const pixelOffset = bit * ch; // R channel of pixel `bit`
    data[pixelOffset] = (data[pixelOffset]! & 0xfe) | bitVal;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: ch as 1 | 2 | 3 | 4 },
  })
    .webp({ lossless: true })
    .toBuffer();
}

export async function decodeUserIdFromImage(inputBuffer: Buffer): Promise<string | null> {
  try {
    const image = sharp(inputBuffer);
    const { width = 0, height = 0 } = await image.metadata();
    if (width * height < BITS) return null;

    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    let result = '';

    for (let c = 0; c < CUID_LEN; c++) {
      let charCode = 0;
      for (let b = 0; b < 8; b++) {
        const bit = c * 8 + b;
        const pixelOffset = bit * ch;
        charCode = (charCode << 1) | (data[pixelOffset]! & 1);
      }
      if (charCode === 0) break;
      result += String.fromCharCode(charCode);
    }

    return result.length > 0 ? result : null;
  } catch {
    return null;
  }
}
