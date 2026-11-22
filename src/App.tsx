import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Connect from './pages/Connect';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          {/* Legacy section URLs: redirect so they don't duplicate the home page */}
          <Route path="about" element={<Navigate to={{ pathname: '/', hash: '#about' }} replace />} />
          <Route path="projects" element={<Navigate to={{ pathname: '/', hash: '#work' }} replace />} />
          <Route path="connect" element={<Connect />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Navigate to="/blog" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
