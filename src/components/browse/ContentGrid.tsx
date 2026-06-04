import { useEffect, useState, useCallback } from 'react';
import FilmCard from '@/components/media/FilmCard';
import Pagination from '@/components/common/Pagination';
import FilterModal, { type FilterState } from '@/components/common/FilterModal';
import AdSlot from '@/components/common/AdSlot';
import type { MediaItem, PaginatedResponse } from '@/types';

interface ContentGridProps {
  title: string;
  fetchFn: (page: number, filters?: FilterState) => Promise<PaginatedResponse<MediaItem>>;
  showFilter?: boolean;
}

export default function ContentGrid({ title, fetchFn, showFilter = false }: ContentGridProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    quality: 'all',
    year: 'all',
    genres: [],
    countries: [],
  });

  const loadData = useCallback(async (p: number, f?: FilterState) => {
    setLoading(true);
    try {
      const res = await fetchFn(p, f);
      setItems(res.results);
      setTotalPages(res.total_pages);
    } catch {
      setItems([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [fetchFn]);

  useEffect(() => {
    loadData(page, filters);
  }, [page, filters, loadData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {showFilter && (
          <button className="filter-icon-btn" onClick={() => setFilterOpen(true)} aria-label="Filter">
            <i className="fas fa-sliders-h" />
          </button>
        )}
      </div>

      <AdSlot position="browse" />

      {loading ? (
        <div className="grid-loader">
          <i className="fas fa-spinner fa-spin" /> Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="grid-loader" style={{ color: 'var(--text-muted)' }}>
          No results found.
        </div>
      ) : (
        <>
          <div className="content-grid-items stagger-grid">
            {items.map((item) => (
              <FilmCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {showFilter && (
        <FilterModal
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={filters}
        />
      )}

      <style>{`
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

        .filter-icon-btn {
          background: none;
          border: 1px solid var(--bg-tertiary);
          border-radius: 6px;
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s, color 0.2s;
        }

        .filter-icon-btn:hover {
          background: var(--bg-tertiary);
          color: var(--accent-blue);
        }

        .grid-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 4rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .content-grid-items {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1200px) {
          .content-grid-items { grid-template-columns: repeat(5, 1fr); }
        }

        @media (max-width: 992px) {
          .content-grid-items { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 768px) {
          .content-grid-items { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 576px) {
          .content-grid-items { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
