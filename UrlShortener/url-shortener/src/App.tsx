import { Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import RedirectPage from './pages/RedirectPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShortenerPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/:shortcode" element={<RedirectPage />} />

    </Routes>
  );
}

export default App;
