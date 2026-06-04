interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500);
  if (maxPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const showPages = 5;

    if (maxPages <= showPages + 2) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(maxPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = Math.min(showPages, maxPages - 1);
    }
    if (currentPage >= maxPages - 2) {
      start = Math.max(2, maxPages - showPages + 1);
      end = maxPages - 1;
    }

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < maxPages - 1) pages.push('...');

    pages.push(maxPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination-wrapper" aria-label="Pagination">
      <button
        className="page-btn prev-next"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left" />
        <span className="page-btn-text">Previous</span>
      </button>

      <div className="page-numbers">
        {pageNumbers.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="page-dots" aria-hidden="true">...</span>
          ) : (
            <button
              key={p}
              className={`page-num${p === currentPage ? ' active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="page-btn prev-next"
        disabled={currentPage >= maxPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <span className="page-btn-text">Next</span>
        <i className="fas fa-chevron-right" />
      </button>

      <style>{`
        .pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2rem 0;
          flex-wrap: wrap;
        }

        .page-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 8px 16px;
          border: 1px solid var(--bg-tertiary);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .page-btn:hover:not(:disabled) {
          background: var(--bg-tertiary);
          border-color: var(--accent-blue);
        }

        .page-btn:active:not(:disabled) {
          transform: scale(0.96);
        }

        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .page-num {
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--bg-tertiary);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .page-num:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-blue);
        }

        .page-num:active {
          transform: scale(0.92);
        }

        .page-num.active {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          color: #fff;
        }

        .page-dots {
          color: var(--text-muted);
          padding: 0 0.25rem;
          font-size: 0.85rem;
        }

        @media (max-width: 576px) {
          .pagination-wrapper { gap: 0.35rem; }
          .page-btn { padding: 6px 10px; font-size: 0.78rem; }
          .page-num { min-width: 32px; height: 32px; font-size: 0.78rem; }
          .page-btn-text { display: none; }
        }

        @media (min-width: 577px) {
          .page-btn.prev-next { min-width: 100px; justify-content: center; }
        }
      `}</style>
    </nav>
  );
}
