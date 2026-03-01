import { useCallback, useEffect, useRef } from 'react';
import { Device, types as mediasoupTypes } from 'mediasoup-client';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useLiveStore } from '../stores/liveStore';
import type { LiveChatMessage } from '@fansbook/shared';

export function useLiveStream() {
  const store = useLiveStore();
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<mediasoupTypes.Transport | null>(null);
  const recvTransportRef = useRef<mediasoupTypes.Transport | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Socket event listeners for live chat + viewer count
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleViewerCount = (data: { sessionId: string; count: number }) => {
      store.setViewerCount(data.count);
    };
    const handleChat = (data: LiveChatMessage) => {
      store.addChat(data);
    };
    const handleEnded = () => {
      store.setIsLive(false);
    };

    socket.on('live:viewer-count', handleViewerCount);
    socket.on('live:chat', handleChat);
    socket.on('live:ended', handleEnded);

    return () => {
      socket.off('live:viewer-count', handleViewerCount);
      socket.off('live:chat', handleChat);
      socket.off('live:ended', handleEnded);
    };
  }, [store]);

  // ─── Creator: start broadcasting ──────────────────────

  const startBroadcast = useCallback(
    async (title: string, videoEl: HTMLVideoElement | null) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true,
      });
      localStreamRef.current = stream;

      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.muted = true;
        await videoEl.play();
      }

      // 1. Start session + get producer transport options
      const { data: startData } = await api.post('/live/start', { title });
      const { sessionId, transportOptions } = startData.data;
      store.setSession(sessionId);
      store.setIsLive(true);

      // 2. Load mediasoup device with router capabilities
      const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
      const device = new Device();
      await device.load({ routerRtpCapabilities: capData.data });
      deviceRef.current = device;

      // 3. Create send transport
      const sendTransport = device.createSendTransport(transportOptions);
      sendTransportRef.current = sendTransport;

      sendTransport.on('connect', ({ dtlsParameters }, callback) => {
        const socket = getSocket();
        socket?.emit('live:transport-connect', {
          sessionId,
          transportId: sendTransport.id,
          dtlsParameters,
        });
        callback();
      });

      sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
        const { data: produceRes } = await api.post(`/live/${sessionId}/produce`, {
          kind,
          rtpParameters,
        });
        callback({ id: produceRes.data.producerId });
      });

      // 4. Produce audio + video tracks
      for (const track of stream.getTracks()) {
        await sendTransport.produce({ track });
      }

      // 5. Join socket room
      const socket = getSocket();
      socket?.emit('live:join', { sessionId });

      return sessionId;
    },
    [store],
  );

  const stopBroadcast = useCallback(async () => {
    const sessionId = useLiveStore.getState().sessionId;
    if (!sessionId) return;

    const socket = getSocket();
    socket?.emit('live:leave', { sessionId });

    await api.post(`/live/${sessionId}/end`).catch(() => {});

    sendTransportRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    sendTransportRef.current = null;
    localStreamRef.current = null;
    store.reset();
  }, [store]);

  // ─── Viewer: join live ────────────────────────────────

  const joinLive = useCallback(
    async (sessionId: string, videoEl: HTMLVideoElement | null) => {
      store.setSession(sessionId);

      // 1. Load device with router caps
      const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
      const device = new Device();
      await device.load({ routerRtpCapabilities: capData.data });
      deviceRef.current = device;

      // 2. Create recv transport
      const { data: tData } = await api.post(`/live/${sessionId}/transport`);
      const recvTransport = device.createRecvTransport(tData.data.transportOptions);
      recvTransportRef.current = recvTransport;

      recvTransport.on('connect', ({ dtlsParameters }, callback) => {
        const socket = getSocket();
        socket?.emit('live:transport-connect', {
          sessionId,
          transportId: recvTransport.id,
          dtlsParameters,
        });
        callback();
      });

      // 3. Fetch existing chat messages
      const { data: chatData } = await api.get(`/live/${sessionId}/chat`);
      for (const msg of chatData.data ?? []) {
        store.addChat(msg);
      }

      // 4. Join socket room
      const socket = getSocket();
      socket?.emit('live:join', { sessionId });
      store.setIsLive(true);

      return { device, recvTransport, videoEl };
    },
    [store],
  );

  const consumeTrack = useCallback(
    async (sessionId: string, producerId: string, videoEl: HTMLVideoElement | null) => {
      const device = deviceRef.current;
      const recvTransport = recvTransportRef.current;
      if (!device || !recvTransport) return;

      const { data: consumeData } = await api.post(`/live/${sessionId}/consume`, {
        producerId,
        rtpCapabilities: device.rtpCapabilities,
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
    const sessionId = useLiveStore.getState().sessionId;
    const socket = getSocket();
    if (socket && sessionId) {
      socket.emit('live:leave', { sessionId });
    }
    recvTransportRef.current?.close();
    recvTransportRef.current = null;
    store.reset();
  }, [store]);

  const sendChat = useCallback((text: string) => {
    const sessionId = useLiveStore.getState().sessionId;
    const socket = getSocket();
    if (socket && sessionId && text.trim()) {
      socket.emit('live:chat', { sessionId, text });
    }
  }, []);

  const getLocalStream = useCallback(() => localStreamRef.current, []);

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
