import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { useNotificationStore } from '../stores/notificationStore';
import { playSound } from '../lib/sounds';
import { api } from '../lib/api';

export function useNotificationSocket() {
  const increment = useNotificationStore((s) => s.increment);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    api
      .get('/notifications?limit=1')
      .then((res) => {
        const count = res.data.data?.unreadCount ?? 0;
        setUnreadCount(count);
      })
      .catch(() => {});
  }, [setUnreadCount]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNew = () => {
      increment();
      playSound('notification');
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [increment]);
}
