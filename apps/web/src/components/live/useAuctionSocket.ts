import { useEffect, useState, useRef, useCallback } from 'react';
import { getSocket } from '../../lib/socket';

export interface AuctionState {
  id: string;
  startingBid: number;
  currentBid: number | null;
  endsAt: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  image: string | null;
}

export function useAuctionSocket(sessionId: string) {
  const [auction, setAuction] = useState<AuctionState | null>(null);
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [endMsg, setEndMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback((endsAt: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const secs = Math.max(0, Math.round((new Date(endsAt).getTime() - Date.now()) / 1000));
      setTimeLeft(secs);
      if (secs === 0 && timerRef.current) clearInterval(timerRef.current);
    }, 500);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onStarted = (d: { auction: AuctionState; item: AuctionItem }) => {
      setAuction(d.auction);
      setItem(d.item);
      setEndMsg('');
      startCountdown(d.auction.endsAt);
    };
    const onUpdate = (d: { auctionId: string; amount: number; endsAt: string }) => {
      setAuction((prev) =>
        prev?.id === d.auctionId ? { ...prev, currentBid: d.amount, endsAt: d.endsAt } : prev,
      );
      startCountdown(d.endsAt);
    };
    const onEnded = (d: { winnerName: string | null; amount: number | null }) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(0);
      setEndMsg(
        d.winnerName && d.amount
          ? `🏆 ${d.winnerName} won with ${d.amount} coins!`
          : 'Auction ended — no bids.',
      );
      setTimeout(() => {
        setAuction(null);
        setItem(null);
        setEndMsg('');
      }, 6000);
    };
    const onCancelled = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setEndMsg('Auction was cancelled.');
      setTimeout(() => {
        setAuction(null);
        setItem(null);
        setEndMsg('');
      }, 3000);
    };
    socket.on('live:auction-started', onStarted);
    socket.on('live:auction-update', onUpdate);
    socket.on('live:auction-ended', onEnded);
    socket.on('live:auction-cancelled', onCancelled);
    return () => {
      socket.off('live:auction-started', onStarted);
      socket.off('live:auction-update', onUpdate);
      socket.off('live:auction-ended', onEnded);
      socket.off('live:auction-cancelled', onCancelled);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId, startCountdown]);

  return { auction, item, timeLeft, endMsg };
}
