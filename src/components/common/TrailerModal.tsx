interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string | null;
}

export default function TrailerModal({ isOpen, onClose, trailerKey }: TrailerModalProps) {
  if (!isOpen || !trailerKey) return null;

  return (
    <>
      <div className="trailer-overlay" onClick={onClose} />
      <div className="trailer-modal">
        <div className="trailer-modal-header">
          <h3>Trailer</h3>
          <button className="trailer-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="trailer-modal-body">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            className="trailer-iframe"
            allowFullScreen
            title="Trailer"
            allow="autoplay; encrypted-media"
          />
        </div>
      </div>

      <style>{`
        .trailer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 2000;
        }

        .trailer-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-dark);
          border-radius: 8px;
          z-index: 2001;
          width: 800px;
          max-width: 95vw;
          overflow: hidden;
        }

        .trailer-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
        }

        .trailer-modal-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .trailer-modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .trailer-modal-close:hover { color: var(--text-primary); }

        .trailer-modal-body {
          position: relative;
          padding: 0 1rem 1rem;
        }

        .trailer-iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
