import { create } from 'zustand';

export type CallStatus = 'idle' | 'ringing' | 'active' | 'ended';
export type CallMode = 'audio' | 'video';

interface CallState {
  callId: string | null;
  callerId: string | null;
  calleeId: string | null;
  callerName: string | null;
  callerAvatar: string | null;
  peerName: string | null;
  peerAvatar: string | null;
  mode: CallMode;
  status: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  pendingOffer: RTCSessionDescriptionInit | null;
  pendingCandidates: RTCIceCandidateInit[];

  setIncoming: (data: {
    callId: string;
    callerId: string;
    callerName: string;
    callerAvatar: string | null;
    mode?: CallMode;
  }) => void;
  setCallId: (id: string) => void;
  setMode: (mode: CallMode) => void;
  setPeer: (name: string, avatar: string | null) => void;
  setStatus: (status: CallStatus) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  setPendingOffer: (sdp: RTCSessionDescriptionInit) => void;
  addPendingCandidate: (c: RTCIceCandidateInit) => void;
  reset: () => void;
}

const initialState = {
  callId: null,
  callerId: null,
  calleeId: null,
  callerName: null,
  callerAvatar: null,
  peerName: null,
  peerAvatar: null,
  mode: 'video' as CallMode,
  status: 'idle' as CallStatus,
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  pendingOffer: null as RTCSessionDescriptionInit | null,
  pendingCandidates: [] as RTCIceCandidateInit[],
};

export const useCallStore = create<CallState>((set) => ({
  ...initialState,

  setIncoming: (data) =>
    set({
      callId: data.callId,
      callerId: data.callerId,
      callerName: data.callerName,
      callerAvatar: data.callerAvatar,
      mode: data.mode ?? 'video',
      status: 'ringing',
    }),

  setCallId: (id) => set({ callId: id }),
  setMode: (mode) => set({ mode }),
  setPeer: (name, avatar) => set({ peerName: name, peerAvatar: avatar }),
  setStatus: (status) => set({ status }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setPeerConnection: (pc) => set({ peerConnection: pc }),
  setPendingOffer: (sdp) => set({ pendingOffer: sdp }),
  addPendingCandidate: (c) => set((s) => ({ pendingCandidates: [...s.pendingCandidates, c] })),

  reset: () => {
    const state = useCallStore.getState();
    state.localStream?.getTracks().forEach((t) => t.stop());
    state.remoteStream?.getTracks().forEach((t) => t.stop());
    state.peerConnection?.close();
    set(initialState);
  },
}));
