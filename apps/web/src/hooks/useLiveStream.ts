import { useCallback, useEffect } from 'react';
import { Device } from 'mediasoup-client';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useLiveStore } from '../stores/liveStore';
import type { PrivateIncoming } from '../stores/liveStore';
import type { LiveChatMessage } from '@fansbook/shared';
import {
  liveState,
  switchToCamera as _cam,
  switchToScreenShare as _share,
} from './liveStreamState';

const gs = () => useLiveStore.getState();

export function useLiveStream() {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onViewerCount = (d: { sessionId: string; count: number }) => gs().setViewerCount(d.count);
    const onChat = (d: LiveChatMessage) => gs().addChat(d);
    const onEnded = () => {
      gs().setIsLive(false);
      gs().setCreatorOnPrivateCall(false);
    };
    const onPrivateIncoming = (d: PrivateIncoming) => gs().setPrivateIncoming(d);
    const onOnPrivateCall = () => gs().setCreatorOnPrivateCall(true);
    const onPrivateCallEnded = () => gs().setCreatorOnPrivateCall(false);
    socket.on('live:viewer-count', onViewerCount);
    socket.on('live:chat', onChat);
    socket.on('live:ended', onEnded);
    socket.on('live:private-incoming', onPrivateIncoming);
    socket.on('live:on-private-call', onOnPrivateCall);
    socket.on('live:private-call-ended', onPrivateCallEnded);
    return () => {
      socket.off('live:viewer-count', onViewerCount);
      socket.off('live:chat', onChat);
      socket.off('live:ended', onEnded);
      socket.off('live:private-incoming', onPrivateIncoming);
      socket.off('live:on-private-call', onOnPrivateCall);
      socket.off('live:private-call-ended', onPrivateCallEnded);
    };
  }, []);

  const startBroadcast = useCallback(
    async (
      title: string,
      videoEl: HTMLVideoElement | null,
      opts?: { privateShow?: boolean; privateShowTokens?: number },
      existingStream?: MediaStream,
    ) => {
      const stream =
        existingStream ??
        (await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: true,
        }));
      liveState.localStream = stream;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.muted = true;
        await videoEl.play();
      }
      const { data: startData } = await api.post('/live/start', {
        title,
        privateShow: opts?.privateShow ?? false,
        privateShowTokens: opts?.privateShowTokens ?? 0,
      });
      const { sessionId, transportOptions } = startData.data;
      gs().setSession(sessionId);
      gs().setIsLive(true);
      const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
      const device = new Device();
      await device.load({ routerRtpCapabilities: capData.data });
      liveState.msDevice = device;
      const transport = device.createSendTransport(transportOptions);
      liveState.sendTransport = transport;
      transport.on('connect', ({ dtlsParameters }, callback) => {
        getSocket()?.emit('live:transport-connect', {
          sessionId,
          transportId: transport.id,
          dtlsParameters,
        });
        callback();
      });
      transport.on('produce', async ({ kind, rtpParameters }, callback) => {
        const { data: res } = await api.post(`/live/${sessionId}/produce`, { kind, rtpParameters });
        callback({ id: res.data.producerId });
      });
      for (const track of stream.getTracks()) {
        const producer = await transport.produce({ track });
        if (track.kind === 'video') {
          liveState.videoProducer = producer;
          track.onended = () => {
            if (!liveState.isScreenSharing) void _cam();
          };
        } else {
          liveState.audioProducer = producer;
        }
      }
      getSocket()?.emit('live:join', { sessionId });
      return sessionId;
    },
    [],
  );

  const stopBroadcast = useCallback(async () => {
    const sessionId = gs().sessionId;
    if (!sessionId) return;
    getSocket()?.emit('live:leave', { sessionId });
    await api.post(`/live/${sessionId}/end`).catch(() => {});
    liveState.sendTransport?.close();
    liveState.localStream?.getTracks().forEach((t) => t.stop());
    liveState.videoProducer?.close();
    liveState.audioProducer?.close();
    liveState.sendTransport = null;
    liveState.localStream = null;
    liveState.videoProducer = null;
    liveState.audioProducer = null;
    liveState.isScreenSharing = false;
    gs().reset();
  }, []);

  const joinLive = useCallback(async (sessionId: string, videoEl: HTMLVideoElement | null) => {
    gs().setSession(sessionId);
    const { data: capData } = await api.get(`/live/${sessionId}/router-capabilities`);
    const device = new Device();
    await device.load({ routerRtpCapabilities: capData.data });
    liveState.msDevice = device;
    const { data: tData } = await api.post(`/live/${sessionId}/transport`);
    const recv = device.createRecvTransport(tData.data.transportOptions);
    liveState.recvTransport = recv;
    recv.on('connect', ({ dtlsParameters }, callback) => {
      getSocket()?.emit('live:transport-connect', {
        sessionId,
        transportId: recv.id,
        dtlsParameters,
      });
      callback();
    });
    const { data: chatData } = await api.get(`/live/${sessionId}/chat`);
    for (const msg of chatData.data ?? []) gs().addChat(msg);
    getSocket()?.emit('live:join', { sessionId });
    gs().setIsLive(true);
    return { device, recvTransport: recv, videoEl };
  }, []);

  const consumeTrack = useCallback(
    async (sessionId: string, producerId: string, videoEl: HTMLVideoElement | null) => {
      if (!liveState.msDevice || !liveState.recvTransport) return;
      const { data: consumeData } = await api.post(`/live/${sessionId}/consume`, {
        producerId,
        rtpCapabilities: liveState.msDevice.rtpCapabilities,
      });
      const consumer = await liveState.recvTransport.consume({
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
    if (sessionId) getSocket()?.emit('live:leave', { sessionId });
    liveState.recvTransport?.close();
    liveState.recvTransport = null;
    gs().reset();
  }, []);

  const sendChat = useCallback((text: string) => {
    const { sessionId } = gs();
    const socket = getSocket();
    if (socket && sessionId && text.trim()) socket.emit('live:chat', { sessionId, text });
  }, []);

  return {
    startBroadcast,
    stopBroadcast,
    joinLive,
    consumeTrack,
    leaveLive,
    sendChat,
    getLocalStream: useCallback(() => liveState.localStream, []),
    getIsScreenSharing: useCallback(() => liveState.isScreenSharing, []),
    switchToScreenShare: useCallback(() => _share(), []),
    switchToCamera: useCallback(() => _cam(), []),
  };
}
