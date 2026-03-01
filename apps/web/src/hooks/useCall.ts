import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallStore, type CallMode } from '../stores/callStore';
import { getSocket } from '../lib/socket';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export function useCall() {
  const navigate = useNavigate();
  const store = useCallStore();
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // Listen for incoming call events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncoming = (data: {
      callId: string;
      callerId: string;
      callerName: string;
      callerAvatar: string | null;
      mode?: CallMode;
    }) => {
      store.setIncoming(data);
      store.setPeer(data.callerName, data.callerAvatar);
    };

    const handleAccepted = () => store.setStatus('active');
    const handleRejected = () => {
      store.reset();
      navigate(-1);
    };
    const handleEnded = () => {
      store.reset();
      navigate(-1);
    };

    const handleOffer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      const pc = useCallStore.getState().peerConnection;
      if (!pc) {
        store.setPendingOffer(data.sdp);
        return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('call:answer', { callId: data.callId, sdp: answer });
    };

    const handleAnswer = async (data: { sdp: RTCSessionDescriptionInit }) => {
      const pc = useCallStore.getState().peerConnection;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    };

    const handleIce = async (data: { candidate: RTCIceCandidateInit }) => {
      const pc = useCallStore.getState().peerConnection;
      if (!pc) {
        store.addPendingCandidate(data.candidate);
        return;
      }
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    };

    socket.on('call:incoming', handleIncoming);
    socket.on('call:accepted', handleAccepted);
    socket.on('call:rejected', handleRejected);
    socket.on('call:ended', handleEnded);
    socket.on('call:offer', handleOffer);
    socket.on('call:answer', handleAnswer);
    socket.on('call:ice-candidate', handleIce);

    return () => {
      socket.off('call:incoming', handleIncoming);
      socket.off('call:accepted', handleAccepted);
      socket.off('call:rejected', handleRejected);
      socket.off('call:ended', handleEnded);
      socket.off('call:offer', handleOffer);
      socket.off('call:answer', handleAnswer);
      socket.off('call:ice-candidate', handleIce);
    };
  }, [store]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    store.setPeerConnection(pc);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const socket = getSocket();
        const callId = useCallStore.getState().callId;
        socket?.emit('call:ice-candidate', { callId, candidate: e.candidate.toJSON() });
      }
    };

    pc.ontrack = (e) => {
      store.setRemoteStream(e.streams[0]);
    };

    return pc;
  }, [store]);

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
      store.setLocalStream(stream);
      store.setMode(mode);
      if (peer) store.setPeer(peer.name, peer.avatar);
      store.setStatus('ringing');

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      socket.once('call:initiated', async (data: { callId: string }) => {
        store.setCallId(data.callId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('call:offer', { callId: data.callId, sdp: offer });
        navigate(`/call/${data.callId}`);
      });

      socket.emit('call:initiate', { calleeId, mode });
    },
    [store, createPeerConnection, navigate],
  );

  const acceptCall = useCallback(async () => {
    const socket = getSocket();
    const { callId, mode, pendingOffer, pendingCandidates } = useCallStore.getState();
    if (!socket || !callId) return;

    const constraints =
      mode === 'audio' ? { video: false, audio: true } : { video: true, audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    store.setLocalStream(stream);

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Apply buffered offer from caller
    if (pendingOffer) {
      await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('call:answer', { callId, sdp: answer });
    }
    // Apply buffered ICE candidates
    for (const c of pendingCandidates) {
      await pc.addIceCandidate(new RTCIceCandidate(c));
    }

    socket.emit('call:accept', { callId });
    store.setStatus('active');
    navigate(`/call/${callId}`);
  }, [store, createPeerConnection, navigate]);

  const rejectCall = useCallback(() => {
    const socket = getSocket();
    const { callId } = useCallStore.getState();
    if (socket && callId) {
      socket.emit('call:reject', { callId });
    }
    store.reset();
  }, [store]);

  const endCall = useCallback(() => {
    const socket = getSocket();
    const { callId } = useCallStore.getState();
    if (socket && callId) {
      socket.emit('call:end', { callId });
    }
    store.reset();
    navigate(-1);
  }, [store, navigate]);

  const toggleMute = useCallback((kind: 'audio' | 'video') => {
    const stream = useCallStore.getState().localStream;
    if (!stream) return;
    const tracks = kind === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();
    tracks.forEach((t) => {
      t.enabled = !t.enabled;
    });
  }, []);

  return { startCall, acceptCall, rejectCall, endCall, toggleMute };
}
