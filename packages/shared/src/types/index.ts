// ─── Enums ───────────────────────────────────────────────

export enum UserRole {
  FAN = 'FAN',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  DEACTIVATED = 'DEACTIVATED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  SUBSCRIBERS_ONLY = 'SUBSCRIBERS_ONLY',
  PPV = 'PPV',
  TIER_LOCKED = 'TIER_LOCKED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  TIP = 'TIP',
  PPV = 'PPV',
  MARKETPLACE = 'MARKETPLACE',
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  SUBSCRIPTION = 'SUBSCRIPTION',
  MESSAGE = 'MESSAGE',
  TIP = 'TIP',
  MENTION = 'MENTION',
  POST = 'POST',
  SYSTEM = 'SYSTEM',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TIP = 'TIP',
  PPV = 'PPV',
}

export enum StoryType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE = 'INAPPROPRIATE',
  COPYRIGHT = 'COPYRIGHT',
  UNDERAGE = 'UNDERAGE',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT',
}

export enum AuctionStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

// ─── Interfaces ──────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UserPublicProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  role: UserRole;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface MediaUploadResult {
  url: string;
  key: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  actorId: string;
  actorName: string;
  actorAvatar: string | null;
  entityId?: string;
  entityType?: string;
  isRead: boolean;
  createdAt: string;
}

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
  'notification:new': (data: NotificationData) => void;
  'message:new': (data: { chatId: string; message: unknown }) => void;
  'message:read': (data: { chatId: string; userId: string }) => void;
  'user:online': (data: { userId: string }) => void;
  'user:offline': (data: { userId: string }) => void;
  'typing:start': (data: { chatId: string; userId: string }) => void;
  'typing:stop': (data: { chatId: string; userId: string }) => void;
}
