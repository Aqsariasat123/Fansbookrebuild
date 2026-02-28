import { Link } from 'react-router-dom';

export function PostComposerBar() {
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-card px-[20px] py-[16px]">
      <div className="flex-1 rounded-[52px] bg-muted px-4 py-3 text-[14px] text-muted-foreground">
        Compose new post...
      </div>
      <Link
        to="/creator/post/new"
        className="shrink-0 rounded-[12px] bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-[14px] font-medium text-white"
      >
        Add Post
      </Link>
    </div>
  );
}
