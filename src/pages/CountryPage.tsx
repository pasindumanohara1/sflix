import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ContentGrid from '@/components/browse/ContentGrid';
import { tmdb } from '@/services/tmdb';
import { COUNTRY_MAP } from '@/types';

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const countryName = code ? COUNTRY_MAP[code.toUpperCase()] : code;

  const fetchByCountry = (page: number) => {
    const params: Record<string, string> = {};
    if (code) {
      params.with_origin_country = code.toUpperCase();
    }
    return tmdb.discover('movie', params as any, page);
  };

  return (
    <Layout>
      <Helmet>
        <title>{countryName || code} Movies - SFlix</title>
        <meta name="description" content={`Watch ${countryName || code} movies online free at SFlix. Browse the best films from ${countryName || code} in HD quality.`} />
      </Helmet>
      <ContentGrid title={countryName || code || ''} fetchFn={fetchByCountry} />
    </Layout>
  );
}
