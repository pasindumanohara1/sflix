import { useState } from 'react';

interface RateWidgetProps {
  voteAverage: number;
  voteCount: number;
}

export default function RateWidget({ voteAverage, voteCount }: RateWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(voteCount);
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);

  const handleLike = () => {
    if (liked === 'up') {
      setLiked(null);
      setLikes((l) => l - 1);
    } else {
      setLiked('up');
      setLikes((l) => (liked === 'down' ? l + 2 : l + 1));
    }
  };

  const handleDislike = () => {
    if (liked === 'down') {
      setLiked(null);
      setLikes((l) => l + 1);
    } else {
      setLiked('down');
      setLikes((l) => (liked === 'up' ? l - 2 : l - 1));
    }
  };

  const pct = Math.min(100, (voteAverage / 10) * 100);

  return (
    <div className="rate-widget">
      <button className="rate-trigger" onClick={() => setExpanded(!expanded)}>
        <i className="fas fa-star" /> {voteAverage.toFixed(1)} <span className="rate-label">Rate it</span>
      </button>

      {expanded && (
        <div className="rate-dropdown">
          <div className="rate-title">Rate</div>
          <div className="rate-count">{likes.toLocaleString()} Votes</div>
          <div className="rate-bar-wrapper">
            <div className="rate-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="rate-actions">
            <button
              className={`rate-action-btn${liked === 'up' ? ' active' : ''}`}
              onClick={handleLike}
              aria-label="Like"
            >
              <i className="fas fa-thumbs-up" />
            </button>
            <button
              className={`rate-action-btn${liked === 'down' ? ' active' : ''}`}
              onClick={handleDislike}
              aria-label="Dislike"
            >
              <i className="fas fa-thumbs-down" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .rate-widget {
          position: relative;
          display: inline-block;
        }

        .rate-trigger {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 6px;
          padding: 8px 16px;
          color: var(--star-rating);
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }

        .rate-trigger:hover { background: var(--bg-tertiary); }

        .rate-label {
          color: var(--text-secondary);
          font-weight: 400;
          font-size: 0.85rem;
        }

        .rate-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 8px;
          padding: 1rem;
          min-width: 200px;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .rate-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .rate-count {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .rate-bar-wrapper {
          height: 6px;
          background: var(--bg-primary);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .rate-bar {
          height: 100%;
          background: var(--star-rating);
          border-radius: 3px;
          transition: width 0.3s;
        }

        .rate-actions {
          display: flex;
          gap: 0.5rem;
        }

        .rate-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 8px;
          border: 1px solid var(--bg-tertiary);
          border-radius: 6px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
        }

        .rate-action-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .rate-action-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
