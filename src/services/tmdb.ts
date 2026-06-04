import type { DiscoverParams, MediaDetails, MediaItem, PaginatedResponse, SeasonDetails } from '@/types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

if (READ_TOKEN) {
  headers['Authorization'] = `Bearer ${READ_TOKEN}`;
}

async function fetchFromApi<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const query = new URLSearchParams();
  query.set('api_key', API_KEY);
  query.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });

  const url = `${BASE_URL}${endpoint}?${query.toString()}`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`TMDB API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export const tmdb = {
  getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week', page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>(`/trending/${mediaType}/${timeWindow}`, { page });
  },

  getPopular(mediaType: 'movie' | 'tv', page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>(`/${mediaType}/popular`, { page });
  },

  getNowPlaying(page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>('/movie/now_playing', { page });
  },

  getTopRated(mediaType: 'movie' | 'tv', page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>(`/${mediaType}/top_rated`, { page });
  },

  getLatest(mediaType: 'movie' | 'tv', page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>(`/${mediaType}/now_playing`, { page });
  },

  getAiringToday(page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>('/tv/airing_today', { page });
  },

  getOnTheAir(page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>('/tv/on_the_air', { page });
  },

  getDetails(id: number, mediaType: 'movie' | 'tv') {
    return fetchFromApi<MediaDetails>(`/${mediaType}/${id}`, {
      append_to_response: 'credits,videos,similar',
    });
  },

  getSeasonDetails(tvId: number, seasonNumber: number) {
    return fetchFromApi<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
  },

  search(query: string, page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>('/search/multi', { query, page });
  },

  discover(mediaType: 'movie' | 'tv', params: DiscoverParams = {}, page = 1) {
    return fetchFromApi<PaginatedResponse<MediaItem>>(`/discover/${mediaType}`, { ...params, page });
  },

  getGenres(mediaType: 'movie' | 'tv') {
    return fetchFromApi<{ genres: { id: number; name: string }[] }>(`/genre/${mediaType}/list`);
  },

  getMovieById(id: number) {
    return fetchFromApi<MediaDetails>(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });
  },

  getTvById(id: number) {
    return fetchFromApi<MediaDetails>(`/tv/${id}`, { append_to_response: 'credits,videos,similar' });
  },

  getImages(id: number, mediaType: 'movie' | 'tv') {
    return fetchFromApi<{ backdrops: { file_path: string }[]; posters: { file_path: string }[] }>(
      `/${mediaType}/${id}/images`,
    );
  },
};

export function getImageUrl(path: string | null, size: 'w500' | 'original' | 'w300' | 'w780' = 'w500') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getYear(item: MediaItem): string {
  const date = item.release_date || item.first_air_date;
  if (!date) return '';
  return date.slice(0, 4);
}

export function getSlug(item: MediaItem): string {
  const title = item.title || item.name || 'untitled';
  const year = getYear(item);
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${item.id}-${titleSlug}-${year}-online-hd`;
}

export function parseSlug(slug: string): { id: number } {
  const match = slug.match(/^(\d+)-/);
  if (!match) throw new Error('Invalid slug format');
  return { id: parseInt(match[1]) };
}

export function getTitle(item: MediaItem): string {
  return item.title || item.name || 'Untitled';
}

export function getMediaType(item: MediaItem): 'movie' | 'tv' {
  if (item.media_type === 'tv' || item.media_type === 'movie') return item.media_type;
  if (item.title) return 'movie';
  return 'tv';
}
