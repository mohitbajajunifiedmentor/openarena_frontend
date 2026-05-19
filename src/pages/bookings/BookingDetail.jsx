import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bookingsApi } from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { STATUS_COLORS, formatCurrency, formatDate } from '../../utils/format.js';
import { formatTime12 } from '../../utils/time.js';
import { getGroundImage } from '../../utils/images.js';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    bookingsApi
      .get(id)
      .then((r) => setBooking(r.data))
      .catch((err) => {
        setBooking(null);
        setError(err.message || 'Unable to load booking.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isBookingGuest = booking && user && String(booking.user?._id || booking.user) === String(user._id);
  const staffViewer = user?.role === 'admin' || user?.role === 'owner';
  const canCancelGuest = isBookingGuest && booking && ['pending', 'approved'].includes(booking.status);

  const handleCancel = async () => {
    if (!booking || !canCancelGuest) return;
    if (!confirm('Cancel this booking?')) return;
    setCancelling(true);
    try {
      await bookingsApi.cancel(booking._id);
      navigate('/bookings');
    } catch (err) {
      setError(err.message || 'Cancel failed.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Loader label="Loading booking…" />
      </section>
    );
  }

  if (error || !booking) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link to="/bookings" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Back to bookings
        </Link>
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error || 'Booking not found.'}</p>
      </section>
    );
  }

  const g = booking.ground;
  const price = booking.totalPrice || booking.pricingSnapshot?.estimatedTotal;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to={staffViewer && user?.role === 'admin' ? '/admin/bookings' : staffViewer ? '/owner/bookings' : '/bookings'} className="text-sm font-semibold text-brand-700 hover:underline">
        ← {staffViewer && user?.role === 'admin' ? 'Admin bookings' : staffViewer ? 'Owner bookings' : 'My bookings'}
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Booking ref</p>
          <p className="font-mono text-xs text-slate-500">{booking._id}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">{g?.name || 'Venue'}</h1>
          {g?.location?.city && (
            <p className="mt-1 text-sm text-muted">
              {g.location.city}
              {g.location?.state ? `, ${g.location.state}` : ''}
            </p>
          )}
        </div>
        <Badge className={STATUS_COLORS[booking.status] || STATUS_COLORS.pending}>{booking.status}</Badge>
      </header>

      {staffViewer && booking.user && !isBookingGuest && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Guest booking this slot</p>
          <p className="mt-2 font-semibold text-ink">{booking.user?.name || '—'}</p>
          <p className="text-muted">{booking.user?.email}</p>
          {booking.user?.phone && <p className="mt-1 text-ink">{booking.user.phone}</p>}
        </section>
      )}

      <div className="mt-8 flex gap-6 max-sm:flex-col">
        {g && (
          <img
            src={getGroundImage(g)}
            alt=""
            className="h-40 w-full shrink-0 rounded-2xl object-cover sm:h-44 sm:w-56"
          />
        )}
        <dl className="grid flex-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Date</dt>
            <dd className="mt-1 font-medium text-ink">{formatDate(booking.date)}</dd>
          </div>
          <div>
            <dt className="text-muted">Time</dt>
            <dd className="mt-1 font-medium text-ink">
              {formatTime12(booking.startTime)} – {formatTime12(booking.endTime)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Type</dt>
            <dd className="mt-1 font-medium capitalize text-ink">
              {booking.bookingType}
              {booking.category?.name ? ` · ${booking.category.name}` : ''}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Guests</dt>
            <dd className="mt-1 font-medium text-ink">{booking.numberOfPeople} people</dd>
          </div>
          {price != null && price > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-muted">Estimate</dt>
              <dd className="mt-1 text-lg font-semibold text-brand-800">{formatCurrency(price)}</dd>
            </div>
          )}
        </dl>
      </div>

      {(booking.userNote || booking.ownerNote || booking.rejectionReason) && (
        <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm">
          {booking.userNote && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                {staffViewer && !isBookingGuest ? 'Guest message' : 'Your message'}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{booking.userNote}</p>
            </div>
          )}
          {booking.ownerNote && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Owner note</p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{booking.ownerNote}</p>
            </div>
          )}
          {booking.rejectionReason && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Reason</p>
              <p className="mt-1 text-red-700">{booking.rejectionReason}</p>
            </div>
          )}
        </section>
      )}

      <section className="mt-8 flex flex-wrap gap-3">
        {g?._id && (
          <Link to={`/grounds/${g._id}`} className="inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            View venue page
          </Link>
        )}
        {canCancelGuest && (
          <Button variant="danger" disabled={cancelling} onClick={handleCancel}>
            {cancelling ? 'Cancelling…' : 'Cancel booking'}
          </Button>
        )}
      </section>
    </article>
  );
}
