import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/context/SidebarContext';
import { LoginProvider } from '@/context/LoginContext';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TVDetailPage from './pages/TVDetailPage';
import WatchPage from './pages/WatchPage';
import GenrePage from './pages/GenrePage';
import CountryPage from './pages/CountryPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <SidebarProvider>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv-show" element={<TVShowsPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/movie/:slug" element={<MovieDetailPage />} />
          <Route path="/tv/:slug" element={<TVDetailPage />} />
          <Route path="/watch/:slug" element={<WatchPage />} />
          <Route path="/genre/:slug" element={<GenrePage />} />
          <Route path="/country/:code" element={<CountryPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </LoginProvider>
    </SidebarProvider>
  );
}
