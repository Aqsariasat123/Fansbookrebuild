export interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isSubscribed: boolean;
  tiers: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    benefits: string[];
  }[];
  likesCount?: number;
  imagesCount?: number;
  videosCount?: number;
  socialLinks?: Record<string, string>;
  hashtags?: string[];
}
