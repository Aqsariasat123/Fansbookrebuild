import type { PaginationParams } from './index.js';

export interface CreatorCard {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  category: string | null;
  statusText: string | null;
  country: string | null;
  gender: string | null;
  isVerified: boolean;
  isLive: boolean;
  isNew: boolean;
  price: number | null;
  followersCount: number;
}

export interface CreatorsFilterParams extends PaginationParams {
  search?: string;
  gender?: string;
  country?: string;
  priceMin?: number;
  priceMax?: number;
  category?: string;
  isLive?: boolean;
  isVerified?: boolean;
}

export interface CreatorFiltersResponse {
  genders: string[];
  countries: string[];
  categories: string[];
  priceRange: { min: number; max: number };
}

export interface LiveCreatorCard {
  id: string;
  creatorId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  category: string | null;
  viewerCount: number;
  title: string;
  startedAt: string | null;
}

export interface UpcomingLive {
  id: string;
  creatorId: string;
  username: string;
  avatar: string | null;
  title: string;
  scheduledAt: string;
}

export interface LiveFilterParams {
  category?: string;
  gender?: string;
  region?: string;
  sortBy?: 'viewers' | 'newest';
}

// ─── Story Types ─────────────────────────────────────────

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
  viewCount: number;
}

export interface StoryGroup {
  authorId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  stories: StoryItem[];
}

// ─── Live Chat ───────────────────────────────────────────

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  text: string;
  createdAt: string;
}

// ─── Socket Events ───────────────────────────────────────

export interface SocketEvents {
  'notification:new': (data: {
    id: string;
    type: string;
    message: string;
    actorId?: string;
    entityId?: string;
    entityType?: string;
    read: boolean;
    createdAt: string;
  }) => void;
  'message:new': (data: {
    id: string;
    conversationId: string;
    senderId: string;
    text: string | null;
    mediaUrl: string | null;
    mediaType: string;
    tipAmount: number | null;
    readAt: string | null;
    createdAt: string;
    sender: { id: string; username: string; displayName: string; avatar: string | null };
  }) => void;
  'message:read': (data: { conversationId: string; userId: string }) => void;
  'conversation:update': (data: {
    conversationId: string;
    lastMessage: string;
    lastMessageAt: string;
  }) => void;
  'typing:indicator': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  'user:online': (data: { userId: string }) => void;
  'user:offline': (data: { userId: string }) => void;
  'user:online_list': (data: { userIds: string[] }) => void;
  // Live streaming events
  'live:viewer-count': (data: { sessionId: string; count: number }) => void;
  'live:chat': (data: LiveChatMessage) => void;
  'live:tip': (data: { sessionId: string; from: string; amount: number }) => void;
  'live:ended': (data: { sessionId: string }) => void;
  // Video call events
  'call:incoming': (data: {
    callId: string;
    callerId: string;
    callerName: string;
    callerAvatar: string | null;
  }) => void;
  'call:accepted': (data: { callId: string }) => void;
  'call:rejected': (data: { callId: string }) => void;
  'call:ended': (data: { callId: string }) => void;
  'call:offer': (data: { callId: string; sdp: unknown }) => void;
  'call:answer': (data: { callId: string; sdp: unknown }) => void;
  'call:ice-candidate': (data: { callId: string; candidate: unknown }) => void;
}
