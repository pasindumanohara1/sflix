# SFlix — UX Design Specification

**Source:** Live sflix.st website (scraped June 2026)
**Goal:** Clone the exact UX of sflix.st — NOT Vidbanda or any other reference.
**Brand:** SFlix, Logo: `docs/66356c25ce98cb12993249e21742b129.png`

---

## Tech Stack (Target)

| Layer | Technology |
|---|---|
| CSS Framework | Bootstrap 4.4.1 |
| Icons | Font Awesome 5 |
| Slider | Swiper.js |
| Frontend Logic | Vue.js 2 + jQuery 3.6 |
| Lazy Loading | lazysizes (lazyload) |
| Social Sharing | ShareThis |
| Data Source | TMDB API |
| Ad Network | AntiAdBlock system (custom JS) |

**Note:** The reference sflix.st uses PHP server-side rendering. Our clone will use React + TypeScript + Vite while matching the exact visual UX.

---

## Color System

| Token | Hex | Usage |
|---|---|---|
| bg-primary | `#1a1a2e` | Main page background |
| bg-secondary | `#16213e` | Cards, sections |
| bg-tertiary | `#0f3460` | Hover states, accents |
| bg-dark | `#0a0a1a` | Header, footer |
| accent-blue | `#3b82f6` | Primary buttons, links |
| text-primary | `#ffffff` | Body text, headings |
| text-secondary | `#a0a0b0` | Subtitles, metadata |
| text-muted | `#6b7280` | Secondary info |
| star-rating | `#f5c518` | IMDB rating star |
| quality-hd | `#22c55e` | HD quality badge (green) |
| quality-cam | `#ef4444` | CAM quality badge (red) |
| quality-ts | `#eab308` | TS quality badge (yellow) |

**Typography:** Montserrat (300, 400, 500, 600, 700 weights)

---

## Page-by-Page UX

### 1. Landing / Splash Page (`/`)

**Purpose:** Brand introduction + search gateway + SEO content

```
┌─────────────────────────────────────────┐
│  [Logo - centered, large]               │
│                                         │
│         SFlix.st                        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🔍 Enter keywords...            │    │
│  └─────────────────────────────────┘    │
│                                         │
│     [ShareThis Social Buttons]          │
│                                         │
│     ┌─────────────────────┐             │
│     │  View Full Site →   │             │
│     └─────────────────────┘             │
│                                         │
│  ──── SEO Content ───────────────────   │
│  "Watch Movies Online Free..."          │
│  "What is SFlix?"                       │
│  "Is it safe?"                          │
└─────────────────────────────────────────┘
```

**Key UX Elements:**
- No navbar — minimal splash
- Logo: centered, large format
- Search: centered bar with search icon, submits to `/search.php?keyword=...`
- CTA button: "View Full Site" → navigates to `/home`
- Social: ShareThis inline share buttons
- SEO: Full descriptive text below the fold for search engine indexing

---

### 2. Home Page (`/home`)

**Purpose:** Content discovery hub with hero slider, browsing, and sidebar navigation

**Header Layout:**
```
┌─────────────────────────────────────────┐
│ [☰ Browse] [LOGO]  [🔍 Search...]  [👤 Login] │
└─────────────────────────────────────────┘
```

- **Browse button** (left): Toggles sidebar slide-out menu. Shows "☰ Browse" text on desktop, search icon on mobile.
- **Logo**: Left of center. Links to `/`.
- **Search**: Center. Form with `@submit="search"` via Vue. Shows autocomplete dropdown `.search-result-pop.search-suggest`.
- **Login button** (right): Opens login modal (`#modallogin`). Shows "👤 Login".

**Sidebar Menu** (slide-out from left on Browse click):
```
┌─ Sidebar ─────────────────────────────┐
│ ← [close button]                      │
│                                        │
│  ☰ Home                               │
│  ▶ Movies                             │
│  ▶ TV Shows                           │
│  🔥 Trending                          │
│  ─────────────────                    │
│  Genre ▼ (collapsible)                │
│    Action, Adventure, Animation, ...   │
│    (25 genres total)                  │
│  ─────────────────                    │
│  Country ▼ (collapsible)              │
│    Argentina, Australia, Austria, ...  │
│    (35+ countries)                    │
└────────────────────────────────────────┘
```

**Hero Slider** (Swiper.js carousel):
```
┌─────────────────────────────────────────┐
│ ╔═════════════════════════════════════╗ │
│ ║     [Backdrop Image - full width]  ║ │
│ ║                                     ║ │
│ ║ [Poster]  Title                     ║ │
│ ║            ★ 9.2  [TS]              ║ │
│ ║            Description text         ║ │
│ ║            ▶ [Play button]          ║ │
│ ╚═════════════════════════════════════╝ │
│    ◀                              ▶    │
│                                        │
│ [ShareThis Social Buttons]             │
└─────────────────────────────────────────┘
```

**Slider Slide Structure:**
- Full-width backdrop image from TMDB (`/t/p/original`)
- Gradient overlay for text readability
- Floating poster thumbnail (w500) on left side
- Title (h2)
- Stats: IMDB rating (star + number) + Quality badge (HD/CAM/TS)
- Description (p, truncated)
- Circular play button (blue)
- Arrow navigation (prev/next via Swiper)
- Slides cycle automatically

**Content Sections** (below slider):
```
┌─────────────────────────────────────────┐
│ Popular Movies        [🎛️ Filter]      │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
│                                        │
│ Latest Movies                          │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
│                                        │
│ [Pagination: « 1 2 3 ... »]            │
└─────────────────────────────────────────┘
```

**Film Card (flw-item):**
```
┌──────────┐
│ [Poster] │  <-- lazy loaded via lazyload
│          │
│    2022  │  <-- year badge top
│    Movie │  <-- type label
│ Title    │  <-- film-name
│ ▶ Watch  │  <-- play button
│ now      │
└──────────┘
```

Each film card shows:
- Poster image (lazy loaded)
- Year of release
- Content type (Movie/TV)
- Title
- "Watch now" button with play icon

---

### 3. Movies / TV Shows Browse Page (`/movies`, `/tv-show`)

**Purpose:** Filterable grid of content with pagination

**Header:** Same as Home page (logo, Browse, search, Login)

**Content:**
```
┌─────────────────────────────────────────┐
│ Popular Movies         [🎛️ Filter]      │
│ ─────────────────────────────────────── │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
│                                        │
│ [Pagination: « 1 2 3 4 5 ... »]        │
└─────────────────────────────────────────┘
```

**Filter Modal** (opens via filter icon):
```
┌─ Filter ───────────────────────────────┐
│ Type: ○ All  ○ Movies  ○ TV Shows      │
│ Quality: ○ All  ○ HD  ○ SD  ○ CAM     │
│ Released: ○ All ○ 2026 ○ 2025 ...      │
│ ──────────────────────────────────────  │
│ Genre: (checkboxes)                     │
│ ☐ Action  ☐ Adventure  ☐ Animation ... │
│ ──────────────────────────────────────  │
│ Country: (checkboxes)                   │
│ ☐ USA  ☐ UK  ☐ France  ☐ Japan ...    │
└─────────────────────────────────────────┘
```

**Filter Options:**
- Type: All / Movies / TV Shows (radio buttons)
- Quality: All / HD / SD / CAM (radio buttons)
- Released: All / 2026 / 2025 / 2024 / 2023 / 2022 / 2021 / Older (radio)
- Genre: 28 genre checkboxes (Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Kids, Music, Mystery, News, Reality, Romance, Sci-Fi & Fantasy, Science Fiction, Soap, Talk, Thriller, TV Movie, War, War & Politics, Western)
- Country: 35 country checkboxes
- Season/Episode filters for TV shows

**Pagination:** Standard numbered pagination with prev/next.

---

### 4. Details / Watch Page (`/movie/{slug}`, `/tv/{slug}`)

**Purpose:** Content details + server selection + playback

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Backdrop Image - full width cover]    │
│                                         │
│ ┌──────┐  Title                         │
│ │Poster│  [TS] ★ 9.2  ▶ Trailer   min │
│ └──────┘                               │
│                                         │
│ Server UpCloud    [▶ Play]              │
│ Server MegaCloud  [▶ Play]              │
│                                         │
│ Overview: Description text...            │
│                                         │
│ Released: 2026-05-27                    │
│ Genre: Horror, Mystery, Sci-Fi          │
│ Cast: Renate Reinsve, Chiwetel Ejiofor  │
│ Duration: -- min                        │
│ Country: United States                  │
│                                         │
│ [SEO Tags: Watch Backrooms Online Free] │
│                                         │
│ ── You May Also Like ────────────────   │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│ │  │ │  │ │  │ │  │ │  │ │  │        │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
└─────────────────────────────────────────┘
```

**Detail-Tools Bar:**
- **Rate:** 5.0 rating with like/dislike buttons, progress bar of votes
- **Share:** ShareThis inline share buttons with dropdown
- **Favorite:** (present but may be unused)

**Server Selection:**
- List of server buttons (e.g., "Server UpCloud", "Server MegaCloud")
- Each button has a play icon + server name
- Clicking navigates to watch page: `/watch/{slug}` or loads player inline
- Active server is highlighted

**Metadata Strip:**
- Quality badge (HD/CAM/TS) — colored badge
- Trailer link — opens modal with video
- IMDB rating — star icon + number
- Duration — minutes

**SEO Tags Row:** Horizontal badge list of keyword tags for SEO

**Related Content:** "You may also like" grid of film cards (same flw-item style)

---

### 5. Watch Page (`/watch/{slug}`)

**Purpose:** Video playback with embedded player

**Layout:**
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │       VIDEO PLAYER (iframe)     │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│ [Server buttons below to switch]        │
│                                         │
│ ── Server List ──────────────────────   │
│ [UpCloud] [MegaCloud] [Vidcloud] ...    │
│                                         │
│ ── Details ─────────────────────────    │
│ Title, year, quality badge              │
│ Description                             │
│ Genre links, cast links                 │
└─────────────────────────────────────────┘
```

---

### 6. Trending Page (`/trending`)

**Purpose:** Trending IMDb content (same layout as Movies/TV pages)
- Same header + sidebar
- Film grid with pagination
- Same card style

### 7. Genre/Country Pages (`/genre/{slug}`, `/country/{code}`)

**Purpose:** Filtered content by genre or country
- URL structure: `/genre/action`, `/country/US`
- Same film grid + pagination as browse pages
- Page heading shows genre/country name

### 8. Search Results

**Purpose:** Display search results
- Triggered from the search bar on any page
- Submits to `/search.php?keyword=...`
- Results grid with same film card layout
- Paginated results

---

## Film Card Component (flw-item)

**The core reusable component across all pages:**

```
┌────────────────┐
│                │
│   [Poster]     │  ← lazyloaded, 2:3 aspect ratio
│                │
│  2022  Movie   │  ← year + type row
│  Title Name    │  ← film title (truncated if long)
│  ▶ Watch now   │  ← CTA button
└────────────────┘
```

**Behavior:**
- Poster lazy loaded via `data-src` + lazyload class
- Hover: no special overlay effects (unlike Vidbanda)
- Click poster → navigates to detail page
- "Watch now" button → navigates to detail page
- Year + type shown as metadata row
- Title linked to detail page

---

## Responsive Breakpoints

| Breakpoint | Columns | Changes |
|---|---|---|
| < 576px | 2 columns | Mobile hamburger visible, smaller film cards, condensed header |
| 576-768px | 3 columns | Tablet portrait |
| 768-992px | 4 columns | Tablet landscape |
| 992-1200px | 5 columns | Desktop |
| > 1200px | 6 columns | Wide desktop |

**Mobile-specific:**
- Header collapses: Browse button shows only icon, search icon triggers mobile search overlay
- Sidebar becomes full-screen overlay
- Film cards smaller, condensed info

---

## Interaction Patterns

### Header Scroll Behavior
- Sticky header (fixed top)
- Background becomes opaque on scroll (no transparency)

### Search Autocomplete
- As user types, dropdown appears with suggestions
- Powered by Vue.js `@submit="search"` + `v-model="keyword"`
- Results popup class: `.search-result-pop.search-suggest`

### Server Selection
- Click server button → navigate to watch page
- On watch page, click different server → switch iframe source
- Active server gets highlighted/active state

### Sidebar Navigation
- Click "Browse" → sidebar slides in from left
- Click "←" or overlay → sidebar slides out
- Genre and Country sections are collapsible accordions
- Each genre/country link → filtered page

### Login Modal
- Opens via Bootstrap modal (`#modallogin`)
- Click "Login" button in header → modal pops up

---

## Ad Integration Points

Ads are integrated at these locations (via AntiAdBlock system):
1. Before the slider on home page
2. Between content sections
3. On detail page around the player
4. Injected via JavaScript popunders (2 per IP, 1 per day default)

Ad code is injected via a custom anti-adblock script that loads external JS/CSS resources.

---

## Key Files & URLs (for implementation reference)

| Page | URL Pattern | Purpose |
|---|---|---|
| Splash | `/` | Landing with logo + search |
| Home | `/home` | Slider + content grids + sidebar |
| Movies | `/movies` | Filterable movie grid |
| TV Shows | `/tv-show` | Filterable TV grid |
| Trending | `/trending` | Trending content |
| Movie Detail | `/movie/{slug}` | Details + servers |
| TV Detail | `/tv/{slug}` | TV show details + seasons |
| Watch | `/watch/{slug}` | Video player |
| Genre | `/genre/{slug}` | Genre-filtered grid |
| Country | `/country/{code}` | Country-filtered grid |
| Search | `/search.php?keyword=` | Search results |

**Slug format examples:**
- Movie: `backrooms-2026-online-hd`
- TV: `euphoria-2019-online`
- Genre: `action`, `horror`, `science-fiction`
- Country: `US`, `GB`, `FR`

---

## Key UX Differences from Vidbanda

| Aspect | Vidbanda (React) | SFlix (Target) |
|---|---|---|
| Landing | Hero immediately | Splash page first, then `/home` |
| Hero | Static single-item hero | Swiper.js carousel with multiple slides |
| Navigation | Top navbar with dropdowns | Sidebar slide-out with genre/country accordions |
| Search | Navbar inline | Navbar inline + autocomplete |
| Login | None | Login modal button |
| Film Card | Hover overlay (rating, list, play) | Simple card with year/type/title + watch button |
| Player | In-page iframe with server switcher | Navigate to `/watch/...` page |
| Filter | Inline FilterBar component | Modal-based filter with checkboxes |
| Pagination | Infinite scroll | Numbered pagination |
| Ad approach | Adsterra/Monetag scripts | AntiAdBlock system |
| Rating | None | Like/dislike + 5-star rate widget |
| Social | None | ShareThis integration |
| Trailer | In-page modal | Trailer links to modal |
| Icons | lucide-react | Font Awesome 5 |
| CSS | Tailwind CSS | Bootstrap 4 + custom CSS |
