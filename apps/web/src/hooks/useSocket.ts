import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { useNotificationStore } from '../stores/notificationStore';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { showToast } from '../components/shared/NotificationToast';
import { api } from '../lib/api';

export function useSocket() {
  const user = useAuthStore((s) => s.user);
  const setConnected = useSocketStore((s) => s.setConnected);
  const addOnlineUser = useSocketStore((s) => s.addOnlineUser);
  const removeOnlineUser = useSocketStore((s) => s.removeOnlineUser);
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
    socket.on('notification:new', (data: { message?: string }) => {
      incrementNotif();
      if (data?.message) showToast(data.message);
    });

    // Fetch initial unread notification count
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
  }, [user, setConnected, addOnlineUser, removeOnlineUser, incrementNotif]);
}
