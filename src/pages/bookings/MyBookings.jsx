import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../../api/services.js';
import BookingsList from '../../components/bookings/BookingsList.jsx';
import Loader from '../../components/ui/Loader.jsx';

const TABS = ['all', 'pending', 'approved', 'cancelled'];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = (status) => {
    setLoading(true);
    bookingsApi
      .mine(status && status !== 'all' ? status : undefined)
      .then((r) => setBookings(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await bookingsApi.cancel(id);
    load(tab);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">My bookings</h1>
      <p className="mt-1 text-muted">Track status and manage your requests</p>

      <section className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </section>

      <section className="mt-8">
        {loading ? <Loader /> : <BookingsList bookings={bookings} onCancel={cancel} />}
      </section>
    </section>
  );
}
