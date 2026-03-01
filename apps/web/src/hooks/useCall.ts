import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallStore } from '../stores/callStore';
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
    }) => {
      store.setIncoming(data);
    };

    const handleAccepted = () => store.setStatus('active');
    const handleRejected = () => store.reset();
    const handleEnded = () => store.reset();

    const handleOffer = async (data: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit('call:answer', { callId: data.callId, sdp: answer });
    };

    const handleAnswer = async (data: { sdp: RTCSessionDescriptionInit }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
    };

    const handleIce = async (data: { candidate: RTCIceCandidateInit }) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
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
    async (calleeId: string) => {
      const socket = getSocket();
      if (!socket) return;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      store.setLocalStream(stream);
      store.setStatus('ringing');

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Listen for callId from server
      socket.once('call:initiated', async (data: { callId: string }) => {
        store.setCallId(data.callId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('call:offer', { callId: data.callId, sdp: offer });
        navigate(`/call/${data.callId}`);
      });

      socket.emit('call:initiate', { calleeId });
    },
    [store, createPeerConnection, navigate],
  );

  const acceptCall = useCallback(async () => {
    const socket = getSocket();
    const { callId } = useCallStore.getState();
    if (!socket || !callId) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    store.setLocalStream(stream);

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

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
