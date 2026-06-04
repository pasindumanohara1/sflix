import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ContentGrid from '@/components/browse/ContentGrid';
import { tmdb } from '@/services/tmdb';
import type { FilterState } from '@/components/common/FilterModal';

export default function MoviesPage() {
  const fetchMovies = (page: number, filters?: FilterState) => {
    if (filters && (filters.genres.length > 0 || filters.countries.length > 0)) {
      return tmdb.discover('movie', {
        with_genres: filters.genres.length > 0 ? filters.genres.join(',') : undefined,
        sort_by: 'popularity.desc',
      }, page);
    }
    return tmdb.getPopular('movie', page);
  };

  return (
    <Layout>
      <Helmet>
        <title>Movies - SFlix | Watch HD Movies Online Free</title>
        <meta name="description" content="Browse popular movies on SFlix. Watch HD movies online free with our streaming service." />
      </Helmet>
      <ContentGrid title="Popular Movies" fetchFn={fetchMovies} showFilter />
    </Layout>
  );
}
