import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import FilmCard from '@/components/media/FilmCard';
import TrailerModal from '@/components/common/TrailerModal';
import RateWidget from '@/components/common/RateWidget';
import ShareWidget from '@/components/common/ShareWidget';
import AdSlot from '@/components/common/AdSlot';
import { tmdb, getImageUrl, getTitle, parseSlug } from '@/services/tmdb';
import { SERVERS, getEmbedUrl } from '@/services/servers';
import type { MediaDetails } from '@/types';

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  let id: number | null = null;
  try {
    if (slug) id = parseSlug(slug).id;
  } catch {}

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tmdb.getMovieById(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="detail-loader"><i className="fas fa-spinner fa-spin" /> Loading...</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="container" style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>
          Movie not found
        </div>
      </Layout>
    );
  }

  const backdrop = getImageUrl(data.backdrop_path, 'original');
  const poster = getImageUrl(data.poster_path, 'w500');
  const title = getTitle(data as any);
  const trailer = data.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = data.credits?.cast?.slice(0, 8) || [];
  const genres = data.genres || [];
  const quality = data.vote_average >= 7 ? 'HD' : data.vote_average >= 5 ? 'TS' : 'CAM';
  const qualityClass = quality === 'HD' ? 'quality-hd' : quality === 'TS' ? 'quality-ts' : 'quality-cam';
  const similar = data.similar?.results?.slice(0, 12) || [];

  const slugForWatch = slug;

  return (
    <Layout>
      <Helmet>
        <title>{title} - SFlix | Watch HD Movies Online Free</title>
        <meta name="description" content={`Watch ${title} online free in HD quality at SFlix. Stream the latest movies and TV shows.`} />
      </Helmet>

      {backdrop && (
        <div className="detail-backdrop-wrapper">
          <img src={backdrop} alt="" className="detail-backdrop" />
          <div className="detail-backdrop-overlay" />
        </div>
      )}

      <div className="detail-content container">
        <div className="detail-main">
          {poster && (
            <div className="detail-poster-wrapper">
              <img src={poster} alt={title} className="detail-poster" />
            </div>
          )}

          <div className="detail-info">
            <h1 className="detail-title">{title}</h1>

            <div className="detail-stats">
              <span className={`detail-quality ${qualityClass}`}>{quality}</span>
              <span className="detail-rating">
                <i className="fas fa-star" /> {data.vote_average.toFixed(1)}
              </span>
              {trailer && (
                <button className="detail-trailer-link" onClick={() => setTrailerOpen(true)}>
                  <i className="fas fa-play" /> Trailer
                </button>
              )}
              <span className="detail-duration">
                <i className="far fa-clock" /> {data.runtime ? `${data.runtime} min` : '-- min'}
              </span>
            </div>

            <div className="detail-servers">
              {SERVERS.slice(0, 5).map((server) => (
                <Link
                  key={server.id}
                  to={`/watch/${slugForWatch}?server=${server.id}`}
                  className="server-btn"
                >
                  <i className="fas fa-play" /> {server.name}
                </Link>
              ))}
            </div>

            <p className="detail-overview">{data.overview}</p>

            <div className="detail-metadata">
              {data.release_date && (
                <div className="detail-meta-row">
                  <span className="meta-label">Released:</span>
                  <span className="meta-value">{data.release_date}</span>
                </div>
              )}
              {genres.length > 0 && (
                <div className="detail-meta-row">
                  <span className="meta-label">Genre:</span>
                  <span className="meta-value">
                    {genres.map((g) => (
                      <Link key={g.id} to={`/genre/${g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="meta-link">
                        {g.name}
                      </Link>
                    ))}
                  </span>
                </div>
              )}
              {cast.length > 0 && (
                <div className="detail-meta-row">
                  <span className="meta-label">Cast:</span>
                  <span className="meta-value">
                    {cast.map((c, i) => (
                      <span key={c.id}>
                        <span className="meta-link">{c.name}</span>
                        {i < cast.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                </div>
              )}
              <div className="detail-meta-row">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{data.runtime ? `${data.runtime} min` : '-- min'}</span>
              </div>
              {data.production_countries?.length > 0 && (
                <div className="detail-meta-row">
                  <span className="meta-label">Country:</span>
                  <span className="meta-value">{data.production_countries.map((c) => c.name).join(', ')}</span>
                </div>
              )}
            </div>

            <div className="detail-tags">
              <span className="tag-badge">Watch {title} Online Free</span>
              <span className="tag-badge">{title} HD</span>
              <span className="tag-badge">Stream {title}</span>
            </div>

            <div className="detail-tools">
              <RateWidget voteAverage={data.vote_average} voteCount={data.vote_count} />
              <ShareWidget />
            </div>
          </div>
        </div>

        <AdSlot position="detail" />

      {similar.length > 0 && (
          <div className="detail-similar">
            <h3>You may also like</h3>
            <div className="similar-grid stagger-grid">
              {similar.map((item) => (
                <FilmCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} trailerKey={trailer?.key || null} />

      <style>{`
        .detail-loader {
          padding: 4rem;
          text-align: center;
          color: var(--text-muted);
        }

        .detail-backdrop-wrapper {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .detail-backdrop {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-backdrop-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%);
        }

        .detail-content {
          margin-top: -100px;
          position: relative;
          z-index: 1;
          padding-bottom: 3rem;
        }

        .detail-main {
          display: flex;
          gap: 2rem;
        }

        .detail-poster-wrapper {
          flex-shrink: 0;
          width: 220px;
        }

        .detail-poster {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .detail-info {
          flex: 1;
          min-width: 0;
        }

        .detail-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .detail-stats {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail-quality {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .detail-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--star-rating);
          font-weight: 600;
        }

        .detail-trailer-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          color: var(--accent-blue);
          cursor: pointer;
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          padding: 0;
        }

        .detail-trailer-link:hover { text-decoration: underline; }

        .detail-duration {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .detail-servers {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .server-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 8px 16px;
          border-radius: 6px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          color: var(--text-primary);
          font-size: 0.8rem;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }

        .server-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
          text-decoration: none;
        }

        .server-btn i {
          color: var(--accent-blue);
          font-size: 0.75rem;
        }

        .detail-overview {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .detail-metadata {
          margin-bottom: 1rem;
        }

        .detail-meta-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
          font-size: 0.85rem;
        }

        .meta-label {
          color: var(--text-muted);
          flex-shrink: 0;
          min-width: 70px;
        }

        .meta-value {
          color: var(--text-secondary);
        }

        .meta-link {
          color: var(--accent-blue);
        }

        .meta-link:hover { text-decoration: underline; }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .tag-badge {
          padding: 4px 10px;
          border-radius: 50px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .detail-tools {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .detail-similar {
          margin-top: 2rem;
        }

        .detail-similar h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .similar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        @media (max-width: 992px) {
          .similar-grid { grid-template-columns: repeat(4, 1fr); }
          .detail-poster-wrapper { width: 160px; }
        }

        @media (max-width: 768px) {
          .detail-main { flex-direction: column; align-items: center; text-align: center; }
          .detail-poster-wrapper { width: 180px; }
          .detail-stats { justify-content: center; }
          .detail-servers { justify-content: center; }
          .detail-tools { justify-content: center; }
          .similar-grid { grid-template-columns: repeat(3, 1fr); }
          .detail-backdrop-wrapper { height: 200px; }
          .detail-content { margin-top: -60px; }
        }

        @media (max-width: 576px) {
          .similar-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .detail-poster-wrapper { width: 140px; }
          .detail-title { font-size: 1.2rem; }
          .detail-stats { font-size: 0.8rem; gap: 0.5rem; }
          .detail-overview { font-size: 0.82rem; }
          .server-btn { font-size: 0.72rem; padding: 6px 10px; }
          .detail-servers { gap: 0.35rem; }
          .detail-tools { flex-direction: column; align-items: center; }
        }
      `}</style>
    </Layout>
  );
}
