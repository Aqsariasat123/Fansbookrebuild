import sharp from 'sharp';

// Magic prefix "WM" written before the userId so we can distinguish a real
// watermark from random pixel noise in non-watermarked images.
// Layout: 2-char magic "WM" + 25-char CUID = 27 chars = 216 bits = 216 pixels.

const MAGIC = 'WM';
const CUID_LEN = 25;
const PAYLOAD = MAGIC + '\0'.repeat(CUID_LEN); // 27 chars
const BITS = PAYLOAD.length * 8; // 216

function encodeString(s: string, data: Buffer, ch: number): void {
  for (let bit = 0; bit < s.length * 8; bit++) {
    const charIdx = Math.floor(bit / 8);
    const bitPos = 7 - (bit % 8);
    const bitVal = (s.charCodeAt(charIdx) >> bitPos) & 1;
    data[bit * ch] = (data[bit * ch]! & 0xfe) | bitVal;
  }
}

function decodeString(data: Buffer, ch: number, len: number): string {
  let result = '';
  for (let c = 0; c < len; c++) {
    let code = 0;
    for (let b = 0; b < 8; b++) {
      code = (code << 1) | (data[(c * 8 + b) * ch]! & 1);
    }
    if (code === 0) break;
    result += String.fromCharCode(code);
  }
  return result;
}

export async function encodeUserIdIntoImage(inputBuffer: Buffer, userId: string): Promise<Buffer> {
  const payload = MAGIC + userId.padEnd(CUID_LEN, '\0').slice(0, CUID_LEN);
  const image = sharp(inputBuffer);
  const { width = 0, height = 0 } = await image.metadata();
  if (width * height < BITS) return inputBuffer;

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  encodeString(payload, data, ch);

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
    const decoded = decodeString(data, ch, MAGIC.length + CUID_LEN);

    if (!decoded.startsWith(MAGIC)) return null;
    const userId = decoded.slice(MAGIC.length);
    return userId.length > 0 ? userId : null;
  } catch {
    return null;
  }
}
