import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useNotificationStore } from '../stores/notificationStore';
import type { Notification } from '../components/notifications/NotificationRow';

const TAB_TYPE_MAP: Record<string, string | null> = {
  All: null,
  Likes: 'LIKE',
  Comments: 'COMMENT',
  Follows: 'FOLLOW',
  Tips: 'TIP',
  System: 'SYSTEM',
  Archived: null,
};

function getDateGroup(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 1 && now.getDate() === d.getDate()) return 'Today';
  if (diffDays < 7) return 'This Week';
  return 'Earlier';
}

export function useNotificationsPage(activeTab: string, search: string) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const decrement = useNotificationStore((s) => s.decrement);
  const resetNotif = useNotificationStore((s) => s.reset);
  const isArchiveTab = activeTab === 'Archived';

  const fetchItems = async (archived = false) => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data: r } = await api.get(`/notifications?archived=${archived}`);
      if (r.success) setItems(r.data.items);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetNotif();
    fetchItems(false);
  }, [resetNotif]);
  useEffect(() => {
    fetchItems(isArchiveTab);
  }, [isArchiveTab]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNew = (data: Notification) => {
      if (!isArchiveTab) setItems((prev) => [data, ...prev]);
    };
    const handleUpdated = (data: Notification) => {
      setItems((prev) => prev.map((n) => (n.id === data.id ? { ...n, ...data } : n)));
    };
    socket.on('notification:new', handleNew);
    socket.on('notification:updated', handleUpdated);
    return () => {
      socket.off('notification:new', handleNew);
      socket.off('notification:updated', handleUpdated);
    };
  }, [isArchiveTab]);

  const handleDelete = async (id: string) => {
    const item = items.find((n) => n.id === id);
    await api.delete(`/notifications/${id}`).catch(() => {});
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (item && !item.read) decrement();
  };

  const handleArchive = async (id: string) => {
    const item = items.find((n) => n.id === id);
    await api.put(`/notifications/${id}/archive`).catch(() => {});
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (item && !item.read) decrement();
  };

  const handleMarkRead = async (n: Notification) => {
    await api.put(`/notifications/${n.id}/read`).catch(() => {});
    setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
    if (!n.read) decrement();
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    resetNotif();
  };

  const handleBulkArchive = async (ids: string[]) => {
    await api.put('/notifications/bulk-archive', { ids }).catch(() => {});
    const removedUnread = items.filter((n) => ids.includes(n.id) && !n.read).length;
    setItems((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelected(new Set());
    for (let i = 0; i < removedUnread; i++) decrement();
  };

  const handleBulkDelete = async (ids: string[]) => {
    await api.delete('/notifications/bulk-delete', { data: { ids } }).catch(() => {});
    const removedUnread = items.filter((n) => ids.includes(n.id) && !n.read).length;
    setItems((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelected(new Set());
    for (let i = 0; i < removedUnread; i++) decrement();
  };

  const grouped = useMemo(() => {
    let filtered = items;
    if (search.trim())
      filtered = filtered.filter((n) => n.message.toLowerCase().includes(search.toLowerCase()));
    const typeFilter = TAB_TYPE_MAP[activeTab];
    if (typeFilter) filtered = filtered.filter((n) => n.type === typeFilter);
    const order = ['Today', 'This Week', 'Earlier'];
    const map = new Map<string, Notification[]>();
    for (const n of filtered) {
      const g = getDateGroup(n.createdAt);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(n);
    }
    return order.flatMap((label) => {
      const list = map.get(label);
      return list?.length ? [{ label, items: list }] : [];
    });
  }, [items, search, activeTab]);

  const allFilteredIds = grouped.flatMap((g) => g.items).map((n) => n.id);
  const allSelected = allFilteredIds.length > 0 && selected.size === allFilteredIds.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allFilteredIds));
    }
  };

  return {
    loading,
    grouped,
    selected,
    setSelected,
    isArchiveTab,
    items,
    handleDelete,
    handleArchive,
    handleMarkRead,
    handleMarkAllRead,
    handleBulkArchive,
    handleBulkDelete,
    allFilteredIds,
    allSelected,
    toggleSelect,
    toggleSelectAll,
  };
}
