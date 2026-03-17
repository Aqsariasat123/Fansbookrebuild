import { useCallback } from 'react';
import { getSocket } from '../lib/socket';
import { useLiveStore } from '../stores/liveStore';

const gs = () => useLiveStore.getState();

export function useLivePrivate() {
  const requestPrivate = useCallback((sessionId: string) => {
    getSocket()?.emit('live:private-request', { sessionId });
  }, []);

  const acceptPrivate = useCallback((sessionId: string, fanId: string) => {
    getSocket()?.emit('live:private-accept', { sessionId, fanId });
    gs().setPrivateIncoming(null);
  }, []);

  const declinePrivate = useCallback((fanId: string) => {
    getSocket()?.emit('live:private-decline', { fanId });
    gs().setPrivateIncoming(null);
  }, []);

  const endPrivateCall = useCallback((sessionId: string) => {
    getSocket()?.emit('live:private-ended', { sessionId });
    gs().setCreatorOnPrivateCall(false);
  }, []);

  return { requestPrivate, acceptPrivate, declinePrivate, endPrivateCall };
}
