import { useEffect, useState, useRef, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/context/SidebarContext';
import { useLogin } from '@/context/LoginContext';
import { tmdb, getImageUrl, getTitle } from '@/services/tmdb';
import type { MediaItem } from '@/types';

export default function Header() {
  const { open: openSidebar } = useSidebar();
  const { open: openLogin } = useLogin();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleInputChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await tmdb.search(value.trim(), 1);
        setSuggestions(res.results.slice(0, 8).filter((r) => r.media_type === 'movie' || r.media_type === 'tv'));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  };

  const doSearch = (q: string) => {
    if (q.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(q.trim())}`);
      setKeyword('');
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    doSearch(keyword);
  };

  const handleSuggestionClick = (item: MediaItem) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie';
    const title = getTitle(item);
    const year = (item.release_date || item.first_air_date || '').slice(0, 4);
    const slug = `${item.id}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${year}-online-hd`;
    navigate(`/${type}/${slug}`);
    setKeyword('');
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className={`sflix-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <button className="header-browse min-touch-target" onClick={openSidebar} aria-label="Browse menu">
          <i className="fas fa-bars" /> <span className="browse-text">Browse</span>
        </button>

        <Link to="/home" className="header-logo" aria-label="SFlix Home">
          <img src="/logo.png" alt="SFlix" className="header-logo-img" />
        </Link>

        <form className="header-search desktop-search" onSubmit={handleSearch} ref={searchRef}>
          <div className="header-search-wrapper">
            <i className="fas fa-search header-search-icon" />
            <input
              type="text"
              className="header-search-input"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((item) => {
                const type = item.media_type === 'tv' ? 'tv' : 'movie';
                const poster = getImageUrl(item.poster_path, 'w300');
                return (
                  <button
                    key={`${item.id}-${item.media_type}`}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {poster ? (
                      <img src={poster} alt="" className="suggestion-poster" />
                    ) : (
                      <div className="suggestion-poster-placeholder">
                        <i className="fas fa-film" />
                      </div>
                    )}
                    <div className="suggestion-info">
                      <div className="suggestion-title">{getTitle(item)}</div>
                      <div className="suggestion-type">
                        {type === 'movie' ? 'Movie' : 'TV Show'}
                        {item.vote_average > 0 && ` • ${item.vote_average.toFixed(1)}`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </form>

        <button className="header-search-mobile-btn min-touch-target" onClick={() => setMobileSearchOpen(true)} aria-label="Open search">
          <i className="fas fa-search" />
        </button>

        <button className="header-login min-touch-target" onClick={openLogin} aria-label="Login">
          <i className="fas fa-user" /> <span className="login-text">Login</span>
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-bar">
            <button className="mobile-search-back min-touch-target" onClick={() => { setMobileSearchOpen(false); setShowSuggestions(false); }} aria-label="Close search">
              <i className="fas fa-arrow-left" />
            </button>
            <div className="mobile-search-input-wrap">
              <i className="fas fa-search mobile-search-icon" />
              <input
                ref={mobileInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Search movies, TV shows..."
                value={keyword}
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>
            <button className="mobile-search-go min-touch-target" onClick={() => doSearch(keyword)} aria-label="Submit search">
              <i className="fas fa-arrow-right" />
            </button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="mobile-suggestions">
              {suggestions.map((item) => {
                const type = item.media_type === 'tv' ? 'tv' : 'movie';
                const poster = getImageUrl(item.poster_path, 'w300');
                return (
                  <button
                    key={`${item.id}-${item.media_type}`}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {poster ? (
                      <img src={poster} alt="" className="suggestion-poster" />
                    ) : (
                      <div className="suggestion-poster-placeholder">
                        <i className="fas fa-film" />
                      </div>
                    )}
                    <div className="suggestion-info">
                      <div className="suggestion-title">{getTitle(item)}</div>
                      <div className="suggestion-type">
                        {type === 'movie' ? 'Movie' : 'TV Show'}
                        {item.vote_average > 0 && ` • ${item.vote_average.toFixed(1)}`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        .sflix-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          transition: background 0.3s ease;
          height: 60px;
        }

        .sflix-header.scrolled {
          background: var(--bg-dark);
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 60px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-browse {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          white-space: nowrap;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }

        .header-browse:hover { color: var(--accent-blue); }
        .header-browse:active { color: var(--accent-blue); }

        .header-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .header-logo-img {
          height: 32px;
          width: auto;
          display: block;
        }

        .header-search {
          flex: 1;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }

        .header-search-wrapper {
          position: relative;
        }

        .header-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 0.85rem;
          z-index: 1;
        }

        .header-search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border-radius: 50px;
          border: 1px solid var(--bg-tertiary);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .header-search-input:focus { border-color: var(--accent-blue); }
        .header-search-input::placeholder { color: var(--text-muted); }

        .header-search-mobile-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.5rem;
          align-items: center;
          justify-content: center;
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 8px;
          overflow: hidden;
          z-index: 1001;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: slideDown 0.2s ease-out;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          text-align: left;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.15s ease;
        }

        .suggestion-item:hover { background: var(--bg-tertiary); }
        .suggestion-item:active { background: var(--bg-tertiary); }

        .suggestion-poster {
          width: 36px;
          height: 54px;
          object-fit: cover;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .suggestion-poster-placeholder {
          width: 36px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          border-radius: 3px;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .suggestion-info { min-width: 0; }

        .suggestion-title {
          font-size: 0.82rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .suggestion-type {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .header-login {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .header-login:hover { color: var(--accent-blue); }
        .header-login:active { color: var(--accent-blue); }

        /* Mobile search overlay */
        .mobile-search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-dark);
          z-index: 2000;
          animation: fadeIn 0.2s ease-out;
        }

        .mobile-search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-bottom: 1px solid var(--bg-tertiary);
        }

        .mobile-search-back,
        .mobile-search-go {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }

        .mobile-search-input-wrap {
          flex: 1;
          position: relative;
        }

        .mobile-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 0.9rem;
          z-index: 1;
        }

        .mobile-search-input {
          width: 100%;
          padding: 12px 12px 12px 38px;
          border-radius: 50px;
          border: 1px solid var(--bg-tertiary);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 1rem;
          font-family: 'Montserrat', sans-serif;
          outline: none;
        }

        .mobile-search-input:focus { border-color: var(--accent-blue); }
        .mobile-search-input::placeholder { color: var(--text-muted); }

        .mobile-suggestions {
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          padding: 0.5rem 0;
        }

        .mobile-suggestions .suggestion-item {
          padding: 0.75rem 1rem;
        }

        .mobile-suggestions .suggestion-poster {
          width: 40px;
          height: 60px;
        }

        @media (max-width: 576px) {
          .browse-text, .login-text { display: none; }
          .desktop-search { display: none; }
          .header-search-mobile-btn { display: flex; }
          .header-inner { gap: 0.5rem; padding: 0 0.5rem; }
          .header-logo-img { height: 28px; }
        }

        @media (min-width: 577px) {
          .header-search-mobile-btn { display: none; }
        }
      `}</style>
    </header>
  );
}
