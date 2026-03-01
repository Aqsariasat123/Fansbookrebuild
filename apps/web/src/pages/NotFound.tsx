import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 font-outfit">
      {/* Illustration */}
      <div className="relative mb-8">
        <svg width="200" height="140" viewBox="0 0 200 140" fill="none" className="opacity-20">
          <circle cx="100" cy="70" r="60" stroke="#01adf1" strokeWidth="2" strokeDasharray="8 4" />
          <circle
            cx="100"
            cy="70"
            r="40"
            stroke="#a61651"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <path
            d="M80 60 L90 70 L80 80"
            stroke="#5d5d5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M120 60 L110 70 L120 80"
            stroke="#5d5d5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M90 95 Q100 85 110 95"
            stroke="#5d5d5d"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[64px] font-bold text-muted-foreground/30">
          404
        </span>
      </div>

      <h1 className="text-[32px] font-medium text-foreground">Page Not Found</h1>
      <p className="mt-2 text-center text-[14px] text-muted-foreground max-w-[400px]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mt-6 w-full max-w-[380px]">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for something..."
            className="w-full rounded-[52px] border border-border bg-card px-[20px] py-[12px] pr-[48px] text-[14px] text-foreground placeholder:text-muted-foreground focus:border-[#01adf1] focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggested links */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/feed"
          className="rounded-[50px] border border-border px-5 py-2 text-[13px] text-foreground hover:bg-card transition-colors"
        >
          Home Feed
        </Link>
        <Link
          to="/explore"
          className="rounded-[50px] border border-border px-5 py-2 text-[13px] text-foreground hover:bg-card transition-colors"
        >
          Explore
        </Link>
        <Link
          to="/creators"
          className="rounded-[50px] border border-border px-5 py-2 text-[13px] text-foreground hover:bg-card transition-colors"
        >
          Creators
        </Link>
        <Link
          to="/contact"
          className="rounded-[50px] border border-border px-5 py-2 text-[13px] text-foreground hover:bg-card transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
