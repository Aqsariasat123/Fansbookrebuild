import { LockedPostOverlay } from './LockedPostOverlay';

const IMG = '/icons/dashboard';

export interface PublicPost {
  id: string;
  text: string | null;
  visibility: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  media: { id: string; url: string; type: string }[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface PostCardProps {
  post: PublicPost;
  isSubscribed: boolean;
}

function resolveMedia(media: PublicPost['media']) {
  const image = media.find((m) => m.type === 'IMAGE');
  const video = media.find((m) => m.type === 'VIDEO');
  return { thumb: image?.url ?? video?.url, isVideo: !image && !!video };
}

export function PostCard({ post, isSubscribed }: PostCardProps) {
  const isLocked = !isSubscribed && post.visibility !== 'FREE';
  const { thumb, isVideo } = resolveMedia(post.media);

  return (
    <div className="relative rounded-[11px] bg-[#0e1012] p-[10px] md:rounded-[22px] md:p-[20px]">
      {isLocked && <LockedPostOverlay />}

      <div className={isLocked ? 'pointer-events-none blur-sm' : ''}>
        {/* Text */}
        <div className="mb-[10px] flex items-start justify-between md:mb-[16px]">
          <p className="flex-1 whitespace-pre-wrap text-[12px] text-[#f8f8f8] md:text-[16px]">
            {post.text || ''}
          </p>
          <span className="shrink-0 text-[10px] text-[#5d5d5d] md:text-[14px]">
            {timeAgo(post.createdAt)}
          </span>
        </div>

        {/* Media */}
        {thumb && (
          <div className="relative mb-[12px] h-[180px] overflow-hidden rounded-[12px] md:mb-[20px] md:h-[300px] md:rounded-[22px]">
            <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {isVideo && (
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
          <div className="flex items-center gap-[4px] text-[#f8f8f8] md:gap-[8px]">
            <img src={`${IMG}/favorite.svg`} alt="" className="size-[14px] md:size-[20px]" />
            <span className="text-[11px] md:text-[14px]">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-[4px] text-[#f8f8f8] md:gap-[8px]">
            <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[14px] md:size-[20px]" />
            <span className="text-[11px] md:text-[14px]">{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
