import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logoutApi } from '../../lib/auth';
import { api } from '../../lib/api';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; username: string; displayName: string; avatar: string | null }[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
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
        setSearchResults(res.data.data?.creators || []);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      /* best-effort */
    }
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-50 px-[26px] pt-[26px] pb-[10px] bg-[#15191c]">
      <div className="flex h-[74px] items-center justify-between rounded-[181px] bg-[#0e1012] pl-[40px] pr-[6px]">
        {/* Logo */}
        <Link to="/feed" className="shrink-0">
          <img
            src="/icons/dashboard/fansbook-logo.webp"
            alt="Fansbook"
            className="h-[44px] w-auto"
          />
        </Link>

        <div className="flex items-center gap-[60px]">
          {/* Search + Icons */}
          <div className="hidden items-center gap-[6px] md:flex">
            <div className="relative" ref={searchRef}>
              <div className="flex items-center gap-[10px] rounded-[52px] bg-[#15191c] py-[10px] pl-[10px] pr-[16px]">
                <img
                  src="/icons/dashboard/search.svg"
                  alt=""
                  className="h-[24px] w-[24px]"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-[200px] bg-transparent text-[16px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
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
                        to={`/creator/${r.username}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
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
            <button className="shrink-0" aria-label="Notifications">
              <img
                src="/icons/dashboard/bell-icon.svg"
                alt=""
                className="h-[44px] w-[44px]"
              />
            </button>
            <button className="shrink-0" aria-label="Messages">
              <img
                src="/icons/dashboard/message-icon.svg"
                alt=""
                className="h-[44px] w-[44px]"
              />
            </button>
          </div>

          {/* User */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-[6px]"
            >
              <div className="text-right">
                <p className="text-[16px] text-[#f8f8f8] leading-tight">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-[12px] text-[#5d5d5d] leading-tight">
                  @{user?.username || 'user'}
                </p>
              </div>
              <div className="h-[44px] w-[44px] shrink-0 overflow-hidden rounded-full">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] font-medium text-white">
                    {(user?.displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <img
                src="/icons/dashboard/arrow-drop-down.svg"
                alt=""
                className="h-[24px] w-[24px]"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-[4px] w-[101px] rounded-[10px] bg-[#f8f8f8] py-[10px] shadow-[0px_-5px_20px_0px_rgba(0,0,0,0.1)]">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-[15px] py-[4px] text-[16px] text-[#15191c] hover:bg-black/5"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-[15px] py-[4px] text-left text-[16px] text-[#15191c] hover:bg-black/5"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
