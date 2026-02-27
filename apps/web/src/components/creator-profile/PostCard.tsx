import { useState } from 'react';

const IMG = '/icons/dashboard';

export interface PostMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export interface PostAuthor {
  displayName: string;
  username: string;
  avatar: string | null;
  isVerified: boolean;
}

export interface CreatorPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  media: PostMedia[];
  author?: PostAuthor;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function ImageGrid({ media }: { media: PostMedia[] }) {
  const images = media.filter((m) => m.type === 'IMAGE');
  if (images.length === 0) return null;
  const extra = images.length > 4 ? images.length - 3 : 0;
  const shown = images.slice(0, extra > 0 ? 3 : images.length);

  if (shown.length === 1) {
    return (
      <div className="overflow-hidden rounded-[12px] md:rounded-[16px]">
        <img src={shown[0].url} alt="" className="h-[240px] w-full object-cover md:h-[380px]" />
      </div>
    );
  }

  return (
    <div className="grid h-[220px] grid-cols-2 gap-[4px] overflow-hidden rounded-[12px] md:h-[360px] md:gap-[6px] md:rounded-[16px]">
      <img
        src={shown[0].url}
        alt=""
        className="h-full w-full object-cover"
        style={{ gridRow: shown.length > 2 ? '1 / 3' : undefined }}
      />
      {shown.slice(1).map((img, i) => (
        <div key={img.id} className="relative h-full w-full overflow-hidden">
          <img src={img.url} alt="" className="h-full w-full object-cover" />
          {extra > 0 && i === shown.length - 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-[18px] font-semibold text-white md:text-[24px]">
                +{extra < 10 ? `0${extra}` : extra}
                <br />
                <span className="text-[13px] font-normal">More</span>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function VideoThumb({ media }: { media: PostMedia }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] md:rounded-[16px]">
      <img
        src={media.thumbnail || media.url}
        alt=""
        className="h-[220px] w-full object-cover md:h-[360px]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-[8px] rounded-[50px] bg-[#15191c]/90 py-[6px] pl-[6px] pr-[16px]">
          <img src={`${IMG}/play-button.webp`} alt="" className="size-[28px] md:size-[36px]" />
          <span className="text-[14px] text-white md:text-[16px]">Play</span>
        </div>
      </div>
      <div className="absolute bottom-[10px] left-[10px] text-[12px] text-white/80">
        00:00 / 03:15
      </div>
    </div>
  );
}

interface PostMenuProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

function PostMenu({ open, onClose, onAction }: PostMenuProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-[28px] z-20 min-w-[120px] rounded-[8px] bg-white py-[4px] shadow-lg">
        {['Edit', 'Remove', 'Unpin'].map((a) => (
          <button
            key={a}
            onClick={() => {
              onAction(a.toLowerCase());
              onClose();
            }}
            className="flex w-full items-center gap-[8px] px-[14px] py-[8px] text-[13px] text-[#1a1a1a] hover:bg-[#f0f0f0]"
          >
            {a}
          </button>
        ))}
      </div>
    </>
  );
}

interface PostCardProps {
  post: CreatorPost;
  onMenuAction?: (postId: string, action: string) => void;
}

export function PostCard({ post, onMenuAction }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const author = post.author;
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const video = post.media.find((m) => m.type === 'VIDEO');

  return (
    <div className="rounded-[11px] bg-[#0e1012] p-[12px] md:rounded-[22px] md:p-[20px]">
      {/* Author Header */}
      {author && (
        <div className="mb-[10px] flex items-start justify-between md:mb-[14px]">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] overflow-hidden rounded-full bg-[#2e4882] md:size-[42px]">
              {author.avatar ? (
                <img src={author.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[14px] text-white">
                  {author.displayName[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] font-medium text-[#f8f8f8] md:text-[16px]">
                  {author.displayName}
                </span>
                {author.isVerified && (
                  <img src={`${IMG}/verified.svg`} alt="" className="size-[14px] md:size-[16px]" />
                )}
              </div>
              <span className="text-[11px] text-[#5d5d5d] md:text-[13px]">@{author.username}</span>
            </div>
          </div>
          <div className="relative flex items-center gap-[8px]">
            <span className="text-[11px] text-[#5d5d5d] md:text-[13px]">
              {timeAgo(post.createdAt)}
            </span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-[26px] items-center justify-center rounded-full hover:bg-[#15191c]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5d5d5d">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            <PostMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onAction={(a) => onMenuAction?.(post.id, a)}
            />
          </div>
        </div>
      )}

      {/* Text */}
      {post.text && (
        <p className="mb-[12px] whitespace-pre-wrap text-[13px] leading-[1.6] text-[#f8f8f8] md:mb-[16px] md:text-[15px]">
          {post.text}
        </p>
      )}

      {/* Media */}
      {images.length > 0 && (
        <div className="mb-[14px] md:mb-[18px]">
          <ImageGrid media={post.media} />
        </div>
      )}
      {video && images.length === 0 && (
        <div className="mb-[14px] md:mb-[18px]">
          <VideoThumb media={video} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[18px] md:gap-[28px]">
          {[
            { icon: 'favorite', count: post.likeCount, label: 'Likes' },
            { icon: 'mode-comment', count: post.commentCount, label: 'Comments' },
            { icon: 'share', count: post.shareCount, label: 'Share' },
          ].map((a) => (
            <button
              key={a.icon}
              className="flex items-center gap-[5px] text-[#c0c0c0] hover:text-white transition-colors md:gap-[8px]"
            >
              <img
                src={`${IMG}/${a.icon}.svg`}
                alt=""
                className="size-[16px] opacity-70 md:size-[20px]"
              />
              <span className="text-[11px] md:text-[14px]">
                {a.count} {a.label}
              </span>
            </button>
          ))}
        </div>
        <button className="flex items-center gap-[5px] text-[#c0c0c0] hover:text-white transition-colors md:gap-[8px]">
          <img
            src={`${IMG}/volunteer-activism.svg`}
            alt=""
            className="size-[16px] opacity-70 md:size-[20px]"
          />
          <span className="text-[11px] md:text-[14px]">Tip</span>
        </button>
      </div>
    </div>
  );
}
