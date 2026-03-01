import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallStore, type CallMode } from '../stores/callStore';
import { getSocket } from '../lib/socket';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const gs = () => useCallStore.getState();

export function useCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(navigate);
  const locRef = useRef(location.pathname);
  navRef.current = navigate;
  locRef.current = location.pathname;

  // Watch for call ended (from socket) → navigate back + cleanup
  const status = useCallStore((s) => s.status);
  useEffect(() => {
    if (status !== 'ended') return;
    const path = gs().returnPath;
    gs().reset();
    if (path) navRef.current(path);
    else navRef.current(-1);
  }, [status]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    gs().setPeerConnection(pc);
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const socket = getSocket();
        socket?.emit('call:ice-candidate', {
          callId: gs().callId,
          candidate: e.candidate.toJSON(),
        });
      }
    };
    pc.ontrack = (e) => gs().setRemoteStream(e.streams[0]);
    return pc;
  }, []);

  const startCall = useCallback(
    async (
      calleeId: string,
      mode: CallMode = 'video',
      peer?: { name: string; avatar: string | null },
    ) => {
      const socket = getSocket();
      if (!socket) return;
      const constraints =
        mode === 'audio' ? { video: false, audio: true } : { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      gs().setLocalStream(stream);
      gs().setMode(mode);
      gs().setReturnPath(locRef.current);
      if (peer) gs().setPeer(peer.name, peer.avatar);
      gs().setStatus('ringing');

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      socket.once('call:initiated', async (data: { callId: string }) => {
        gs().setCallId(data.callId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('call:offer', { callId: data.callId, sdp: offer });
        navRef.current(`/call/${data.callId}`);
      });

      socket.emit('call:initiate', { calleeId, mode });
    },
    [createPeerConnection],
  );

  const acceptCall = useCallback(async () => {
    const socket = getSocket();
    const { callId, mode, pendingOffer, pendingCandidates } = gs();
    if (!socket || !callId) return;
    const constraints =
      mode === 'audio' ? { video: false, audio: true } : { video: true, audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    gs().setLocalStream(stream);
    gs().setReturnPath(locRef.current);

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    if (pendingOffer) {
      await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('call:answer', { callId, sdp: answer });
    }
    for (const c of pendingCandidates) {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    }

    socket.emit('call:accept', { callId });
    gs().setStatus('active');
    navRef.current(`/call/${callId}`);
  }, [createPeerConnection]);

  const rejectCall = useCallback(() => {
    const socket = getSocket();
    const { callId } = gs();
    if (socket && callId) socket.emit('call:reject', { callId });
    gs().reset();
  }, []);

  const endCall = useCallback(() => {
    const socket = getSocket();
    const { callId, returnPath } = gs();
    if (socket && callId) socket.emit('call:end', { callId });
    const path = returnPath;
    gs().reset();
    if (path) navRef.current(path);
    else navRef.current(-1);
  }, []);

  const toggleMute = useCallback((kind: 'audio' | 'video') => {
    const stream = gs().localStream;
    if (!stream) return;
    const tracks = kind === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();
    tracks.forEach((t) => {
      t.enabled = !t.enabled;
    });
  }, []);

  return { startCall, acceptCall, rejectCall, endCall, toggleMute };
}
