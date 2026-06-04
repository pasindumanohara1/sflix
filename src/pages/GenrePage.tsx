import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ContentGrid from '@/components/browse/ContentGrid';
import { tmdb } from '@/services/tmdb';
import { GENRE_MAP } from '@/types';

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const [genreId, setGenreId] = useState<number | null>(null);

  useEffect(() => {
    const entry = Object.entries(GENRE_MAP).find(
      ([, name]) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug
    );
    if (entry) setGenreId(Number(entry[0]));
  }, [slug]);

  const genreName = genreId ? GENRE_MAP[genreId] : slug;
  const fetchByGenre = (page: number) =>
    tmdb.discover('movie', { with_genres: genreId ? String(genreId) : undefined, sort_by: 'popularity.desc' }, page);

  return (
    <Layout>
      <Helmet>
        <title>{genreName} Movies - SFlix</title>
        <meta name="description" content={`Watch ${genreName} movies online free at SFlix. Browse the best ${genreName} films in HD quality.`} />
      </Helmet>
      {genreId ? (
        <ContentGrid title={`${genreName}`} fetchFn={fetchByGenre} />
      ) : (
        <div className="container" style={{ padding: '2rem 0' }}>
          <p style={{ color: 'var(--text-muted)' }}>Genre not found</p>
        </div>
      )}
    </Layout>
  );
}
