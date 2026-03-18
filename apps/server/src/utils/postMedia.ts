import { prisma } from '../config/database.js';
import { embedWatermark } from './imageProcessing.js';

export async function createPostMedia(
  postId: string,
  files: Express.Multer.File[],
  username: string,
) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isImage = file.mimetype.startsWith('image/');
    if (isImage) {
      try {
        await embedWatermark(file.path, username);
      } catch {
        // watermark failure should not block the upload
      }
    }
    await prisma.postMedia.create({
      data: {
        postId,
        url: `/api/posts/file/${file.filename}`,
        type: isImage ? 'IMAGE' : 'VIDEO',
        order: i,
      },
    });
  }
}
