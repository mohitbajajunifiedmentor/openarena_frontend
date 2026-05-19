import StarRating from './StarRating.jsx';

function formatReviewDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export default function VenueReviews({ ground }) {
  const reviews = ground?.reviews || [];
  if (!reviews.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Guest reviews</h2>
          <p className="mt-1 text-sm text-muted">Verified bookings on OpenArena</p>
        </div>
        <StarRating rating={ground.ratingAverage} reviewCount={ground.reviewCount} size="lg" />
      </header>

      <ul className="space-y-5">
        {reviews.map((r) => (
          <li key={r._id || `${r.authorName}-${r.createdAt}`} className="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">{r.authorName}</p>
              <span className="text-xs text-muted">{formatReviewDate(r.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-amber-600">
              {'★'.repeat(r.rating)}
              <span className="text-slate-300">{'★'.repeat(5 - r.rating)}</span>
            </p>
            {r.visitType && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-700">{r.visitType}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
