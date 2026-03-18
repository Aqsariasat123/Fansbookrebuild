import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useCallStore } from '../stores/callStore';
import { useMessageStore } from '../stores/messageStore';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { showToast } from '../components/shared/NotificationToast';
import type { CallMode } from '../stores/callStore';
import type { Socket } from 'socket.io-client';

function registerCallListeners(socket: Socket) {
  const cgs = () => useCallStore.getState();

  socket.on(
    'call:incoming',
    (data: {
      callId: string;
      callerId: string;
      callerName: string;
      callerAvatar: string | null;
      mode?: CallMode;
    }) => {
      cgs().setIncoming(data);
      cgs().setPeer(data.callerName, data.callerAvatar);
    },
  );

  socket.on('call:accepted', () => cgs().setStatus('active'));
  socket.on('call:rejected', () => cgs().setStatus('ended'));
  socket.on('call:ended', () => cgs().setStatus('ended'));

  socket.on('call:offer', async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
    const pc = cgs().peerConnection;
    if (!pc) {
      cgs().setPendingOffer(data.sdp);
      return;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('call:answer', { callId: data.callId, sdp: answer });
  });

  socket.on('call:answer', async (data: { sdp: RTCSessionDescriptionInit }) => {
    const pc = cgs().peerConnection;
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  });

  socket.on('call:ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
    const pc = cgs().peerConnection;
    if (!pc) {
      cgs().addPendingCandidate(data.candidate);
      return;
    }
    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  });
}

export function useSocket() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const cbRef = useRef({
    setConnected: useSocketStore.getState().setConnected,
    addOnlineUser: useSocketStore.getState().addOnlineUser,
    removeOnlineUser: useSocketStore.getState().removeOnlineUser,
    setOnlineUsers: useSocketStore.getState().setOnlineUsers,
    incrementNotif: useNotificationStore.getState().increment,
  });

  // Only reconnect when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      cbRef.current.setConnected(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = connectSocket(token);
    const cb = cbRef.current;
    const seenMsgIds = new Set<string>();

    socket.on('connect', () => cb.setConnected(true));
    socket.on('disconnect', () => {
      cb.setConnected(false);
      // If in an active or ringing call, auto-end it
      const callStatus = useCallStore.getState().status;
      if (callStatus === 'active' || callStatus === 'ringing') {
        useCallStore.getState().setStatus('ended');
      }
    });
    socket.on('user:online', (data: { userId: string }) => cb.addOnlineUser(data.userId));
    socket.on('user:offline', (data: { userId: string }) => cb.removeOnlineUser(data.userId));
    socket.on('user:online_list', (data: { userIds: string[] }) => cb.setOnlineUsers(data.userIds));
    socket.on('notification:new', (data: { message?: string }) => {
      if (data?.message) showToast(data.message);
    });

    socket.on(
      'message:new',
      (msg: {
        id: string;
        conversationId: string;
        senderId: string;
        sender?: { displayName: string; avatar: string | null };
      }) => {
        if (msg.senderId === user.id) return;
        if (seenMsgIds.has(msg.id)) return;
        seenMsgIds.add(msg.id);
        const pathname = window.location.pathname;
        if (!pathname.endsWith(`/messages/${msg.conversationId}`)) {
          useMessageStore.getState().increment();
          if (msg.sender) {
            useMessageStore.getState().addPending({
              conversationId: msg.conversationId,
              senderAvatar: msg.sender.avatar,
              senderName: msg.sender.displayName,
            });
          }
        }
      },
    );

    // Global live session listeners — always active regardless of current page
    const invalidateLive = () => {
      qc.invalidateQueries({ queryKey: ['live-sessions'] });
      qc.invalidateQueries({ queryKey: ['following-live'] });
    };
    socket.on('live:new-session', invalidateLive);
    socket.on('live:session-ended', invalidateLive);

    // Global call event listeners — registered once, never torn down mid-call
    registerCallListeners(socket);

    return () => {
      socket.off('message:new');
      disconnectSocket();
      cb.setConnected(false);
    };
  }, [user]);
}
