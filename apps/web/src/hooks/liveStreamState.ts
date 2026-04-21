import { Device, types as mediasoupTypes } from 'mediasoup-client';

export interface LiveMediaState {
  msDevice: Device | null;
  sendTransport: mediasoupTypes.Transport | null;
  recvTransport: mediasoupTypes.Transport | null;
  localStream: MediaStream | null;
  videoProducer: mediasoupTypes.Producer | null;
  audioProducer: mediasoupTypes.Producer | null;
  isScreenSharing: boolean;
}

export const liveState: LiveMediaState = {
  msDevice: null,
  sendTransport: null,
  recvTransport: null,
  localStream: null,
  videoProducer: null,
  audioProducer: null,
  isScreenSharing: false,
};

export async function switchToCamera() {
  liveState.isScreenSharing = false;
  try {
    const s = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
    });
    const track = s.getVideoTracks()[0];
    if (liveState.videoProducer && !liveState.videoProducer.closed) {
      await liveState.videoProducer.replaceTrack({ track });
    }
    if (liveState.localStream) {
      liveState.localStream.getVideoTracks().forEach((t) => {
        liveState.localStream!.removeTrack(t);
        t.stop();
      });
      liveState.localStream.addTrack(track);
    }
  } catch {
    /* camera may be unavailable */
  }
}

export async function switchToScreenShare(): Promise<boolean> {
  try {
    const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const track = s.getVideoTracks()[0];
    liveState.isScreenSharing = true;
    if (liveState.videoProducer && !liveState.videoProducer.closed) {
      await liveState.videoProducer.replaceTrack({ track });
    }
    if (liveState.localStream) {
      liveState.localStream.getVideoTracks().forEach((t) => {
        liveState.localStream!.removeTrack(t);
        t.stop();
      });
      liveState.localStream.addTrack(track);
    }
    // Auto-revert when user stops sharing from browser UI
    track.onended = () => {
      liveState.isScreenSharing = false;
      void switchToCamera();
    };
    return true;
  } catch {
    liveState.isScreenSharing = false;
    return false;
  }
}
