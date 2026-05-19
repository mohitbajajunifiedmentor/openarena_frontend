export default function StarRating({ rating = 0, reviewCount, size = 'sm', showCount = true }) {
  if (!rating && !reviewCount) return null;

  const sizeClass = size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${sizeClass}`}>
      <span className="tracking-tight text-amber-500" aria-label={`${rating} out of 5 stars`}>
        {'★'.repeat(Math.round(rating))}
        <span className="text-slate-300">{'★'.repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="font-semibold text-ink">{Number(rating).toFixed(1)}</span>
      {showCount && reviewCount > 0 && (
        <span className="text-muted">
          ({reviewCount} review{reviewCount === 1 ? '' : 's'})
        </span>
      )}
    </span>
  );
}
