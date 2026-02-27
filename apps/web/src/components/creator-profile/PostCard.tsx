const IMG = '/icons/dashboard';

export interface PostMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export interface CreatorPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  media: PostMedia[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface PostCardProps {
  post: CreatorPost;
  onMenuClick: (postId: string) => void;
}

export function PostCard({ post, onMenuClick }: PostCardProps) {
  const mainImage = post.media.find((m) => m.type === 'IMAGE');
  const videoThumb = post.media.find((m) => m.type === 'VIDEO');
  const thumb = mainImage?.url || videoThumb?.thumbnail || videoThumb?.url;

  return (
    <div className="rounded-[11px] bg-[#0e1012] p-[10px] md:rounded-[22px] md:p-[20px]">
      {/* Header row */}
      <div className="mb-[10px] flex items-start justify-between md:mb-[16px]">
        <p className="flex-1 whitespace-pre-wrap text-[12px] text-[#f8f8f8] md:text-[16px]">
          {post.text || ''}
        </p>
        <div className="flex shrink-0 items-center gap-[8px]">
          <span className="text-[10px] text-[#5d5d5d] md:text-[14px]">
            {timeAgo(post.createdAt)}
          </span>
          <button
            onClick={() => onMenuClick(post.id)}
            className="flex size-[24px] items-center justify-center rounded-full hover:bg-[#15191c]"
          >
            <span className="text-[18px] leading-none text-[#5d5d5d]">&#8942;</span>
          </button>
        </div>
      </div>

      {/* Media */}
      {thumb && (
        <div className="relative mb-[12px] h-[180px] overflow-hidden rounded-[12px] md:mb-[20px] md:h-[300px] md:rounded-[22px]">
          <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {videoThumb && !mainImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex items-center gap-[6px] rounded-[56px] bg-[#15191c] py-[4px] pl-[4px] pr-[14px]">
                <img
                  src={`${IMG}/play-button.webp`}
                  alt=""
                  className="size-[22px] object-contain md:size-[36px]"
                />
                <span className="text-[12px] text-[#f8f8f8] md:text-[16px]">Play</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-[16px] md:gap-[30px]">
        <button className="flex items-center gap-[4px] text-[#f8f8f8] hover:opacity-80 md:gap-[8px]">
          <img src={`${IMG}/favorite.svg`} alt="" className="size-[14px] md:size-[20px]" />
          <span className="text-[11px] md:text-[14px]">{post.likeCount}</span>
        </button>
        <button className="flex items-center gap-[4px] text-[#f8f8f8] hover:opacity-80 md:gap-[8px]">
          <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[14px] md:size-[20px]" />
          <span className="text-[11px] md:text-[14px]">{post.commentCount}</span>
        </button>
        <button className="flex items-center gap-[4px] text-[#f8f8f8] hover:opacity-80 md:gap-[8px]">
          <img src={`${IMG}/share.svg`} alt="" className="size-[14px] md:size-[20px]" />
          <span className="text-[11px] md:text-[14px]">{post.shareCount}</span>
        </button>
      </div>
    </div>
  );
}
