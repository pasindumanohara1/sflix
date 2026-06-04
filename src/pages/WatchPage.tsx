import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { tmdb, getImageUrl, getTitle, parseSlug } from '@/services/tmdb';
import { SERVERS, getEmbedUrl } from '@/services/servers';
import type { MediaDetails } from '@/types';

export default function WatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  const serverParam = searchParams.get('server') || 'vidsrc-me';
  const season = Number(searchParams.get('season')) || 1;
  const episode = Number(searchParams.get('episode')) || 1;

  let id: number | null = null;
  let mediaType: 'movie' | 'tv' = 'movie';
  try {
    if (slug) {
      const parsed = parseSlug(slug);
      id = parsed.id;
    }
  } catch {}

  const isTv = slug?.startsWith('tv-') || searchParams.has('season');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchFn = isTv ? tmdb.getTvById(id) : tmdb.getMovieById(id);
    fetchFn
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id, isTv]);

  const currentServer = SERVERS.find((s) => s.id === serverParam) || SERVERS[0];
  const embedUrl = getEmbedUrl(currentServer, id!, isTv ? 'tv' : 'movie', season, episode);
  const title = data ? getTitle(data as any) : 'Loading...';

  return (
    <Layout>
      <Helmet>
        <title>Watch {title} - SFlix</title>
      </Helmet>

      <div className="watch-page">
        <div className="watch-player-wrapper">
          {iframeLoading && (
            <div className="watch-loading">
              <i className="fas fa-spinner fa-spin" /> Connecting to {currentServer.name}...
            </div>
          )}
          <iframe
            key={`${currentServer.id}-${id}-${season}-${episode}`}
            src={embedUrl}
            className="watch-iframe"
            allowFullScreen
            title={`Watch ${title}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setIframeLoading(false)}
          />
        </div>

        <div className="watch-servers container">
          <h3>Servers</h3>
          <div className="watch-server-list">
            {SERVERS.map((server) => (
              <Link
                key={server.id}
                to={`/watch/${slug}?server=${server.id}${isTv ? `&season=${season}&episode=${episode}` : ''}`}
                className={`watch-server-btn${server.id === serverParam ? ' active' : ''}`}
              >
                <i className="fas fa-play" /> {server.name}
              </Link>
            ))}
          </div>
        </div>

        {data && (
          <div className="watch-detail container">
            <div className="watch-detail-info">
              <h2>{title}</h2>
              <span className={`watch-quality ${data.vote_average >= 7 ? 'quality-hd' : data.vote_average >= 5 ? 'quality-ts' : 'quality-cam'}`}>
                {data.vote_average >= 7 ? 'HD' : data.vote_average >= 5 ? 'TS' : 'CAM'}
              </span>
              <p className="watch-overview">{data.overview?.slice(0, 300)}</p>
              <div className="watch-meta">
                {data.genres?.map((g) => (
                  <Link key={g.id} to={`/genre/${g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="watch-meta-link">
                    {g.name}
                  </Link>
                ))}
                {data.credits?.cast?.slice(0, 5).map((c) => (
                  <span key={c.id} className="watch-meta-link">{c.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .watch-page {
          background: #000;
          animation: fadeIn 0.3s ease-out;
        }

        .watch-player-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }

        .watch-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #fff;
          font-size: 1rem;
          z-index: 1;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .watch-iframe {
          width: 100%;
          height: 100%;
          border: none;
          position: absolute;
          inset: 0;
        }

        .watch-servers {
          padding: 1.5rem 0;
        }

        .watch-servers h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .watch-server-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .watch-server-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 8px 16px;
          border-radius: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          color: var(--text-primary);
          font-size: 0.8rem;
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .watch-server-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-blue);
          color: var(--accent-blue);
          text-decoration: none;
        }

        .watch-server-btn:active {
          transform: scale(0.96);
        }

        .watch-server-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          color: #fff;
        }

        .watch-server-btn i { font-size: 0.75rem; }

        .watch-detail {
          padding: 1.5rem 0 3rem;
        }

        .watch-detail-info h2 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .watch-quality {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .watch-overview {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .watch-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .watch-meta-link {
          color: var(--accent-blue);
          font-size: 0.85rem;
        }

        @media (max-width: 576px) {
          .watch-player-wrapper { aspect-ratio: 16 / 10; }
          .watch-servers h3 { font-size: 0.9rem; }
          .watch-server-btn { font-size: 0.72rem; padding: 6px 12px; }
          .watch-server-list { gap: 0.35rem; }
          .watch-detail-info h2 { font-size: 1rem; }
          .watch-overview { font-size: 0.8rem; }
        }
      `}</style>
    </Layout>
  );
}
