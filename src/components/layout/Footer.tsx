import { MONETIZATION_LINK } from '@/services/links';

export default function Footer() {
  return (
    <footer className="sflix-footer">
      <div className="container">
        <div className="footer-links">
          <a href={MONETIZATION_LINK} target="_blank" rel="noopener noreferrer" className="footer-link">Android App</a>
          <a href="#" className="footer-link">Terms of service</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Sitemap</a>
        </div>
        <p className="footer-about">
          SFlix is a free streaming site where you can watch movies online in
          HD quality. Browse the latest movies, TV shows, and trending content.
          No sign-up required.
        </p>
        <p className="footer-copyright">&copy; SFlix</p>
      </div>

      <style>{`
        .sflix-footer {
          background: var(--bg-dark);
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .footer-link {
          color: var(--text-secondary);
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: var(--accent-blue);
          text-decoration: none;
        }

        .footer-about {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto 1rem;
          line-height: 1.5;
        }

        .footer-copyright {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-align: center;
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
