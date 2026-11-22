import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/#work', label: 'Work', hash: '#work' },
  { to: '/#about', label: 'About', hash: '#about' },
  { to: '/#toolkit', label: 'Toolkit', hash: '#toolkit' },
  { to: '/#experience', label: 'Experience', hash: '#experience' },
  { to: '/blog', label: 'Blog', isRoute: true },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const sections = ['work', 'about', 'toolkit', 'experience'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);

        if (element) {
          const { offsetTop, offsetHeight } = element;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      setActiveSection(hash);
    } else if (
      location.pathname === '/' ||
      location.pathname === ''
    ) {
      setActiveSection('');
    }
  }, [location.hash, location.pathname]);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    setMenuOpen(false);

    if (
      location.pathname === '/' ||
      location.pathname === ''
    ) {
      e.preventDefault();

      const element = document.getElementById(
        hash.replace('#', '')
      );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  const isHomePage =
    location.pathname === '/' ||
    location.pathname === '';

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[calc(100%-2rem)]
        max-w-[1100px]
        flex items-center
        px-5 md:px-6
        py-3
        ${isScrolled ? 'bg-surface/85' : 'bg-surface/50'}
        backdrop-blur-xl
        rounded-full
        border border-white/10
        shadow-[0_0_40px_rgba(0,219,231,0.1)]
        transition-all duration-500 ease-out
      `}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link
        to="/"
        className="
          font-display-lg-mobile
          text-primary
          tracking-tighter
          cursor-hover
          shrink-0
          py-2
        "
      >
        Sudenur Meydan
      </Link>

      {/* Navigation */}
      <div
        className="
          hidden md:flex
          items-center
          justify-center
          gap-6 lg:gap-8
          flex-1
          min-w-0
          mx-4
        "
      >
        {links.map(({ to, label, isRoute, hash }) =>
          isRoute ? (
            <Link
              key={to}
              to={to}
              className={`font-label-mono text-label-mono cursor-hover transition-colors duration-300 hover:scale-105 ${
                location.pathname === to
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ) : (
            <Link
              key={to}
              to={to}
              onClick={(e) =>
                handleSectionClick(e, hash!)
              }
              className={`font-label-mono text-label-mono cursor-hover transition-colors duration-300 hover:scale-105 whitespace-nowrap ${
                isHomePage && activeSection === hash
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {label}
            </Link>
          )
        )}
      </div>

      {/* Connect */}
      <Link
        to="/connect"
        className={`
          bg-primary-container
          text-on-primary-container
          font-label-mono
          text-label-mono
          px-5
          lg:px-6
          py-2
          rounded-full
          interactive-btn
          cursor-hover
          shrink-0
          hidden md:block
          transition-all duration-300
          whitespace-nowrap
          ${
            location.pathname === '/connect'
              ? 'ring-2 ring-primary'
              : ''
          }
        `}
      >
        Connect
      </Link>

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="
          md:hidden ml-auto
          w-11 h-11 -mr-2
          flex items-center justify-center
          rounded-full text-primary
          hover:bg-white/5 transition-colors
        "
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {menuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`
          md:hidden absolute top-full left-0 right-0 mt-2
          rounded-3xl border border-white/10
          bg-surface-container-low/[0.98] backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,219,231,0.1)]
          p-3 flex flex-col
          origin-top transition-all duration-300
          ${menuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible pointer-events-none'}
        `}
      >
        {links.map(({ to, label, isRoute, hash }) => {
          const isActive = isRoute
            ? location.pathname === to
            : isHomePage && activeSection === hash;

          return (
            <Link
              key={to}
              to={to}
              onClick={isRoute ? () => setMenuOpen(false) : (e) => handleSectionClick(e, hash!)}
              className={`font-label-mono text-label-mono uppercase px-4 py-3.5 rounded-2xl transition-colors ${
                isActive ? 'text-primary bg-white/5' : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          );
        })}

        <Link
          to="/connect"
          onClick={() => setMenuOpen(false)}
          className="mt-2 bg-primary-container text-on-primary-container font-label-mono text-label-mono uppercase text-center px-4 py-3.5 rounded-2xl"
        >
          Connect
        </Link>
      </div>
    </nav>
  );
}
