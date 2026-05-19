import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BookingsList from '../../components/bookings/BookingsList.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

function computeStats(bookings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    upcoming: bookings.filter((b) => {
      const d = new Date(b.date);
      d.setHours(0, 0, 0, 0);
      return d >= today && ['pending', 'approved'].includes(b.status);
    }).length,
    sports: bookings.filter((b) => b.bookingType === 'sports').length,
    events: bookings.filter((b) => b.bookingType === 'event').length,
    spent: bookings
      .filter((b) => b.status === 'approved')
      .reduce((s, b) => s + (b.totalPrice || b.pricingSnapshot?.estimatedTotal || 0), 0),
  };
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi
      .mine()
      .then((r) => setBookings(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => computeStats(bookings), [bookings]);

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookings
      .filter((b) => {
        const d = new Date(b.date);
        d.setHours(0, 0, 0, 0);
        return d >= today && ['pending', 'approved'].includes(b.status);
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [bookings]);

  const recent = useMemo(() => bookings.slice(0, 5), [bookings]);

  if (loading) return <Loader label="Loading your dashboard..." />;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <section>
          <p className="text-sm font-medium text-brand-600">Welcome back</p>
          <h1 className="font-display text-3xl font-bold">{user?.name}</h1>
          <p className="mt-1 text-muted">Your bookings, activity, and quick links</p>
        </section>
        <section className="flex flex-wrap gap-2">
          <Link to="/#venues">
            <Button>Book a venue</Button>
          </Link>
          <Link to="/bookings">
            <Button variant="secondary">All bookings</Button>
          </Link>
        </section>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total bookings', value: stats.total, color: 'border-slate-200' },
          { label: 'Pending approval', value: stats.pending, color: 'border-amber-200 bg-amber-50/50' },
          { label: 'Confirmed', value: stats.approved, color: 'border-emerald-200 bg-emerald-50/50' },
          { label: 'Upcoming', value: stats.upcoming, color: 'border-brand-200 bg-brand-50/50' },
        ].map((s) => (
          <article key={s.label} className={`rounded-2xl border bg-white p-5 shadow-sm ${s.color}`}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="font-display text-lg font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <section>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </section>
            <section>
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium">{user?.phone || '—'}</dd>
            </section>
            {memberSince && (
              <section>
                <dt className="text-muted">Member since</dt>
                <dd className="font-medium">{memberSince}</dd>
              </section>
            )}
          </dl>
          <Link to="/dashboard/profile" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
            Edit profile →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Activity</h2>
          <section className="mt-4 grid gap-4 sm:grid-cols-3">
            <section className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-muted">Sports</p>
              <p className="text-2xl font-bold">{stats.sports}</p>
            </section>
            <section className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-muted">Events</p>
              <p className="text-2xl font-bold">{stats.events}</p>
            </section>
            <section className="rounded-xl bg-brand-50 p-4">
              <p className="text-xs uppercase text-brand-700">Approved spend</p>
              <p className="text-2xl font-bold text-brand-900">{formatCurrency(stats.spent)}</p>
            </section>
          </section>
        </article>
      </section>

      {upcoming.length > 0 && (
        <section>
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Upcoming</h2>
            <Link to="/bookings" className="text-sm font-semibold text-brand-700 hover:underline">
              See all
            </Link>
          </header>
          <section className="grid gap-3 sm:grid-cols-3">
            {upcoming.map((b) => (
              <article key={b._id} className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
                <p className="font-semibold">{b.ground?.name}</p>
                <p className="text-sm text-muted">{formatDate(b.date)}</p>
                <p className="text-xs capitalize text-slate-600">{b.status}</p>
              </article>
            ))}
          </section>
        </section>
      )}

      <section>
        <header className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
          <Link to="/bookings" className="text-sm font-semibold text-brand-700 hover:underline">
            View all →
          </Link>
        </header>
        <BookingsList bookings={recent} compact />
      </section>
    </section>
  );
}
