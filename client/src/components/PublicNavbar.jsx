import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `text-base font-semibold transition ${isActive ? 'text-(--home-primary)' : 'text-(--home-muted) hover:text-(--home-primary)'}`;

export const PublicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-(--home-border)/80 bg-(--home-bg)/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-(--home-accent) to-(--home-accent-deep) text-base text-white font-bold">
            <img src="/logo.png" alt="" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-(--home-text)">S & C Tours</p>
            {/* <p className="text-sm text-(--home-muted)">Discover Amazing India</p> */}
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/tours" className={navLinkClass}>
            Tours
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-lg bg-linear-to-r from-(--home-accent) to-(--home-accent-deep) px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:opacity-95 sm:inline-flex"
          >
            Plan My Trip
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-(--home-border) bg-(--home-surface) text-(--home-text) md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-(--home-border) bg-(--home-surface) px-4 py-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} end onClick={handleCloseMenu}>
              Home
            </NavLink>
            <NavLink to="/tours" className={navLinkClass} onClick={handleCloseMenu}>
              Tours
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={handleCloseMenu}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={handleCloseMenu}>
              Contact
            </NavLink>
            <Link
              to="/contact"
              onClick={handleCloseMenu}
              className="mt-2 inline-flex w-fit rounded-lg bg-linear-to-r from-(--home-accent) to-(--home-accent-deep) px-4 py-2 text-sm font-semibold text-white"
            >
              Plan My Trip
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
