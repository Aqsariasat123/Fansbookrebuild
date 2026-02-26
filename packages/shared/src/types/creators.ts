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
  'notification:new': (data: { id: string; type: string; message: string }) => void;
  'message:new': (data: { chatId: string; message: unknown }) => void;
  'message:read': (data: { chatId: string; userId: string }) => void;
  'user:online': (data: { userId: string }) => void;
  'user:offline': (data: { userId: string }) => void;
  'typing:start': (data: { chatId: string; userId: string }) => void;
  'typing:stop': (data: { chatId: string; userId: string }) => void;
}
