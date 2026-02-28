import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface SearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/creators', { params: { search: searchQuery, limit: 6 } });
        setSearchResults(res.data.data?.items || []);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center gap-[10px] rounded-[52px] bg-[#15191c] py-[10px] pl-[10px] pr-[20px]">
        <img src="/icons/dashboard/search.svg" alt="" className="h-[24px] w-[24px]" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          className="w-[240px] bg-transparent text-[16px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
        />
      </div>
      {searchOpen && searchQuery.trim() && (
        <div className="absolute left-0 top-full mt-[4px] w-[300px] rounded-[12px] bg-[#0e1012] border border-[#2a2a2a] py-[8px] shadow-lg z-50 max-h-[320px] overflow-y-auto">
          {searchResults.length === 0 ? (
            <p className="px-[16px] py-[12px] text-[14px] text-[#5d5d5d]">No creators found</p>
          ) : (
            searchResults.map((r) => (
              <Link
                key={r.id}
                to={`/u/${r.username}`}
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-[10px] px-[16px] py-[8px] hover:bg-[#15191c] transition-colors"
              >
                <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full">
                  {r.avatar ? (
                    <img src={r.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[14px] font-medium text-white">
                      {r.displayName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[14px] text-[#f8f8f8] leading-tight">{r.displayName}</p>
                  <p className="text-[12px] text-[#5d5d5d] leading-tight">@{r.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
