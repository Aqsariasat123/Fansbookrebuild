import { Worker } from 'bullmq';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import Anthropic from '@anthropic-ai/sdk';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
const CLIPS_DIR = path.join(process.cwd(), 'uploads', 'ai-clips');
const THUMBS_DIR = path.join(process.cwd(), 'uploads', 'ai-thumbs');

function ensureDirs() {
  [CLIPS_DIR, THUMBS_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, meta) => {
      if (err) return reject(err);
      resolve(meta.format.duration ?? 0);
    });
  });
}

function extractFrames(
  filePath: string,
  timestamps: number[],
  outDir: string,
  jobId: string,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const paths: string[] = timestamps.map((t) =>
      path.join(outDir, `${jobId}-frame-${Math.round(t)}.jpg`),
    );
    let done = 0;
    timestamps.forEach((t, i) => {
      ffmpeg(filePath)
        .seekInput(t)
        .frames(1)
        .output(paths[i])
        .on('end', () => {
          done++;
          if (done === timestamps.length) resolve(paths);
        })
        .on('error', reject)
        .run();
    });
  });
}

function cutClip(input: string, start: number, end: number, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .seekInput(start)
      .duration(end - start)
      .output(outPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

function extractThumbnail(clipPath: string, thumbPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(clipPath)
      .seekInput(0.5)
      .frames(1)
      .output(thumbPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

interface ClipMoment {
  startSec: number;
  endSec: number;
  title: string;
  score: 'HIGH' | 'MEDIUM';
  reason: string;
}

async function analyzeWithClaude(
  duration: number,
  framePaths: string[],
  sampleTimestamps: number[],
): Promise<ClipMoment[]> {
  const frameContents: Anthropic.ImageBlockParam[] = [];
  for (const fp of framePaths) {
    if (!fs.existsSync(fp)) continue;
    const data = fs.readFileSync(fp).toString('base64');
    frameContents.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data },
    });
  }

  const prompt = `You are analyzing frames from a video that is ${Math.round(duration)} seconds long.
The frames were taken at timestamps: ${sampleTimestamps.map((t) => `${Math.round(t)}s`).join(', ')}.

Identify the 3-5 most engaging/viral moments in this video suitable for short clips (15-60 seconds each).
Respond ONLY with a JSON array, no markdown, no explanation:
[
  { "startSec": number, "endSec": number, "title": "short clip title", "score": "HIGH" or "MEDIUM", "reason": "why this moment is engaging" }
]
Rules:
- startSec and endSec must be within 0 and ${Math.round(duration)}
- Each clip must be between 15 and 60 seconds long
- Do not overlap clips
- Prefer moments with visible action or expression`;

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: [...frameContents, { type: 'text', text: prompt }] }],
  });

  const text = response.content.find((b) => b.type === 'text')?.text ?? '[]';
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned) as ClipMoment[];
}

export function startAIClipsWorker() {
  const worker = new Worker(
    'ai-clips',
    async (job) => {
      const { jobId } = job.data as { jobId: string };
      ensureDirs();

      const clipJob = await prisma.aIClipJob.findUnique({ where: { id: jobId } });
      if (!clipJob) throw new Error('Job not found');

      const update = (status: string, errorMessage?: string) =>
        prisma.aIClipJob.update({
          where: { id: jobId },
          data: { status: status as never, errorMessage: errorMessage ?? null },
        });

      try {
        await update('EXTRACTING');
        const duration = await getVideoDuration(clipJob.originalFile);
        await prisma.aIClipJob.update({
          where: { id: jobId },
          data: { durationSec: Math.round(duration) },
        });

        // Sample frames evenly across the video (up to 8 frames)
        const frameCount = Math.min(8, Math.floor(duration / 30));
        const interval = duration / (frameCount + 1);
        const timestamps = Array.from({ length: frameCount }, (_, i) =>
          Math.round(interval * (i + 1)),
        );

        const framePaths = await extractFrames(clipJob.originalFile, timestamps, THUMBS_DIR, jobId);

        await update('ANALYZING');
        const moments = await analyzeWithClaude(duration, framePaths, timestamps);

        await update('CUTTING');
        for (const moment of moments) {
          const clipFile = `${jobId}-clip-${Math.round(moment.startSec)}.mp4`;
          const clipPath = path.join(CLIPS_DIR, clipFile);
          const thumbFile = `${jobId}-thumb-${Math.round(moment.startSec)}.jpg`;
          const thumbPath = path.join(THUMBS_DIR, thumbFile);

          await cutClip(clipJob.originalFile, moment.startSec, moment.endSec, clipPath);
          await extractThumbnail(clipPath, thumbPath);

          await prisma.aIClip.create({
            data: {
              jobId,
              userId: clipJob.userId,
              filePath: `/api/creator/clips/file/${clipFile}`,
              thumbnailPath: `/api/creator/clips/thumb/${thumbFile}`,
              title: moment.title,
              startSec: moment.startSec,
              endSec: moment.endSec,
              score: moment.score,
              reason: moment.reason,
            },
          });
        }

        // Clean up temp frames
        framePaths.forEach((fp) => {
          try {
            fs.unlinkSync(fp);
          } catch {
            /* ignore */
          }
        });

        await update('DONE');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await update('FAILED', msg);
        throw err;
      }
    },
    { connection: { url: env.REDIS_URL }, concurrency: 2 },
  );

  worker.on('failed', (job, err) =>
    logger.error({ jobId: job?.data?.jobId, err }, 'AI clips job failed'),
  );
  logger.info('AI clips worker started');
  return worker;
}
