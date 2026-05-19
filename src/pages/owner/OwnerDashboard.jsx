import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ownerApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { formatCurrency } from '../../utils/format.js';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.dashboard().then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <section>
          <h1 className="font-display text-3xl font-bold">Owner dashboard</h1>
          <p className="text-muted">Manage listings, bookings, and revenue</p>
        </section>
        <Link to="/owner/grounds/new"><Button>Add ground</Button></Link>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total grounds', value: data.totalGrounds },
          { label: 'Pending listings', value: data.pendingListings },
          { label: 'Pending bookings', value: data.pendingBookings },
          { label: 'Total bookings', value: data.totalBookings },
        ].map((s) => (
          <article key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-brand-600 p-5 text-white">
          <p className="text-sm opacity-90">Sports revenue</p>
          <p className="font-display text-2xl font-bold">{formatCurrency(data.revenue.sports)}</p>
        </article>
        <article className="rounded-2xl bg-slate-800 p-5 text-white">
          <p className="text-sm opacity-90">Event revenue</p>
          <p className="font-display text-2xl font-bold">{formatCurrency(data.revenue.event)}</p>
        </article>
        <article className="rounded-2xl border-2 border-brand-200 bg-brand-50 p-5">
          <p className="text-sm text-brand-800">Total revenue</p>
          <p className="font-display text-2xl font-bold text-brand-900">{formatCurrency(data.revenue.total)}</p>
        </article>
      </section>
      <section className="flex gap-3">
        <Link to="/owner/grounds"><Button variant="secondary">My grounds</Button></Link>
        <Link to="/owner/bookings"><Button variant="secondary">Booking requests</Button></Link>
      </section>
    </section>
  );
}
