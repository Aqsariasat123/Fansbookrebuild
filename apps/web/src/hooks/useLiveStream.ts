import { useCallback, useEffect } from 'react';
import { Device, types as mediasoupTypes } from 'mediasoup-client';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useLiveStore } from '../stores/liveStore';
import type { LiveChatMessage } from '@fansbook/shared';

// Module-level state — persists across component navigations
let msDevice: Device | null = null;
let sendTransport: mediasoupTypes.Transport | null = null;
let recvTransport: mediasoupTypes.Transport | null = null;
let localStream: MediaStream | null = null;

const gs = () => useLiveStore.getState();

export function useLiveStream() {
  // Socket event listeners for live chat + viewer count
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleViewerCount = (data: { sessionId: string; count: number }) => {
      gs().setViewerCount(data.count);
    };
    const handleChat = (data: LiveChatMessage) => {
      gs().addChat(data);
    };
    const handleEnded = () => {
      gs().setIsLive(false);
    };

    socket.on('live:viewer-count', handleViewerCount);
    socket.on('live:chat', handleChat);
    socket.on('live:ended', handleEnded);

    return () => {
      socket.off('live:viewer-count', handleViewerCount);
      socket.off('live:chat', handleChat);
      socket.off('live:ended', handleEnded);
    };
  }, []);

  // ─── Creator: start broadcasting ──────────────────────

  const startBroadcast = useCallback(async (title: string, videoEl: HTMLVideoElement | null) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      audio: true,
    });
    localStream = stream;

    if (videoEl) {
      videoEl.srcObject = stream;
      videoEl.muted = true;
      await videoEl.play();
    }

    // 1. Start session + get producer transport options
    const { data: startData } = await api.post('/live/start', { title });
    const { sessionId, transportOptions } = startData.data;
    gs().setSession(sessionId);
    gs().setIsLive(true);

    // 2. Load mediasoup device with router capabilities
    const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
    const device = new Device();
    await device.load({ routerRtpCapabilities: capData.data });
    msDevice = device;

    // 3. Create send transport
    const transport = device.createSendTransport(transportOptions);
    sendTransport = transport;

    transport.on('connect', ({ dtlsParameters }, callback) => {
      const socket = getSocket();
      socket?.emit('live:transport-connect', {
        sessionId,
        transportId: transport.id,
        dtlsParameters,
      });
      callback();
    });

    transport.on('produce', async ({ kind, rtpParameters }, callback) => {
      const { data: produceRes } = await api.post(`/live/${sessionId}/produce`, {
        kind,
        rtpParameters,
      });
      callback({ id: produceRes.data.producerId });
    });

    // 4. Produce audio + video tracks
    for (const track of stream.getTracks()) {
      await transport.produce({ track });
    }

    // 5. Join socket room
    const socket = getSocket();
    socket?.emit('live:join', { sessionId });

    return sessionId;
  }, []);

  const stopBroadcast = useCallback(async () => {
    const sessionId = gs().sessionId;
    if (!sessionId) return;

    const socket = getSocket();
    socket?.emit('live:leave', { sessionId });

    await api.post(`/live/${sessionId}/end`).catch(() => {});

    sendTransport?.close();
    localStream?.getTracks().forEach((t) => t.stop());
    sendTransport = null;
    localStream = null;
    gs().reset();
  }, []);

  // ─── Viewer: join live ────────────────────────────────

  const joinLive = useCallback(async (sessionId: string, videoEl: HTMLVideoElement | null) => {
    gs().setSession(sessionId);

    // 1. Load device with router caps
    const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
    const device = new Device();
    await device.load({ routerRtpCapabilities: capData.data });
    msDevice = device;

    // 2. Create recv transport
    const { data: tData } = await api.post(`/live/${sessionId}/transport`);
    const recv = device.createRecvTransport(tData.data.transportOptions);
    recvTransport = recv;

    recv.on('connect', ({ dtlsParameters }, callback) => {
      const socket = getSocket();
      socket?.emit('live:transport-connect', {
        sessionId,
        transportId: recv.id,
        dtlsParameters,
      });
      callback();
    });

    // 3. Fetch existing chat messages
    const { data: chatData } = await api.get(`/live/${sessionId}/chat`);
    for (const msg of chatData.data ?? []) {
      gs().addChat(msg);
    }

    // 4. Join socket room
    const socket = getSocket();
    socket?.emit('live:join', { sessionId });
    gs().setIsLive(true);

    return { device, recvTransport: recv, videoEl };
  }, []);

  const consumeTrack = useCallback(
    async (sessionId: string, producerId: string, videoEl: HTMLVideoElement | null) => {
      if (!msDevice || !recvTransport) return;

      const { data: consumeData } = await api.post(`/live/${sessionId}/consume`, {
        producerId,
        rtpCapabilities: msDevice.rtpCapabilities,
      });

      const consumer = await recvTransport.consume({
        id: consumeData.data.consumerId,
        producerId: consumeData.data.producerId,
        kind: consumeData.data.kind,
        rtpParameters: consumeData.data.rtpParameters,
      });

      await consumer.resume();

      if (videoEl) {
        const stream = (videoEl.srcObject as MediaStream | null) ?? new MediaStream();
        stream.addTrack(consumer.track);
        videoEl.srcObject = stream;
        await videoEl.play().catch(() => {});
      }

      return consumer;
    },
    [],
  );

  const leaveLive = useCallback(() => {
    const sessionId = gs().sessionId;
    const socket = getSocket();
    if (socket && sessionId) {
      socket.emit('live:leave', { sessionId });
    }
    recvTransport?.close();
    recvTransport = null;
    gs().reset();
  }, []);

  const sendChat = useCallback((text: string) => {
    const sessionId = gs().sessionId;
    const socket = getSocket();
    if (socket && sessionId && text.trim()) {
      socket.emit('live:chat', { sessionId, text });
    }
  }, []);

  const getLocalStream = useCallback(() => localStream, []);

  return {
    startBroadcast,
    stopBroadcast,
    joinLive,
    consumeTrack,
    leaveLive,
    sendChat,
    getLocalStream,
  };
}
