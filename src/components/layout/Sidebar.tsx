import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '@/context/SidebarContext';
import { GENRE_MAP, COUNTRY_MAP } from '@/types';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const [genreOpen, setGenreOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const genres = Object.entries(GENRE_MAP).map(([id, name]) => ({
    id: Number(id),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }));

  const countries = Object.entries(COUNTRY_MAP).map(([code, name]) => ({
    code,
    name,
  }));

  const navLinks = [
    { label: 'Home', icon: 'fa-home', to: '/home' },
    { label: 'Movies', icon: 'fa-play', to: '/movies' },
    { label: 'TV Shows', icon: 'fa-play', to: '/tv-show' },
    { label: 'Trending', icon: 'fa-fire', to: '/trending' },
  ];

  const handleLinkClick = () => close();

  return (
    <>
      <div className={`sidebar-overlay${isOpen ? ' active' : ''}`} onClick={close} />
      <nav className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={close} aria-label="Close sidebar">
            <i className="fas fa-arrow-left" />
          </button>
        </div>

        <div className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="sidebar-nav-link"
              onClick={handleLinkClick}
            >
              <i className={`fas ${link.icon}`} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-accordion">
          <button
            className={`sidebar-accordion-btn${genreOpen ? ' open' : ''}`}
            onClick={() => setGenreOpen(!genreOpen)}
          >
            <span>Genre</span>
            <i className={`fas fa-chevron-${genreOpen ? 'up' : 'down'}`} />
          </button>
          {genreOpen && (
            <div className="sidebar-accordion-content">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.slug}`}
                  className="sidebar-item"
                  onClick={handleLinkClick}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-accordion">
          <button
            className={`sidebar-accordion-btn${countryOpen ? ' open' : ''}`}
            onClick={() => setCountryOpen(!countryOpen)}
          >
            <span>Country</span>
            <i className={`fas fa-chevron-${countryOpen ? 'up' : 'down'}`} />
          </button>
          {countryOpen && (
            <div className="sidebar-accordion-content">
              {countries.map((c) => (
                <Link
                  key={c.code}
                  to={`/country/${c.code}`}
                  className="sidebar-item"
                  onClick={handleLinkClick}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1100;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .sidebar-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 85vw;
          background: var(--bg-dark);
          z-index: 1101;
          transform: translateX(-100%);
          transition: transform 0.3s;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .sidebar-close {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .sidebar-nav {
          padding: 0 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .sidebar-nav-link:hover {
          background: var(--bg-secondary);
          color: var(--accent-blue);
          text-decoration: none;
        }

        .sidebar-nav-link i {
          width: 20px;
          text-align: center;
          color: var(--text-muted);
        }

        .sidebar-divider {
          height: 1px;
          background: var(--bg-tertiary);
          margin: 0 1rem;
        }

        .sidebar-accordion {
          padding: 0.5rem 1rem;
        }

        .sidebar-accordion-btn {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0;
          cursor: pointer;
        }

        .sidebar-accordion-btn i {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sidebar-accordion-content {
          display: flex;
          flex-direction: column;
          padding: 0.25rem 0;
        }

        .sidebar-item {
          padding: 0.4rem 0.75rem;
          color: var(--text-secondary);
          font-size: 0.85rem;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }

        .sidebar-item:hover {
          background: var(--bg-secondary);
          color: var(--accent-blue);
          text-decoration: none;
        }

        @media (max-width: 576px) {
          .sidebar {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
