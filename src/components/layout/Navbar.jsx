import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';
import UserMenu from './UserMenu.jsx';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`;

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <section className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-brand-800">
          Open<span className="text-brand-600">Arena</span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-5 gap-y-1 md:flex">
          <a href="/#venues" className="text-sm font-medium text-slate-600 hover:text-brand-700">
            Browse venues
          </a>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/how-it-works" className={linkClass}>
            How it works
          </NavLink>
          <NavLink to="/faq" className={linkClass}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          {user?.role === 'owner' && (
            <NavLink to="/owner" className={linkClass}>
              Owner Panel
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <section className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </section>
      </section>

      <nav
        aria-label="Primary shortcuts"
        className="flex gap-5 overflow-x-auto border-t border-slate-100 bg-white/95 px-4 py-2.5 md:hidden scrollbar-thin"
      >
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        <NavLink to="/how-it-works" className={linkClass}>
          How it works
        </NavLink>
        <NavLink to="/faq" className={linkClass}>
          FAQ
        </NavLink>
        <NavLink to="/contact" className={linkClass}>
          Contact
        </NavLink>
        <a href="/#venues" className="text-sm font-medium whitespace-nowrap text-slate-600 shrink-0">
          Venues
        </a>
      </nav>
    </header>
  );
}
