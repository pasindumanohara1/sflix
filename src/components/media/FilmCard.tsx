import { Link } from 'react-router-dom';
import type { MediaItem } from '@/types';
import { getImageUrl, getYear, getTitle, getMediaType, getSlug } from '@/services/tmdb';

interface FilmCardProps {
  item: MediaItem;
}

export default function FilmCard({ item }: FilmCardProps) {
  const poster = getImageUrl(item.poster_path, 'w500');
  const slug = getSlug(item);
  const type = getMediaType(item);
  const year = getYear(item);
  const title = getTitle(item);

  return (
    <div className="film-card">
      <Link to={`/${type}/${slug}`} className="film-card-poster-link" aria-label={title}>
        <div className="film-card-poster-wrapper">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="film-card-poster"
              loading="lazy"
            />
          ) : (
            <div className="film-card-poster-placeholder">
              <i className="fas fa-film" />
            </div>
          )}
        </div>
      </Link>
      <div className="film-card-meta">
        <span className="film-card-year">{year}</span>
        <span className="film-card-type">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
      </div>
      <Link to={`/${type}/${slug}`} className="film-card-title" aria-label={title}>
        {title}
      </Link>
      <Link to={`/${type}/${slug}`} className="film-card-watch">
        <i className="fas fa-play" /> Watch now
      </Link>

      <style>{`
        .film-card {
          display: flex;
          flex-direction: column;
        }

        .film-card-poster-link {
          display: block;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .film-card-poster-wrapper {
          aspect-ratio: 2 / 3;
          background: var(--bg-secondary);
          overflow: hidden;
          border-radius: 8px;
        }

        .film-card-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .film-card-poster-wrapper:hover .film-card-poster {
          transform: scale(1.08);
        }

        @media (hover: none) {
          .film-card-poster-wrapper:hover .film-card-poster {
            transform: none;
          }
        }

        .film-card-poster-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 2rem;
        }

        .film-card-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: 0.72rem;
          margin-bottom: 0.2rem;
        }

        .film-card-year {
          color: var(--text-muted);
          font-weight: 500;
        }

        .film-card-type {
          color: var(--accent-blue);
          font-weight: 500;
        }

        .film-card-title {
          color: var(--text-primary);
          font-size: 0.82rem;
          font-weight: 500;
          line-height: 1.3;
          margin-bottom: 0.4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .film-card-title:hover {
          color: var(--accent-blue);
          text-decoration: none;
        }

        .film-card-watch {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 4px 12px;
          border-radius: 50px;
          background: var(--bg-tertiary);
          color: var(--accent-blue);
          font-size: 0.72rem;
          font-weight: 500;
          align-self: flex-start;
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .film-card-watch:hover {
          background: var(--accent-blue);
          color: #fff;
          text-decoration: none;
          transform: translateY(-1px);
        }

        .film-card-watch:active {
          transform: translateY(0);
        }

        .film-card-watch i {
          font-size: 0.6rem;
        }

        @media (max-width: 576px) {
          .film-card-meta { font-size: 0.68rem; }
          .film-card-title { font-size: 0.78rem; }
          .film-card-watch { font-size: 0.68rem; padding: 3px 10px; }
        }
      `}</style>
    </div>
  );
}
