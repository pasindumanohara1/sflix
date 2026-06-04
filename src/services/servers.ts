export interface Server {
  id: string;
  name: string;
  url: string;
}

export const SERVERS: Server[] = [
  { id: 'vidsrc-me', name: 'VidSrc.me', url: 'https://vidsrcme.ru' },
  { id: 'vidlink', name: 'VidLink', url: 'https://vidlink.pro' },
  { id: 'vidsrc-net', name: 'VidSrc.net', url: 'https://vidsrc.net' },
  { id: 'vidsrc-pro', name: 'VidSrc.pro', url: 'https://vidsrc.pro' },
  { id: 'vidsrc-cc', name: 'VidSrc.cc', url: 'https://vidsrc.cc' },
  { id: 'vidsrc-in', name: 'VidSrc.in', url: 'https://vidsrc.in' },
  { id: 'superembed', name: 'SuperEmbed', url: 'https://superembed.top' },
  { id: 'embed-su', name: 'Embed.su', url: 'https://embed.su' },
  { id: '2embed', name: '2Embed', url: 'https://www.2embed.cc' },
  { id: 'vidbinge', name: 'VidBinge', url: 'https://vidbinge.to' },
];

export function getEmbedUrl(
  server: Server,
  mediaId: number | string,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number,
): string {
  const id = String(mediaId);

  switch (server.id) {
    case 'vidsrc-me':
      return mediaType === 'movie'
        ? `${server.url}/embed/movie/${id}`
        : `${server.url}/embed/tv/${id}/${season}-${episode}`;
    case 'vidlink':
      return mediaType === 'movie'
        ? `${server.url}/movie/${id}?primaryColor=3B82F6&autoplay=false`
        : `${server.url}/tv/${id}/${season}/${episode}?primaryColor=3B82F6&autoplay=false`;
    case 'vidsrc-net':
    case 'vidsrc-in':
    case 'vidsrc-pro':
      return mediaType === 'movie'
        ? `${server.url}/embed/movie/${id}`
        : `${server.url}/embed/tv/${id}/${season}/${episode}`;
    case 'vidsrc-cc':
      return mediaType === 'movie'
        ? `${server.url}/v2/embed/movie/${id}`
        : `${server.url}/v2/embed/tv/${id}/${season}/${episode}`;
    case 'superembed':
      return mediaType === 'movie'
        ? `${server.url}/movie/${id}`
        : `${server.url}/tv/${id}/${season}/${episode}`;
    case 'embed-su':
      return mediaType === 'movie'
        ? `${server.url}/embed/movie/${id}`
        : `${server.url}/embed/tv/${id}/${season}/${episode}`;
    case '2embed':
      return mediaType === 'movie'
        ? `${server.url}/embed/${id}`
        : `${server.url}/embedtv/${id}&s=${season}&e=${episode}`;
    case 'vidbinge':
      return mediaType === 'movie'
        ? `${server.url}/movie/${id}`
        : `${server.url}/tv/${id}/${season}/${episode}`;
    default:
      return `https://vidlink.pro/movie/${id}?primaryColor=3B82F6&autoplay=false`;
  }
}
