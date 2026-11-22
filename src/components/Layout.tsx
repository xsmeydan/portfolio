import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';

export default function Layout() {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="main-content outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
