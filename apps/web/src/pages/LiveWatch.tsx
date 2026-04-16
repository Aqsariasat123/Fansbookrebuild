import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLiveStore } from '../stores/liveStore';
import { useLivePrivate } from '../hooks/useLivePrivate';
import { useLiveWatchStream } from '../hooks/useLiveWatchStream';
import { LiveChatPanel } from '../components/live/LiveChatPanel';
import { useAuthStore } from '../stores/authStore';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';
import {
  VideoPanel,
  GoPrivateControls,
  PinnedItemCard,
  initLiveState,
  type SessionInfo,
  type PrivateStatus,
} from './LiveWatchParts';
import { InStreamPurchaseModal, type PinnedItem } from '../components/live/InStreamPurchaseModal';

export default function LiveWatch() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const userId = useAuthStore((s) => s.user?.id);
  const isLive = useLiveStore((s) => s.isLive);
  const viewerCount = useLiveStore((s) => s.viewerCount);
  const creatorOnPrivateCall = useLiveStore((s) => s.creatorOnPrivateCall);
  const { requestPrivate } = useLivePrivate();
  const { videoRef, loading, isHls, error, sendChat, leaveLive } = useLiveWatchStream(sessionId);

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [creatorAvatar, setCreatorAvatar] = useState<string | null>(initLiveState(state).avatar);
  const [creatorName, setCreatorName] = useState<string>(initLiveState(state).name);
  const [privateStatus, setPrivateStatus] = useState<PrivateStatus>('idle');
  const [pinnedItem, setPinnedItem] = useState<PinnedItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    api
      .get(`/live/${sessionId}`)
      .then(({ data }) => {
        if (data.success && data.data) {
          const name = data.data.creator?.displayName ?? 'Creator';
          setSession({
            privateShow: data.data.privateShow,
            privateShowTokens: data.data.privateShowTokens,
            creatorId: data.data.creatorId,
            creatorName: name,
          });
          setCreatorName(name);
          setCreatorAvatar(data.data.creator?.avatar ?? null);
        }
      })
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onAccepted = () => setPrivateStatus('accepted');
    const onDeclined = () => setPrivateStatus('declined');
    const onCallEnded = () => setPrivateStatus('idle');
    socket.on('live:private-accepted', onAccepted);
    socket.on('live:private-declined', onDeclined);
    socket.on('live:private-call-ended', onCallEnded);
    return () => {
      socket.off('live:private-accepted', onAccepted);
      socket.off('live:private-declined', onDeclined);
      socket.off('live:private-call-ended', onCallEnded);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    api
      .get(`/live/${sessionId}/pinned-item`)
      .then(({ data }) => {
        if (data.success && data.data) {
          const d = data.data;
          setPinnedItem({
            id: d.id,
            title: d.title,
            price: d.price,
            image: d.images?.[0] ?? d.image ?? null,
          });
        }
      })
      .catch(() => {});
    const socket = getSocket();
    if (!socket) return;
    const onPinned = (d: { item: PinnedItem }) => setPinnedItem(d.item);
    const onUnpinned = () => setPinnedItem(null);
    socket.on('live:item-pinned', onPinned);
    socket.on('live:item-unpinned', onUnpinned);
    return () => {
      socket.off('live:item-pinned', onPinned);
      socket.off('live:item-unpinned', onUnpinned);
    };
  }, [sessionId]);

  const showGoPrivate = !!(session?.privateShow && session.creatorId !== userId);

  if (error)
    return (
      <div className="flex flex-col items-center gap-[16px] py-[80px]">
        <p className="text-[18px] font-semibold text-foreground">Stream Unavailable</p>
        <p className="text-[14px] text-muted-foreground">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[14px] font-medium text-white"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <span className="rounded-[4px] bg-red-600 px-[10px] py-[4px] text-[12px] font-semibold text-white">
            LIVE
          </span>
          <p className="text-[18px] font-semibold text-foreground">Watching Live</p>
        </div>
        <button
          onClick={() => {
            leaveLive();
            navigate(-1);
          }}
          className="rounded-[8px] border border-border px-[20px] py-[8px] text-[14px] text-foreground hover:border-foreground"
        >
          Leave
        </button>
      </div>
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        <VideoPanel
          videoRef={videoRef}
          loading={loading}
          isHls={isHls}
          isLive={isLive}
          onPrivateCall={creatorOnPrivateCall}
          creatorName={creatorName}
          viewerCount={viewerCount}
          pinnedItemCard={
            pinnedItem ? (
              <PinnedItemCard item={pinnedItem} onBuy={() => setShowPurchaseModal(true)} />
            ) : undefined
          }
        />
        <LiveChatPanel
          onSend={sendChat}
          creatorName={creatorName}
          creatorAvatar={creatorAvatar}
          goPrivate={
            showGoPrivate ? (
              <GoPrivateControls
                status={privateStatus}
                tokens={session?.privateShowTokens ?? 0}
                onRequest={() => {
                  requestPrivate(sessionId!);
                  setPrivateStatus('pending');
                }}
              />
            ) : undefined
          }
        />
      </div>
      {showPurchaseModal && pinnedItem && (
        <InStreamPurchaseModal
          item={pinnedItem}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={() => setPinnedItem(null)}
        />
      )}
    </div>
  );
}
