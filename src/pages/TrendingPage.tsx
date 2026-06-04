import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ContentGrid from '@/components/browse/ContentGrid';
import { tmdb } from '@/services/tmdb';

export default function TrendingPage() {
  const fetchTrending = (page: number) => tmdb.getTrending('all', 'week', page);

  return (
    <Layout>
      <Helmet>
        <title>Trending - SFlix | Watch Popular Movies & TV Shows</title>
        <meta name="description" content="Browse trending movies and TV shows on SFlix. Watch the most popular content right now." />
      </Helmet>
      <ContentGrid title="Trending" fetchFn={fetchTrending} />
    </Layout>
  );
}
