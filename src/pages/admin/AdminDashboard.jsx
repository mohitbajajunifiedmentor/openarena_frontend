import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics().then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(stats).map(([k, v]) => (
          <article key={k} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-muted">{k.replace(/([A-Z])/g, ' $1')}</p>
            <p className="mt-1 font-display text-xl font-bold">{v}</p>
          </article>
        ))}
      </section>
      <section className="flex flex-wrap gap-3">
        <Link to="/admin/users"><Button variant="secondary">Users</Button></Link>
        <Link to="/admin/owners"><Button variant="secondary">Create owners</Button></Link>
        <Link to="/admin/grounds"><Button variant="secondary">Pending grounds</Button></Link>
        <Link to="/admin/bookings"><Button variant="secondary">Bookings</Button></Link>
        <Link to="/admin/catalog"><Button variant="secondary">Catalog</Button></Link>
      </section>
    </section>
  );
}
