import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdInjector from '@/components/common/AdInjector';

export default function SplashPage() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="splash-page">
      <AdInjector socialBar />
      <Helmet>
        <title>SFlix | Watch HD Movies Online Free | TV Series & Stream Live</title>
        <meta name="description" content="SFlix - Watch HD movies online free. Stream TV series, movies, and trending content in HD quality. Download or watch online at SFlix." />
      </Helmet>

      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <img
            src="/logo.png"
            alt="SFlix"
            className="splash-logo"
          />
        </div>
        <h1 className="splash-sitename">SFlix.st</h1>

        <form className="splash-search" onSubmit={handleSearch}>
          <div className="splash-search-input-wrapper">
            <i className="fas fa-search splash-search-icon" />
            <input
              type="text"
              className="splash-search-input"
              placeholder="Enter keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </form>

        <div className="splash-social">
          <span className="splash-social-label">Share SFlix</span>
          <div className="splash-social-icons">
            <a href="#" className="social-icon facebook" aria-label="Share on Facebook">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" className="social-icon twitter" aria-label="Share on Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" className="social-icon whatsapp" aria-label="Share on WhatsApp">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="#" className="social-icon reddit" aria-label="Share on Reddit">
              <i className="fab fa-reddit-alien" />
            </a>
            <a href="#" className="social-icon telegram" aria-label="Share on Telegram">
              <i className="fab fa-telegram-plane" />
            </a>
          </div>
        </div>

        <Link to="/home" className="splash-cta">
          View Full Site <i className="fas fa-arrow-right" />
        </Link>
      </div>

      <div className="splash-seo">
        <div className="container">
          <h2>Watch Movies Online Free</h2>
          <p>
            SFlix is a top free streaming site where you can watch movies online
            in HD quality. Browse the latest movies, TV shows, and trending
            content. No sign-up required, just click and watch instantly.
          </p>

          <h2>What is SFlix?</h2>
          <p>
            SFlix provides access to thousands of movies and TV series for free.
            Enjoy the best entertainment from Hollywood, Bollywood, and around
            the world. Updated daily with the latest releases.
          </p>

          <h2>Is SFlix safe?</h2>
          <p>
            SFlix uses advanced security measures to protect your privacy.
            Stream content safely with our encrypted connections and anonymous
            browsing.
          </p>
        </div>
      </div>

      <style>{`
        .splash-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-primary) 50%, #1a0a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .splash-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
        }

        .splash-logo-wrapper {
          margin-bottom: 0.5rem;
        }

        .splash-logo {
          width: 180px;
          height: auto;
        }

        .splash-sitename {
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .splash-search {
          width: 100%;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .splash-search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .splash-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1rem;
          z-index: 1;
        }

        .splash-search-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 50px;
          border: 2px solid var(--bg-tertiary);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 1rem;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          transition: border-color 0.3s;
        }

        .splash-search-input:focus {
          border-color: var(--accent-blue);
        }

        .splash-search-input::placeholder {
          color: var(--text-muted);
        }

        .splash-social {
          text-align: center;
          margin-bottom: 2rem;
        }

        .splash-social-label {
          display: block;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .splash-social-icons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #fff;
          font-size: 1rem;
          transition: opacity 0.3s;
        }

        .social-icon:hover {
          opacity: 0.8;
          color: #fff;
        }

        .social-icon.facebook { background: #1877f2; }
        .social-icon.twitter { background: #1da1f2; }
        .social-icon.whatsapp { background: #25d366; }
        .social-icon.reddit { background: #ff4500; }
        .social-icon.telegram { background: #0088cc; }

        .splash-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 32px;
          border-radius: 50px;
          background: var(--accent-blue);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s;
        }

        .splash-cta:hover {
          background: #2563eb;
          color: #fff;
          text-decoration: none;
        }

        .splash-seo {
          width: 100%;
          background: var(--bg-dark);
          padding: 3rem 0;
          margin-top: auto;
        }

        .splash-seo h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
        }

        .splash-seo h2:first-child {
          margin-top: 0;
        }

        .splash-seo p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
