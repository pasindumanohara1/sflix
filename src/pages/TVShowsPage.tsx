import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ContentGrid from '@/components/browse/ContentGrid';
import { tmdb } from '@/services/tmdb';
import type { FilterState } from '@/components/common/FilterModal';

export default function TVShowsPage() {
  const fetchTV = (page: number, filters?: FilterState) => {
    if (filters && (filters.genres.length > 0 || filters.countries.length > 0)) {
      return tmdb.discover('tv', {
        with_genres: filters.genres.length > 0 ? filters.genres.join(',') : undefined,
        sort_by: 'popularity.desc',
      }, page);
    }
    return tmdb.getPopular('tv', page);
  };

  return (
    <Layout>
      <Helmet>
        <title>TV Shows - SFlix | Watch TV Series Online Free</title>
        <meta name="description" content="Browse popular TV shows on SFlix. Watch TV series online free in HD quality." />
      </Helmet>
      <ContentGrid title="Popular TV Shows" fetchFn={fetchTV} showFilter />
    </Layout>
  );
}
