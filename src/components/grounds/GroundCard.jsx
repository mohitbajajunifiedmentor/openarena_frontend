import { Link } from 'react-router-dom';
import StarRating from '../venue/StarRating.jsx';
import { formatCurrency } from '../../utils/format.js';
import { getGroundImage, getGroundImageFallback } from '../../utils/images.js';
import SafeImage from '../ui/SafeImage.jsx';

const typeLabel = {
  sports: 'Sports ground',
  event: 'Event venue',
  mixed: 'Sports & events',
};

export default function GroundCard({ ground }) {
  const price = ground.pricing?.hourly || ground.pricing?.daily || ground.pricing?.eventBased;
  const isEvent = ground.groundType === 'event';
  const ed = ground.eventDetails || {};

  return (
    <Link
      to={`/grounds/${ground._id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <section className="relative">
        <SafeImage
          src={getGroundImage(ground)}
          fallback={getGroundImageFallback(ground)}
          alt={ground.name}
          className="aspect-[16/10] w-full object-cover transition group-hover:scale-[1.02]"
        />
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
            isEvent ? 'bg-rose-600 text-white' : 'bg-brand-700 text-white'
          }`}
        >
          {typeLabel[ground.groundType] || 'Venue'}
        </span>
      </section>
      <section className="space-y-2 p-4">
        <h3 className="font-display text-lg font-semibold group-hover:text-brand-700">{ground.name}</h3>
        {ground.ratingAverage > 0 && (
          <StarRating rating={ground.ratingAverage} reviewCount={ground.reviewCount} />
        )}
        {ground.tagline && <p className="line-clamp-2 text-sm text-slate-600">{ground.tagline}</p>}
        <p className="text-sm text-muted">
          {ground.location?.city}
          {isEvent && ed.seatedCapacity
            ? ` · seated ${ed.seatedCapacity}`
            : ` · up to ${ground.capacity} people`}
        </p>
        {price != null && (
          <p className="text-sm font-semibold text-brand-700">
            From {formatCurrency(price)}
            {isEvent ? ' / event' : ' / hour'}
          </p>
        )}
      </section>
    </Link>
  );
}
