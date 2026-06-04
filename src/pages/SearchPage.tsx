import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import FilmCard from '@/components/media/FilmCard';
import Pagination from '@/components/common/Pagination';
import AdSlot from '@/components/common/AdSlot';
import { tmdb } from '@/services/tmdb';
import type { MediaItem } from '@/types';

export default function SearchPage() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q: string, p: number) => {
    if (!q.trim()) {
      setItems([]);
      setTotalPages(0);
      return;
    }
    setLoading(true);
    try {
      const res = await tmdb.search(q, p);
      setItems(res.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv'));
      setTotalPages(res.total_pages);
    } catch {
      setItems([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchResults(keyword, 1);
  }, [keyword, fetchResults]);

  useEffect(() => {
    if (page > 1) fetchResults(keyword, page);
  }, [page, keyword, fetchResults]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Helmet>
        <title>{keyword ? `Search: ${keyword} - SFlix` : 'Search - SFlix'}</title>
        <meta name="description" content={`Search results for "${keyword}" - SFlix. Watch HD movies and TV shows online free.`} />
      </Helmet>

      <div className="container" style={{ padding: '2rem 0' }}>
        <AdSlot position="top" />
        <h2 className="search-heading">
          {keyword ? `Search results for: "${keyword}"` : 'Search'}
        </h2>

        {loading ? (
          <div className="search-loader">
            <i className="fas fa-spinner fa-spin" /> Searching...
          </div>
        ) : items.length === 0 ? (
          <div className="search-loader" style={{ color: 'var(--text-muted)' }}>
            {keyword ? 'No results found.' : 'Enter a keyword to search.'}
          </div>
        ) : (
          <>
            <div className="search-grid stagger-grid">
              {items.map((item) => (
                <FilmCard key={`${item.id}-${item.media_type}`} item={item} />
              ))}
            </div>
            <AdSlot position="browse" />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      <style>{`
        .search-heading {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .search-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 4rem 0;
          color: var(--text-muted);
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1200px) { .search-grid { grid-template-columns: repeat(5, 1fr); } }
        @media (max-width: 992px) { .search-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 768px) { .search-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 576px) { .search-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } }
      `}</style>
    </Layout>
  );
}
