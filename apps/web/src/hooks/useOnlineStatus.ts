import { useSocketStore } from '../stores/socketStore';

export function useOnlineStatus(userId: string | undefined): boolean {
  const onlineUsers = useSocketStore((s) => s.onlineUsers);
  if (!userId) return false;
  return onlineUsers.has(userId);
}
