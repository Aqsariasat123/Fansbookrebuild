export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

export interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export interface FeedPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  author: Author;
  media: Media[];
  isLiked?: boolean;
  ppvPrice?: number | null;
  isPpvUnlocked?: boolean;
  visibility?: string;
  isSubscribed?: boolean;
}
