import { useState } from 'react';

export default function ShareWidget() {
  const [expanded, setExpanded] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`,
  };

  return (
    <div className="share-widget">
      <button className="share-trigger" onClick={() => setExpanded(!expanded)}>
        <i className="fas fa-share-alt" /> Share this
      </button>

      {expanded && (
        <div className="share-dropdown">
          <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" className="share-option facebook">
            <i className="fab fa-facebook-f" /> Facebook
          </a>
          <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" className="share-option twitter">
            <i className="fab fa-twitter" /> Twitter
          </a>
          <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" className="share-option whatsapp">
            <i className="fab fa-whatsapp" /> WhatsApp
          </a>
          <a href={shareUrls.reddit} target="_blank" rel="noopener noreferrer" className="share-option reddit">
            <i className="fab fa-reddit-alien" /> Reddit
          </a>
          <a href={shareUrls.telegram} target="_blank" rel="noopener noreferrer" className="share-option telegram">
            <i className="fab fa-telegram-plane" /> Telegram
          </a>
        </div>
      )}

      <style>{`
        .share-widget {
          position: relative;
          display: inline-block;
        }

        .share-trigger {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 6px;
          padding: 8px 16px;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }

        .share-trigger:hover { background: var(--bg-tertiary); }

        .share-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 8px;
          padding: 0.5rem;
          min-width: 180px;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .share-option {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          color: var(--text-primary);
          font-size: 0.85rem;
          transition: background 0.2s;
          text-decoration: none;
        }

        .share-option:hover { background: var(--bg-tertiary); text-decoration: none; color: var(--text-primary); }

        .share-option.facebook i { color: #1877f2; }
        .share-option.twitter i { color: #1da1f2; }
        .share-option.whatsapp i { color: #25d366; }
        .share-option.reddit i { color: #ff4500; }
        .share-option.telegram i { color: #0088cc; }
      `}</style>
    </div>
  );
}
