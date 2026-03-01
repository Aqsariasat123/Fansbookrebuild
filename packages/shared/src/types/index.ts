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
  SUBSCRIBE = 'SUBSCRIBE',
  MESSAGE = 'MESSAGE',
  TIP = 'TIP',
  MENTION = 'MENTION',
  POST = 'POST',
  LIVE = 'LIVE',
  STORY = 'STORY',
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
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  mobileNumber?: string | null;
  avatar: string | null;
  cover: string | null;
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

// Re-export creator dashboard types
export type {
  SubscriptionTierData,
  EarningRecord,
  BookingData,
  ReferralData,
  WithdrawalData,
  CreatorWalletData,
} from './creator.js';

// Re-export creator/live types + socket events
export type {
  CreatorCard,
  CreatorsFilterParams,
  CreatorFiltersResponse,
  LiveCreatorCard,
  UpcomingLive,
  LiveFilterParams,
  SocketEvents,
} from './creators.js';
