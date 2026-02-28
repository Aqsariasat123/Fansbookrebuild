interface TopPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
}

export function TopPostsList({ posts }: { posts: TopPost[] }) {
  return (
    <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
      <p className="mb-[14px] text-[16px] text-[#f8f8f8]">Top Performing Posts</p>
      {posts.length === 0 ? (
        <p className="text-[14px] text-[#5d5d5d]">No posts yet</p>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="flex items-center gap-[12px] rounded-[12px] bg-[#15191c] p-[12px]"
            >
              <span className="text-[14px] font-medium text-[#5d5d5d]">#{i + 1}</span>
              <p className="flex-1 truncate text-[14px] text-[#f8f8f8]">
                {post.text || '(Media post)'}
              </p>
              <div className="flex gap-3 text-[12px] text-[#5d5d5d]">
                <span>{post.likeCount} likes</span>
                <span>{post.commentCount} comments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
