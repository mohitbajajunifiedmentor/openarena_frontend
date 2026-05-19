import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function initials(name) {
  return (name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function dashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'owner') return '/owner';
  return '/dashboard';
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dashTo = dashboardPath(user?.role);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <section
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-brand-300 hover:shadow"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
          {initials(user?.name)}
        </span>
        <span className="hidden max-w-[120px] truncate text-left text-sm font-medium text-slate-800 sm:block">
          {user?.name}
        </span>
        <span className="text-xs text-slate-400" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <section className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
          <section className="border-b border-slate-100 px-4 py-3">
            <p className="truncate font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </section>
          <nav className="py-1">
            <Link
              to={dashTo}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 transition hover:bg-brand-50"
            >
              <p className="text-sm font-medium text-slate-800">Dashboard</p>
              <p className="text-xs text-muted">Overview & stats</p>
            </Link>
          </nav>
          <section className="border-t border-slate-100 px-2 py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </section>
        </section>
      )}
    </section>
  );
}
