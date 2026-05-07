import type { Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { sessionTransports, sessionProducers } from '../routes/live.js';
import type { DtlsParameters, MediaKind, RtpParameters } from 'mediasoup/types';

export function registerMediasoupHandlers(socket: Socket) {
  socket.on(
    'live:transport-connect',
    async (data: { sessionId: string; transportId: string; dtlsParameters: DtlsParameters }) => {
      try {
        const transports = sessionTransports.get(data.sessionId);
        if (!transports) return;
        for (const t of transports.values()) {
          if (t.id === data.transportId) {
            await t.connect({ dtlsParameters: data.dtlsParameters });
            break;
          }
        }
      } catch (err) {
        logger.error({ err }, 'Error in live:transport-connect');
      }
    },
  );

  socket.on(
    'live:produce',
    async (
      data: {
        sessionId: string;
        transportId: string;
        kind: MediaKind;
        rtpParameters: RtpParameters;
      },
      callback: (resp: { producerId: string }) => void,
    ) => {
      try {
        const transports = sessionTransports.get(data.sessionId);
        if (!transports) return;
        for (const t of transports.values()) {
          if (t.id === data.transportId) {
            const producer = await t.produce({
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });
            if (!sessionProducers.has(data.sessionId)) {
              sessionProducers.set(data.sessionId, []);
            }
            sessionProducers.get(data.sessionId)!.push(producer);
            if (callback) callback({ producerId: producer.id });
            break;
          }
        }
      } catch (err) {
        logger.error({ err }, 'Error in live:produce');
      }
    },
  );
}
