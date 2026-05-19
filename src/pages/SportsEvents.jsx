import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { catalogApi } from '../api/services.js';
import Loader from '../components/ui/Loader.jsx';
import { getCategoryImage } from '../utils/images.js';

export default function SportsEvents() {
  const [params] = useSearchParams();
  const type = params.get('type') || 'sports';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    catalogApi.categories(type).then((r) => setCategories(r.data)).finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">
        {type === 'event' ? 'Event categories' : 'Sports categories'}
      </h1>
      <p className="mt-1 text-muted">Browse grounds by activity type</p>
      {loading ? (
        <Loader />
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/grounds?${type === 'event' ? 'eventType' : 'sportsType'}=${c._id}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <img src={getCategoryImage(c)} alt={c.name} className="h-40 w-full object-cover" />
              <section className="p-4">
                <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
              </section>
            </Link>
          ))}
        </section>
      )}
    </section>
  );
}
