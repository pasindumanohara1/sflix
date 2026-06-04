import { useEffect, useState } from 'react';
import { tmdb, getImageUrl } from '@/services/tmdb';
import type { Season } from '@/types';

interface SeasonSelectorProps {
  tvId: number;
  seasons: Season[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

interface EpisodeInfo {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  vote_average: number;
}

export default function SeasonSelector({
  tvId,
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}: SeasonSelectorProps) {
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    tmdb.getSeasonDetails(tvId, selectedSeason)
      .then((data) => setEpisodes(data.episodes || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoading(false));
  }, [tvId, selectedSeason]);

  return (
    <div className="season-selector">
      <div className="season-select-row">
        <label>Season:</label>
        <select
          value={selectedSeason}
          onChange={(e) => {
            onSeasonChange(Number(e.target.value));
            onEpisodeChange(1);
          }}
          className="season-select"
        >
          {seasons
            .filter((s) => s.season_number > 0)
            .map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name}
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <div className="episodes-loading">
          <i className="fas fa-spinner fa-spin" /> Loading episodes...
        </div>
      ) : (
        <div className="episodes-grid">
          {episodes.map((ep) => (
            <button
              key={ep.id}
              className={`episode-card${ep.episode_number === selectedEpisode ? ' active' : ''}`}
              onClick={() => onEpisodeChange(ep.episode_number)}
            >
              <div className="episode-thumb-wrapper">
                {ep.still_path ? (
                  <img src={getImageUrl(ep.still_path, 'w300')!} alt={ep.name} className="episode-thumb" loading="lazy" />
                ) : (
                  <div className="episode-thumb-placeholder">
                    <i className="fas fa-tv" />
                  </div>
                )}
                <span className="episode-number-badge">{ep.episode_number}</span>
              </div>
              <div className="episode-info">
                <div className="episode-name">{ep.name}</div>
                <div className="episode-overview">{ep.overview?.slice(0, 80)}...</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .season-selector {
          margin: 1.5rem 0;
        }

        .season-select-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .season-select-row label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin: 0;
        }

        .season-select {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--bg-tertiary);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          cursor: pointer;
        }

        .episodes-loading {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        .episodes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .episode-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 2px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          font-family: 'Montserrat', sans-serif;
          padding: 0;
          transition: border-color 0.2s;
        }

        .episode-card:hover { border-color: var(--bg-tertiary); }
        .episode-card.active { border-color: var(--accent-blue); }

        .episode-thumb-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .episode-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .episode-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 1.5rem;
        }

        .episode-number-badge {
          position: absolute;
          top: 0.25rem;
          left: 0.25rem;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .episode-info {
          padding: 0.5rem;
        }

        .episode-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .episode-overview {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}
