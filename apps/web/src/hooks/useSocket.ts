import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useCallStore } from '../stores/callStore';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { showToast } from '../components/shared/NotificationToast';
import { api } from '../lib/api';
import type { CallMode } from '../stores/callStore';

function registerCallListeners(socket: ReturnType<typeof connectSocket>) {
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
  const setConnected = useSocketStore((s) => s.setConnected);
  const addOnlineUser = useSocketStore((s) => s.addOnlineUser);
  const removeOnlineUser = useSocketStore((s) => s.removeOnlineUser);
  const setOnlineUsers = useSocketStore((s) => s.setOnlineUsers);
  const incrementNotif = useNotificationStore((s) => s.increment);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setConnected(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = connectSocket(token);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('user:online', (data: { userId: string }) => addOnlineUser(data.userId));
    socket.on('user:offline', (data: { userId: string }) => removeOnlineUser(data.userId));
    socket.on('user:online_list', (data: { userIds: string[] }) => setOnlineUsers(data.userIds));
    socket.on('notification:new', (data: { message?: string }) => {
      incrementNotif();
      if (data?.message) showToast(data.message);
    });

    // Global call event listeners (registered once)
    registerCallListeners(socket);

    api
      .get('/notifications?limit=1')
      .then((res: { data?: { data?: { unreadCount?: number } } }) => {
        const count = res.data?.data?.unreadCount ?? 0;
        useNotificationStore.getState().setUnreadCount(count);
      })
      .catch(() => {});

    return () => {
      disconnectSocket();
      setConnected(false);
    };
  }, [user, setConnected, addOnlineUser, removeOnlineUser, setOnlineUsers, incrementNotif]);
}
