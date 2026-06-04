# Streaming Website Architecture

**Based on:** Vidbanda (React + TypeScript + Vite + TMDB API)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM v7 |
| SEO | react-helmet-async |
| Icons | lucide-react |
| Backend (server) | Express.js |
| Database (local) | better-sqlite3 |
| AI Integration | @google/genai (Gemini API) |
| Data Source | TMDB API v3 |

---

## Directory Structure

```
src/
├── main.tsx                    # Entry point (HelmetProvider → App)
├── App.tsx                     # Root: ThemeProvider → ListProvider → Router → Layout
├── index.css                   # Tailwind + global styles
├── types/index.ts              # All TypeScript interfaces
├── services/tmdb.ts            # TMDB API client
├── context/
│   ├── ThemeContext.tsx         # Light/dark theme toggle (localStorage)
│   └── ListContext.tsx          # Watchlist "My List" (localStorage)
├── components/
│   ├── layout/
│   │   ├── Layout.tsx           # Shell: Navbar + main + Footer + FloatingAds
│   │   └── Navbar.tsx           # Nav links, search bar, theme toggle
│   ├── common/
│   │   ├── MediaCard.tsx        # Poster card (rating, add-to-list, link to details)
│   │   ├── FilterBar.tsx        # Genre / Year / Sort dropdowns
│   │   ├── Pagination.tsx       # Page navigation (max 500 pages)
│   │   └── LoadingSpinner.tsx   # Full-screen loading state
│   ├── media/
│   │   └── Player.tsx           # Iframe-based video player with multi-server support
│   └── ads/
│       ├── AdBanner.tsx         # Fixed-size ad placements
│       ├── ResponsiveBanner.tsx  # Responsive ad slots
│       ├── NativeBanner.tsx     # Native ad placements
│       └── FloatingAds.tsx      # Sticky floating ad containers
├── pages/
│   ├── Home.tsx                 # Landing: hero + popular rows + infinite trending
│   ├── Movies.tsx               # Movies browse with filters + infinite scroll
│   ├── TvShows.tsx              # TV Shows browse with filters + infinite scroll
│   ├── Details.tsx              # Media detail: player, cast, episodes, similar
│   ├── Search.tsx               # Multi-search + discover with filters
│   └── MyList.tsx               # Saved items from localStorage
```

---

## Data Flow Architecture

```
TMDB API (api.themoviedb.org/3)
        │
        ▼
  tmdb.ts (service layer)
  ┌─────────────────────────────────────────────┐
  │ fetchFromTMDB<T>(endpoint, params)          │
  │   - Adds api_key from env/fallback           │
  │   - Error handling (401/404/429/5xx)         │
  │   - Returns parsed JSON as typed response    │
  │                                             │
  │ Endpoints exposed via `tmdb` object:         │
  │   getTrending(): /trending/{type}/{window}   │
  │   getPopular(): /{type}/popular              │
  │   getTopRated(): /{type}/top_rated           │
  │   getUpcoming(): /movie/upcoming             │
  │   getDetails(): /{type}/{id}                 │
  │   getSeasonDetails(): /tv/{id}/season/{n}    │
  │   getGenres(): /genre/{type}/list            │
  │   getCountries(): /configuration/countries   │
  │   search(): /search/multi                    │
  │   discover(): /discover/{type}               │
  └──────────┬──────────────────────────────────┘
             │
             ▼
       Pages (browser-side data fetching)
  ┌──────────────────────────────────────────────┐
  │ Each page calls tmdb methods in useEffect()  │
  │ Pages manage their own state:                │
  │   - loading / data / error                   │
  │   - pagination (page, hasMore)               │
  │   - filters (genre, year, sort)              │
  └──────────┬───────────────────────────────────┘
             │
             ▼
       Components (presentation)
  ┌──────────────────────────────────────────────┐
  │ MediaCard   → poster, rating, add-to-list    │
  │ Player      → iframe to embed server         │
  │ FilterBar   → genre/year/sort selects        │
  │ Pagination  → page navigation buttons        │
  └──────────────────────────────────────────────┘
```

---

## Streaming Engine (Player Component)

**File:** `src/components/media/Player.tsx`

### How Streaming Works

The Vidbanda player does **not** host any video files. It uses embedded third-party streaming servers via iframes. This is the standard pattern for free streaming sites.

### Server List (14 embed sources)

| Service | ID | Movie URL Pattern | TV URL Pattern |
|---|---|---|---|
| VidSrc.me | vidsrc-me | `/embed/movie/{id}` | `/embed/tv/{id}/{s}-{e}` |
| VidLink | vidlink | `/movie/{mediaId}` | `/tv/{mediaId}/{s}/{e}` |
| VidSrc.net | vidsrc-net | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| VidSrc.pro | vidsrc-pro | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| VidSrc.cc | vidsrc-cc | `/v2/embed/movie/{id}` | `/v2/embed/tv/{id}/{s}/{e}` |
| VidSrc.in | vidsrc-in | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| VidSrc.pm | vidsrc-pm | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| VidSrc.xyz | vidsrc-xyz | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| VidSrc.to | vidsrc-to | `/embed/movie/{mediaId}` | `/embed/tv/{mediaId}/{s}/{e}` |
| SuperEmbed | superembed | `/movie/{id}` | `/tv/{id}/{s}/{e}` |
| Embed.su | embed-su | `/embed/movie/{id}` | `/embed/tv/{id}/{s}/{e}` |
| 2Embed | 2embed | `/embed/{id}` | `/embedtv/{id}&s={s}&e={e}` |
| VidBinge | vidbinge | `/movie/{id}` | `/tv/{id}/{s}/{e}` |
| FREMbed | frembed | `/api/film.php?id={mediaId}` | `/api/serie.php?id={mediaId}&sa={s}&epi={e}` |

### Player Logic

```
Player receives:
  - mediaId: TMDB ID (number as string)
  - imdbId: IMDb ID (optional, used by VidSrc servers)
  - mediaType: 'movie' | 'tv'
  - season: number (default 1)
  - episode: number (default 1)

getEmbedUrl(server):
  - Uses imdbId first if available, falls back to mediaId
  - Builds URL based on server's specific URL pattern
  - TV shows append season/episode; movies don't

Server switching:
  - currentServerIndex tracks active server
  - handleNextServer() cycles through servers array
  - Dropdown menu to jump to any server directly
  - isLoading state shows spinner + "Connecting to {server}..." text
  - iframe onLoad event sets isLoading = false
```

---

## Page-by-Page Architecture

### Home Page (`Home.tsx`)

```
State:
  trending: MediaItem[]       — infinite scroll via IntersectionObserver
  popularMovies: MediaItem[]  — first page only (12 items)
  popularTv: MediaItem[]      — first page only (12 items)
  page: number                — trending pagination
  hasMore: boolean            — stop loading at TMDB cap

Data fetching:
  useEffect([page]) → parallel calls:
    tmdb.getTrending('all', 'day', page)
    tmdb.getPopular('movie', 1)
    tmdb.getPopular('tv', 1)

Layout:
  Hero section → first trending item with backdrop + CTA
  Popular Movies row (grid, 3-8 cols responsive)
  [Ad placements between sections]
  Popular TV Shows row
  [Ad placements]
  Trending This Week (infinite rows, 3-row chunks with ads between)
  Sentry div for IntersectionObserver → loads next page
```

### Details Page (`Details.tsx`)

```
State:
  details: MediaDetails | null
  loading: boolean
  selectedSeason: number     — TV-only
  selectedEpisode: number    — TV-only
  seasonDetails: SeasonDetails | null — TV-only
  showTrailer: boolean
  visibleEpisodes: number    — starts at 10, "Load More" increments

Data fetching:
  useEffect([id, type]) → tmdb.getDetails(id, type)
  useEffect([id, type, selectedSeason]) → tmdb.getSeasonDetails(id, season)

Layout:
  Backdrop header (85vh) with poster + metadata + action buttons
    "Play Now" button → scrolls to Player section
    "Trailer" button → modal with YouTube iframe
    "Save" button → ListContext add/remove
    "Like" heart → SMARTLINK_URL
    "Share" → Web Share API or clipboard
    Direct Download / Stream in 4K → SMARTLINK_URL
  [Ad placements]
  Player section ("Theatre Mode") with iframe embed
    "UNLOCK PREMIUM SERVERS" → SMARTLINK_URL
  [Ad placements]
  Top Cast section (up to 8 cast, all click → SMARTLINK_URL)
  Episodes section (TV-only):
    Season selector dropdown
    Episode grid (10 initially, "Load More Episodes" for +10)
    Click episode → setSelectedEpisode + scrollToPlayer
  Similar Content grid (up to 12 items)
```

### Browse Pages (Movies.tsx / TvShows.tsx)

```
State:
  items: MediaItem[]
  filters: { genre, year, sort }
  page: number
  hasMore: boolean

Data fetching:
  useEffect([filters, page]):
    if sort === 'trending' → tmdb.getTrending(type, 'week', page)
    else → tmdb.discover(type, { sort_by, with_genres, primary_release_year }, page)

Filter change handler:
  Resets page to 1, clears existing items, sets new filters
  Syncs sort param to URL search params

Infinite scroll same pattern as Home:
  IntersectionObserver → page+1 → append deduplicated results
```

### Search Page (`Search.tsx`)

```
Two modes:
  1. Query mode (search param "q" present):
     Uses tmdb.search(query, page)
     Filters results to movie/tv only (removes person)
     Disables genre/country filters (shows info banner)
  2. Discover mode (no query):
     Uses tmdb.discover(type, { sort_by, with_genres, with_origin_country }, page)
     Injects media_type into results
     Genre filter (fetched from TMDB, changes with media type)
     Country filter (fetched from TMDB configuration/countries)

Infinite scroll same pattern as browse pages.
```

### My List Page (`MyList.tsx`)

```
Reads from ListContext.myList
Renders MediaCard grid or empty state with instructions
No data fetching — all from localStorage
```

---

## Context Providers

### ThemeContext

```
State: theme: 'light' | 'dark'
Persistence: localStorage key 'vidbanda-theme'
Init: reads localStorage, defaults to 'light'
On change: updates <html> classList + saves to localStorage
Exposes: { theme, toggleTheme }
```

### ListContext

```
State: myList: MediaItem[]
Persistence: localStorage key 'vidbanda-list'
Init: reads localStorage, handles parse errors gracefully
On change: saves full array to localStorage
Exposes: { myList, addToList, removeFromList, isInList }
addToList: no duplicates (checked by id)
removeFromList: filter by id
```

---

## Ad Monetization Architecture

**Network:** Adsterra + Monetag + custom SMARTLINK_URL (`https://omg10.com/4/9060184`)

| Ad Component | Type | Behavior |
|---|---|---|
| ResponsiveBanner | Responsive display | Adapts to viewport |
| NativeBanner | Native | In-content native ads |
| AdBanner | Fixed-size | Configurable width/height via props |
| FloatingAds | Sticky | Persistent floating containers |
| SMARTLINK_URL | Direct link | Used for cast clicks, "Download HD", "Like", and premium upsell buttons |

The SMARTLINK_URL pattern redirects user actions (clicks on cast, download buttons, heart/like) to affiliate/revenue links instead of actual functional destinations.

---

## API Layer Details

### Image URLs

| Constant | TMDB Path | Use Case |
|---|---|---|
| IMAGE_BASE_URL | `/t/p/w500` | Posters, cast, episode stills |
| IMAGE_W1280_URL | `/t/p/w1280` | Hero backdrops |
| IMAGE_ORIGINAL_URL | `/t/p/original` | Full resolution |

### TMDB API Key

- Primary: `VITE_TMDB_API_KEY` from `.env`
- Fallback: hardcoded demo key `aa4f947818d885e4addb8684a408dbaf`

### Error Handling

| Status Code | User-Facing Message |
|---|---|
| 401 | Invalid TMDB API Key |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 5xx | TMDB server issues |
| Other | Generic HTTP error |

---

## Routing

```
/             → Home.tsx       (trending hero + popular rows)
/movies       → Movies.tsx     (filterable movie browse)
/tv           → TvShows.tsx    (filterable TV browse)
/details/:type/:id → Details.tsx (media detail + player)
/search       → Search.tsx     (query search + discover filters)
/my-list      → MyList.tsx     (localStorage watchlist)
```

---

## Key Patterns

1. **Infinite Scroll**: `IntersectionObserver` on a sentinel div triggers `page+1`, results are deduplicated by `id` before appending
2. **Deduplication**: New pages filtered against existing item IDs via `Set` to prevent duplicates from TMDB API overlapping results
3. **Responsive Grid**: CSS grid with `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8` — columns adapt to viewport
4. **Monetization via redirection**: All user actions (cast clicks, download buttons, like) redirect to `SMARTLINK_URL` for revenue generation
5. **No video hosting**: All video content is served via third-party iframe embeds — the site is a UI wrapper around external streaming sources
