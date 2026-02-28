interface TopPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
}

export function TopPostsList({ posts }: { posts: TopPost[] }) {
  return (
    <div className="rounded-[22px] bg-card p-[20px]">
      <p className="mb-[14px] text-[16px] text-foreground">Top Performing Posts</p>
      {posts.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No posts yet</p>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="flex items-center gap-[12px] rounded-[12px] bg-muted p-[12px]"
            >
              <span className="text-[14px] font-medium text-muted-foreground">#{i + 1}</span>
              <p className="flex-1 truncate text-[14px] text-foreground">
                {post.text || '(Media post)'}
              </p>
              <div className="flex gap-3 text-[12px] text-muted-foreground">
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
