import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogApi, groundsApi } from '../../api/services.js';
import GroundCard from '../../components/grounds/GroundCard.jsx';
import GroundFilters from '../../components/grounds/GroundFilters.jsx';
import Loader from '../../components/ui/Loader.jsx';

const emptyFilters = {
  city: '',
  groundType: '',
  minArea: '',
  minCapacity: '',
  maxPeople: '',
  sportsType: '',
  eventType: '',
  amenities: '',
};

function filtersFromParams(searchParams) {
  return {
    city: searchParams.get('city') || '',
    groundType: searchParams.get('groundType') || '',
    minArea: searchParams.get('minArea') || '',
    minCapacity: searchParams.get('minCapacity') || '',
    maxPeople: searchParams.get('maxPeople') || '',
    sportsType: searchParams.get('sportsType') || '',
    eventType: searchParams.get('eventType') || '',
    amenities: searchParams.get('amenities') || '',
  };
}

export default function GroundsList() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [applied, setApplied] = useState(() => filtersFromParams(searchParams));
  const [grounds, setGrounds] = useState([]);
  const [total, setTotal] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([catalogApi.amenities(), catalogApi.categories('sports'), catalogApi.categories('event')])
      .then(([a, s, e]) => {
        setAmenities(a.data);
        setSports(s.data);
        setEvents(e.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fromUrl = filtersFromParams(searchParams);
    setFilters(fromUrl);
    setApplied(fromUrl);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(applied).filter(([, v]) => v));
    groundsApi
      .list(params)
      .then((res) => {
        setGrounds(res.data.grounds);
        setTotal(res.data.total ?? res.data.grounds.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [applied]);

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Browse grounds</h1>
        <p className="mt-1 text-muted">
          {applied.city ? `${total} ground${total === 1 ? '' : 's'} in ${applied.city}` : `${total} grounds`}
          {applied.groundType === 'sports' && ' · sports'}
          {applied.groundType === 'event' && ' · events'}
        </p>
      </header>
      <GroundFilters filters={filters} onChange={setFilters} onSearch={() => setApplied({ ...filters })} amenities={amenities} sports={sports} events={events} />
      {loading ? <Loader /> : error ? <p className="text-red-600">{error}</p> : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grounds.length ? grounds.map((g) => <GroundCard key={g._id} ground={g} />) : <p className="col-span-full text-muted">No grounds found. Try different filters.</p>}
        </section>
      )}
    </section>
  );
}
