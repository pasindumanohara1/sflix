import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FilmCard from '@/components/media/FilmCard';
import AdSlot from '@/components/common/AdSlot';
import AdInjector from '@/components/common/AdInjector';
import { tmdb, getImageUrl, getTitle, getSlug, getMediaType } from '@/services/tmdb';
import type { MediaItem } from '@/types';

type SectionData = {
  title: string;
  items: MediaItem[];
  loading: boolean;
};

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<SectionData>({ title: 'Popular Movies', items: [], loading: true });
  const [latestMovies, setLatestMovies] = useState<SectionData>({ title: 'Latest Movies', items: [], loading: true });
  const [popularTv, setPopularTv] = useState<SectionData>({ title: 'Popular TV Shows', items: [], loading: true });

  useEffect(() => {
    tmdb.getTrending('all', 'week', 1).then((res) => {
      setTrending(res.results);
      setTrendingLoading(false);
    }).catch(() => setTrendingLoading(false));

    tmdb.getPopular('movie', 1).then((res) => {
      setPopularMovies({ title: 'Popular Movies', items: res.results, loading: false });
    }).catch(() => setPopularMovies((p) => ({ ...p, loading: false })));

    tmdb.getLatest('movie', 1).then((res) => {
      setLatestMovies({ title: 'Latest Movies', items: res.results, loading: false });
    }).catch(() => setLatestMovies((p) => ({ ...p, loading: false })));

    tmdb.getPopular('tv', 1).then((res) => {
      setPopularTv({ title: 'Popular TV Shows', items: res.results, loading: false });
    }).catch(() => setPopularTv((p) => ({ ...p, loading: false })));
  }, []);

  function getQualityBadge(item: MediaItem): { label: string; className: string } {
    const v = item.vote_average;
    if (v >= 7) return { label: 'HD', className: 'quality-hd' };
    if (v >= 5) return { label: 'TS', className: 'quality-ts' };
    return { label: 'CAM', className: 'quality-cam' };
  }

  return (
    <Layout>
      <AdInjector socialBar />
      <Helmet>
        <title>SFlix | Watch HD Movies Online Free</title>
        <meta name="description" content="Watch HD movies online free at SFlix. Stream the latest movies, TV shows, and trending content." />
      </Helmet>

      {!trendingLoading && trending.length > 0 && (
        <section className="hero-slider-section animate-fade-in">
          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            className="hero-swiper"
          >
            {trending.map((item) => {
              const backdrop = getImageUrl(item.backdrop_path, 'original');
              const poster = getImageUrl(item.poster_path, 'w500');
              const slug = getSlug(item);
              const type = getMediaType(item);
              const quality = getQualityBadge(item);

              return (
                <SwiperSlide key={item.id}>
                  <div className="hero-slide">
                    {backdrop && (
                      <img
                        src={backdrop}
                        alt=""
                        className="hero-backdrop"
                      />
                    )}
                    <div className="hero-overlay" />
                    <div className="hero-content">
                      {poster && (
                        <img src={poster} alt="" className="hero-poster" />
                      )}
                      <div className="hero-info">
                        <h2 className="hero-title">{getTitle(item)}</h2>
                        <div className="hero-stats">
                          <span className="hero-rating">
                            <i className="fas fa-star" /> {item.vote_average.toFixed(1)}
                          </span>
                          <span className={`hero-quality ${quality.className}`}>
                            {quality.label}
                          </span>
                        </div>
                        <p className="hero-desc">
                          {item.overview?.slice(0, 200)}
                          {item.overview?.length > 200 ? '...' : ''}
                        </p>
                        <Link to={`/${type}/${slug}`} className="hero-play-btn" aria-label={`Play ${getTitle(item)}`}>
                          <i className="fas fa-play" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="hero-social">
            <span>Share SFlix</span>
            <div className="hero-social-icons">
              <a href="#" className="social-share-btn facebook" aria-label="Share on Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social-share-btn twitter" aria-label="Share on Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" className="social-share-btn whatsapp" aria-label="Share on WhatsApp"><i className="fab fa-whatsapp" /></a>
              <a href="#" className="social-share-btn reddit" aria-label="Share on Reddit"><i className="fab fa-reddit-alien" /></a>
            </div>
          </div>
        </section>
      )}

      <div className="home-sections container">
        <AdSlot position="top" />
        <SectionGrid section={popularMovies} />
        <AdSlot position="between" />
        <SectionGrid section={latestMovies} />
        <AdSlot position="between" />
        <SectionGrid section={popularTv} />
      </div>

      <style>{`
        .hero-slider-section {
          margin-bottom: 2rem;
        }

        .hero-swiper {
          width: 100%;
          height: 450px;
        }

        .hero-slide {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .hero-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.6) 50%, rgba(26,26,46,0.3) 100%);
        }

        .hero-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-poster {
          width: 180px;
          height: 270px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          flex-shrink: 0;
        }

        .hero-info {
          flex: 1;
          min-width: 0;
        }

        .hero-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .hero-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--star-rating);
          font-size: 1rem;
          font-weight: 600;
        }

        .hero-rating i {
          font-size: 0.9rem;
        }

        .hero-quality {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .quality-hd { background: var(--quality-hd); color: #000; }
        .quality-ts { background: var(--quality-ts); color: #000; }
        .quality-cam { background: var(--quality-cam); color: #fff; }

        .hero-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          max-width: 600px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--accent-blue);
          color: #fff;
          font-size: 1.2rem;
          transition: background 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-tap-highlight-color: transparent;
        }

        .hero-play-btn:hover {
          background: #2563eb;
          color: #fff;
          transform: scale(1.1);
          text-decoration: none;
        }

        .hero-play-btn:active {
          transform: scale(0.95);
        }

        .hero-social {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .hero-social-icons {
          display: flex;
          gap: 0.5rem;
        }

        .social-share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #fff;
          font-size: 0.85rem;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .social-share-btn:hover { opacity: 0.85; color: #fff; transform: translateY(-2px); }
        .social-share-btn:active { transform: translateY(0); }
        .social-share-btn.facebook { background: #1877f2; }
        .social-share-btn.twitter { background: #1da1f2; }
        .social-share-btn.whatsapp { background: #25d366; }
        .social-share-btn.reddit { background: #ff4500; }

        .home-sections {
          padding-bottom: 2rem;
          animation: fadeIn 0.5s ease-out;
        }

        .section-grid {
          margin-bottom: 2rem;
          animation: slideUp 0.5s ease-out;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }

        .section-items {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        .section-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 3rem;
          color: var(--text-muted);
        }

        @media (max-width: 1200px) {
          .section-items { grid-template-columns: repeat(5, 1fr); }
          .hero-poster { width: 140px; height: 210px; }
        }

        @media (max-width: 992px) {
          .section-items { grid-template-columns: repeat(4, 1fr); gap: 0.85rem; }
          .hero-content { padding: 2rem; }
          .hero-social { padding: 0.75rem 2rem; }
          .hero-swiper { height: 380px; }
        }

        @media (max-width: 768px) {
          .section-items { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
          .hero-poster { display: none; }
          .hero-title { font-size: 1.3rem; }
          .hero-swiper { height: 320px; }
          .hero-overlay {
            background: linear-gradient(to top, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.5) 100%);
          }
        }

        @media (max-width: 576px) {
          .section-items {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.6rem;
          }
          .hero-content { padding: 1rem; }
          .hero-social { padding: 0.75rem 1rem; }
          .hero-swiper { height: 280px; }
          .hero-title { font-size: 1.1rem; margin-bottom: 0.4rem; }
          .hero-desc { -webkit-line-clamp: 2; font-size: 0.8rem; }
          .hero-stats { margin-bottom: 0.4rem; }
          .hero-play-btn { width: 42px; height: 42px; font-size: 1rem; }
          .section-title { font-size: 1rem; }
        }

        @media (max-width: 400px) {
          .section-items { gap: 0.4rem; }
          .hero-swiper { height: 240px; }
        }
      `}</style>
    </Layout>
  );
}

function SectionGrid({ section }: { section: SectionData }) {
  if (section.loading) {
    return (
      <div className="section-grid">
        <div className="section-header">
          <h3 className="section-title">{section.title}</h3>
        </div>
        <div className="section-loader">
          <i className="fas fa-spinner fa-spin" /> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="section-grid">
      <div className="section-header">
        <h3 className="section-title">{section.title}</h3>
      </div>
      <div className="section-items stagger-grid">
        {section.items.map((item) => (
          <FilmCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
