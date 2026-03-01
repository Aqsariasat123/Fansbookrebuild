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
}
