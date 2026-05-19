import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="text-center sm:text-left">
          <p className="font-display font-semibold text-ink">OpenArena</p>
          <p className="mt-2 text-muted">Sports & Events Ground Management Platform</p>
          <p className="mt-1 text-xs text-muted">Unified Mentor × Eventup.com</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-end" aria-label="Footer">
          <Link to="/about" className="text-muted hover:text-brand-700">
            About
          </Link>
          <Link to="/how-it-works" className="text-muted hover:text-brand-700">
            How it works
          </Link>
          <Link to="/faq" className="text-muted hover:text-brand-700">
            FAQ
          </Link>
          <Link to="/contact" className="text-muted hover:text-brand-700">
            Contact
          </Link>
          <a href="/#venues" className="text-muted hover:text-brand-700">
            Venues
          </a>
        </nav>
      </div>
    </footer>
  );
}
