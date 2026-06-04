import { useState } from 'react';
import { GENRE_MAP, COUNTRY_MAP } from '@/types';

export interface FilterState {
  type: string;
  quality: string;
  year: string;
  genres: number[];
  countries: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', 'Older'];

const defaultFilters: FilterState = {
  type: 'all',
  quality: 'all',
  year: 'all',
  genres: [],
  countries: [],
};

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters ?? defaultFilters);

  if (!isOpen) return null;

  const update = (partial: Partial<FilterState>) => setFilters((f) => ({ ...f, ...partial }));

  const toggleGenre = (id: number) => {
    setFilters((f) => ({
      ...f,
      genres: f.genres.includes(id) ? f.genres.filter((g) => g !== id) : [...f.genres, id],
    }));
  };

  const toggleCountry = (code: string) => {
    setFilters((f) => ({
      ...f,
      countries: f.countries.includes(code) ? f.countries.filter((c) => c !== code) : [...f.countries, code],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = defaultFilters;
    setFilters(reset);
    onApply(reset);
    onClose();
  };

  const genres = Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }));
  const countries = Object.entries(COUNTRY_MAP).map(([code, name]) => ({ code, name }));

  return (
    <>
      <div className="filter-overlay" onClick={onClose} />
      <div className="filter-modal">
        <div className="filter-modal-header">
          <h3>Filters</h3>
          <button className="filter-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="filter-modal-body">
          <div className="filter-section">
            <h4>Type</h4>
            <div className="filter-options">
              {['all', 'movie', 'tv'].map((t) => (
                <label key={t} className="filter-radio">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={filters.type === t}
                    onChange={() => update({ type: t })}
                  />
                  <span>{t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'TV Shows'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Quality</h4>
            <div className="filter-options">
              {['all', 'HD', 'SD', 'CAM'].map((q) => (
                <label key={q} className="filter-radio">
                  <input
                    type="radio"
                    name="quality"
                    value={q}
                    checked={filters.quality === q}
                    onChange={() => update({ quality: q })}
                  />
                  <span>{q === 'all' ? 'All' : q}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Released</h4>
            <div className="filter-options">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="year"
                  value="all"
                  checked={filters.year === 'all'}
                  onChange={() => update({ year: 'all' })}
                />
                <span>All</span>
              </label>
              {YEARS.map((y) => (
                <label key={y} className="filter-radio">
                  <input
                    type="radio"
                    name="year"
                    value={y}
                    checked={filters.year === y}
                    onChange={() => update({ year: y })}
                  />
                  <span>{y}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Genre</h4>
            <div className="filter-checkboxes">
              {genres.map((g) => (
                <label key={g.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(g.id)}
                    onChange={() => toggleGenre(g.id)}
                  />
                  <span>{g.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Country</h4>
            <div className="filter-checkboxes">
              {countries.map((c) => (
                <label key={c.code} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.countries.includes(c.code)}
                    onChange={() => toggleCountry(c.code)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button className="filter-btn reset" onClick={handleReset}>Reset</button>
          <button className="filter-btn apply" onClick={handleApply}>Apply</button>
        </div>
      </div>

      <style>{`
        .filter-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 2000;
        }

        .filter-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-secondary);
          border-radius: 8px;
          z-index: 2001;
          width: 500px;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .filter-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--bg-tertiary);
        }

        .filter-modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .filter-modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.25rem;
        }

        .filter-modal-close:hover { color: var(--text-primary); }

        .filter-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .filter-section {
          margin-bottom: 1.5rem;
        }

        .filter-section h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-radio {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-primary);
          padding: 4px 0;
        }

        .filter-radio input {
          accent-color: var(--accent-blue);
        }

        .filter-checkboxes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.35rem;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          font-size: 0.82rem;
          color: var(--text-primary);
          padding: 3px 0;
        }

        .filter-checkbox input {
          accent-color: var(--accent-blue);
        }

        .filter-modal-footer {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--bg-tertiary);
        }

        .filter-btn {
          padding: 8px 24px;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }

        .filter-btn.apply {
          background: var(--accent-blue);
          color: #fff;
        }

        .filter-btn.apply:hover { background: #2563eb; }

        .filter-btn.reset {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .filter-btn.reset:hover { background: var(--bg-primary); }
      `}</style>
    </>
  );
}
