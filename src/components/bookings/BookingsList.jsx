import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { STATUS_COLORS, formatCurrency, formatDate } from '../../utils/format.js';
import { getGroundImage } from '../../utils/images.js';

export default function BookingsList({ bookings, onCancel, compact = false }) {
  if (!bookings.length) {
    return <p className="text-sm text-muted">No bookings yet.</p>;
  }

  return (
    <section className={compact ? 'space-y-3' : 'space-y-4'}>
      {bookings.map((b) => (
        <article
          key={b._id}
          className={`flex gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm ${
            compact ? 'p-4' : 'p-5'
          }`}
        >
          {b.ground && (
            <img
              src={getGroundImage(b.ground)}
              alt=""
              className={`shrink-0 rounded-xl object-cover ${compact ? 'h-16 w-20' : 'h-20 w-28'}`}
            />
          )}
          <section className="min-w-0 flex-1">
            <section className="flex flex-wrap items-start justify-between gap-2">
              <section>
                <h3 className="font-semibold">{b.ground?.name || 'Venue'}</h3>
                <p className="text-sm text-muted">
                  {formatDate(b.date)} · {b.startTime}–{b.endTime}
                </p>
                <p className="text-sm capitalize text-slate-600">
                  {b.bookingType}
                  {b.category?.name ? ` · ${b.category.name}` : ''} · {b.numberOfPeople} people
                </p>
                {(b.totalPrice > 0 || b.pricingSnapshot?.estimatedTotal) && (
                  <p className="mt-1 text-sm font-medium text-brand-700">
                    {formatCurrency(b.totalPrice || b.pricingSnapshot?.estimatedTotal)}
                  </p>
                )}
              </section>
              <Badge className={STATUS_COLORS[b.status] || STATUS_COLORS.pending}>{b.status}</Badge>
            </section>
            {onCancel && ['pending', 'approved'].includes(b.status) && (
              <Button variant="danger" className="mt-3" onClick={() => onCancel(b._id)}>
                Cancel booking
              </Button>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              <Link to={`/bookings/${b._id}`} className="text-xs font-semibold text-brand-700 hover:underline">
                View details →
              </Link>
              {b.ground?._id && (
                <Link
                  to={`/grounds/${b.ground._id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-brand-700 hover:underline"
                >
                  View venue →
                </Link>
              )}
            </div>
          </section>
        </article>
      ))}
    </section>
  );
}
