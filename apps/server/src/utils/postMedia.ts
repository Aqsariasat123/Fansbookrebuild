import { prisma } from '../config/database.js';
import { embedWatermark } from './imageProcessing.js';
import { moderateImage, startVideoModeration } from '../services/rekognitionService.js';
import { videoModerationQueue } from '../jobs/queue.js';

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
    const media = await prisma.postMedia.create({
      data: {
        postId,
        url: `/api/posts/file/${file.filename}`,
        type: isImage ? 'IMAGE' : 'VIDEO',
        order: i,
        moderationStatus: 'PENDING',
      },
    });
    if (isImage) {
      moderateImage(media.id, file.path).catch(() => {});
    } else {
      startVideoModeration(media.id, file.path)
        .then((result) => {
          if (result) {
            videoModerationQueue
              .add(
                'poll',
                { jobId: result.jobId, postMediaId: media.id, s3TempKey: result.s3Key, attempt: 0 },
                { delay: 30_000 },
              )
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  }
}
