import * as mediasoup from 'mediasoup';
import type { Router, WebRtcTransport, Worker, RtpCodecCapability } from 'mediasoup/types';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let worker: Worker | null = null;
let router: Router | null = null;

// preferredPayloadType is optional in RouterOptions despite being required in the type
const mediaCodecs = [
  {
    kind: 'audio' as const,
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video' as const,
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: { 'x-google-start-bitrate': 1000 },
  },
] as RtpCodecCapability[];

export async function initMediasoup(): Promise<Router> {
  worker = await mediasoup.createWorker({
    logLevel: 'warn',
    rtcMinPort: env.MEDIASOUP_MIN_PORT,
    rtcMaxPort: env.MEDIASOUP_MAX_PORT,
  });

  worker.on('died', () => {
    logger.error('mediasoup Worker died, restarting...');
    setTimeout(() => void initMediasoup(), 2000);
  });

  router = await worker.createRouter({ mediaCodecs });
  logger.info('mediasoup Worker + Router initialized');
  return router;
}

export function getRouter(): Router {
  if (!router) throw new Error('mediasoup Router not initialized');
  return router;
}

export async function createWebRtcTransport(): Promise<WebRtcTransport> {
  const r = getRouter();
  const transport = await r.createWebRtcTransport({
    listenIps: [{ ip: '0.0.0.0', announcedIp: env.MEDIASOUP_ANNOUNCED_IP }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  return transport;
}

export function getTransportOptions(transport: WebRtcTransport) {
  return {
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  };
}
