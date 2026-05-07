import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import type { PrivateStatus } from '../pages/LiveWatchParts';

export function usePrivateShowSocket(
  setPrivateStatus: (s: PrivateStatus) => void,
  setInsufficient: (d: { required: number; balance: number } | null) => void,
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onAccepted = () => setPrivateStatus('accepted');
    const onDeclined = () => setPrivateStatus('declined');
    const onCallEnded = () => setPrivateStatus('idle');
    const onInsufficient = (d: { required: number; balance: number }) => {
      setPrivateStatus('idle');
      setInsufficient(d);
    };
    socket.on('live:private-accepted', onAccepted);
    socket.on('live:private-declined', onDeclined);
    socket.on('live:private-call-ended', onCallEnded);
    socket.on('live:private-insufficient', onInsufficient);
    return () => {
      socket.off('live:private-accepted', onAccepted);
      socket.off('live:private-declined', onDeclined);
      socket.off('live:private-call-ended', onCallEnded);
      socket.off('live:private-insufficient', onInsufficient);
    };
  }, [setPrivateStatus, setInsufficient]);
}
