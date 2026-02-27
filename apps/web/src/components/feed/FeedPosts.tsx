const IMG = '/icons/dashboard';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

interface Media {
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
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostActions({ post }: { post: FeedPost }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[16px] md:gap-[36px]">
        <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
          <img src={`${IMG}/favorite.svg`} alt="" className="size-[12px] md:size-[20px]" />
          <span className="text-[10px] font-normal md:text-[16px]">{post.likeCount} Likes</span>
        </button>
        <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
          <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[12px] md:size-[20px]" />
          <span className="text-[10px] font-normal md:text-[16px]">
            {post.commentCount} Comments
          </span>
        </button>
        <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
          <img src={`${IMG}/share.svg`} alt="" className="size-[12px] md:size-[20px]" />
          <span className="text-[10px] font-normal md:text-[16px]">{post.shareCount} Share</span>
        </button>
      </div>
      <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
        <img src={`${IMG}/volunteer-activism.svg`} alt="" className="size-[12px] md:size-[20px]" />
        <span className="text-[10px] font-normal md:text-[16px]">Tip</span>
      </button>
    </div>
  );
}

function PostHeader({ post }: { post: FeedPost }) {
  return (
    <div className="flex w-full items-start justify-between gap-[10px] md:gap-[25px]">
      <div className="flex flex-1 flex-col gap-[6px] md:gap-[14px]">
        <div className="flex items-center gap-[6px]">
          <div className="size-[24px] shrink-0 overflow-hidden rounded-full md:size-[44px]">
            <img src={post.author.avatar || ''} alt="" className="size-full object-cover" />
          </div>
          <div className="flex items-center gap-[2px]">
            <div className="whitespace-pre-wrap text-[0px] font-normal text-[#f8f8f8]">
              <p className="mb-0 text-[12px] md:text-[16px]">{post.author.displayName}</p>
              <p className="text-[8px] text-[#5d5d5d] md:text-[12px]">@{post.author.username}</p>
            </div>
            {post.author.isVerified && (
              <img
                src={`${IMG}/verified.svg`}
                alt="Verified"
                className="size-[12px] md:size-[16px]"
              />
            )}
          </div>
        </div>
        <p className="whitespace-pre-wrap text-[10px] font-normal leading-normal text-[#f8f8f8] md:text-[16px]">
          {post.text}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-[8px] md:gap-[18px]">
        <span className="text-[8px] font-normal text-[#5d5d5d] md:text-[16px]">
          {timeAgo(post.createdAt)}
        </span>
        <div className="flex size-[11px] items-center justify-center md:size-[24px]">
          <img src={`${IMG}/pending.svg`} alt="" className="size-full rotate-90" />
        </div>
      </div>
    </div>
  );
}

export function ImagePost({ post }: { post: FeedPost }) {
  const images = post.media.filter((m) => m.type === 'IMAGE');
  return (
    <div className="rounded-[11px] bg-[#0e1012] px-[9px] py-[6px] md:rounded-[22px] md:px-[20px] md:py-[13px]">
      <div className="flex w-full flex-col gap-[11px] md:gap-[25px]">
        <PostHeader post={post} />
        <div className="flex w-full flex-col gap-[11px] md:gap-[20px]">
          {images.length > 0 && (
            <div className="flex w-full gap-[11px] md:gap-[20px]">
              <div className="relative h-[160px] w-[60%] shrink-0 overflow-hidden rounded-[22px] md:h-[356px] md:w-[518px]">
                <img
                  src={images[0]?.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex flex-1 flex-col gap-[10px] md:gap-[20px]">
                  <div className="relative h-[75px] overflow-hidden rounded-[22px] md:h-[168px]">
                    <img
                      src={images[1]?.url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {images.length > 2 && (
                    <div className="relative h-[75px] overflow-hidden rounded-[22px] md:h-[168px]">
                      <div
                        className="absolute inset-0 rounded-[22px] blur-[30.3px]"
                        style={{
                          maskImage: `url('${IMG}/post-image-mask.webp')`,
                          WebkitMaskImage: `url('${IMG}/post-image-mask.webp')`,
                          maskSize: 'cover',
                          WebkitMaskSize: 'cover',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                        }}
                      >
                        <img
                          src={images[2]?.url}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-center text-[12px] font-normal text-[#f8f8f8] md:text-[20px]">
                          +08
                          <br />
                          More
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <PostActions post={post} />
        </div>
      </div>
    </div>
  );
}

export function VideoPost({ post }: { post: FeedPost }) {
  const video = post.media.find((m) => m.type === 'VIDEO');
  return (
    <div className="relative rounded-[11px] bg-[#0e1012] md:rounded-[22px]">
      <div className="flex items-start justify-between gap-[10px] px-[9px] pt-[6px] md:gap-[25px] md:px-[20px] md:pt-[13px]">
        <PostHeader post={post} />
      </div>
      {video && (
        <div className="relative mx-[9px] mt-[11px] h-[161px] overflow-hidden rounded-[10px] md:mx-[20px] md:mt-[25px] md:h-[356px] md:rounded-[22px]">
          <div className="absolute inset-0 overflow-hidden rounded-[10px] md:rounded-[22px]">
            <img
              src={video.thumbnail || video.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-[10px] bg-[rgba(21,25,28,0.55)] md:rounded-[22px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button className="flex items-center justify-center gap-[5px] rounded-[56px] bg-[#15191c] py-px pl-px pr-[15px] md:gap-[10px] md:rounded-[124px] md:pr-[34px]">
              <img
                src={`${IMG}/play-button.webp`}
                alt=""
                className="size-[22px] object-contain md:size-[48px]"
              />
              <span className="text-[9px] font-normal text-[#f8f8f8] md:text-[20px]">Play</span>
            </button>
          </div>
          <div className="absolute bottom-[20px] left-[12px] h-[9px] w-[calc(100%-24px)] md:bottom-[34px] md:left-[15px] md:h-[24px] md:w-[calc(100%-30px)]">
            <img
              src={`${IMG}/video-progress.svg`}
              alt=""
              className="absolute block size-full max-w-none"
            />
          </div>
          <p className="absolute bottom-[8px] left-[27px] text-[8px] font-normal text-[#f8f8f8] md:bottom-[11px] md:left-[43px] md:text-[16px]">
            00:00 / 03:15
          </p>
        </div>
      )}
      <div className="px-[9px] py-[11px] md:px-[20px] md:py-[20px]">
        <PostActions post={post} />
      </div>
    </div>
  );
}
