import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from '../stores/notificationStore';

describe('notificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ unreadCount: 0 });
  });

  it('should start with zero unread count', () => {
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it('should set unread count', () => {
    useNotificationStore.getState().setUnreadCount(5);
    expect(useNotificationStore.getState().unreadCount).toBe(5);
  });

  it('should increment unread count', () => {
    useNotificationStore.getState().setUnreadCount(3);
    useNotificationStore.getState().increment();
    expect(useNotificationStore.getState().unreadCount).toBe(4);
  });

  it('should increment from zero', () => {
    useNotificationStore.getState().increment();
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it('should reset unread count to zero', () => {
    useNotificationStore.getState().setUnreadCount(10);
    useNotificationStore.getState().reset();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it('should handle multiple increments', () => {
    useNotificationStore.getState().increment();
    useNotificationStore.getState().increment();
    useNotificationStore.getState().increment();
    expect(useNotificationStore.getState().unreadCount).toBe(3);
  });
});
