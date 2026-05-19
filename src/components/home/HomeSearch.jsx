import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { groundsApi } from '../../api/services.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function HomeSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(() => searchParams.get('city') || '');
  const [groundType, setGroundType] = useState(() => searchParams.get('groundType') || 'all');
  const [count, setCount] = useState(null);
  const [cities, setCities] = useState([]);
  const [loadingCount, setLoadingCount] = useState(false);

  const urlCity = searchParams.get('city') || '';
  const urlType = searchParams.get('groundType') || '';
  const hasActiveFilters = Boolean(urlCity || urlType);

  useEffect(() => {
    setCity(urlCity);
    setGroundType(urlType || 'all');
  }, [urlCity, urlType]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoadingCount(true);
      const params = {};
      if (city.trim()) params.city = city.trim();
      if (groundType !== 'all') params.groundType = groundType;
      groundsApi
        .locationStats(params)
        .then((r) => {
          setCount(r.data.total);
          setCities(r.data.cities || []);
        })
        .catch(() => {
          setCount(null);
          setCities([]);
        })
        .finally(() => setLoadingCount(false));
    }, 400);
    return () => clearTimeout(t);
  }, [city, groundType]);

  const runSearch = (cityValue = city, typeValue = groundType) => {
    const params = new URLSearchParams();
    if (cityValue.trim()) params.set('city', cityValue.trim());
    if (typeValue !== 'all') params.set('groundType', typeValue);
    const search = params.toString();
    navigate({
      pathname: '/',
      search: search ? `?${search}` : '',
      hash: 'venues',
    });
  };

  const clearFilters = () => {
    setCity('');
    setGroundType('all');
    navigate({ pathname: '/', search: '', hash: 'venues' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mt-8 max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5"
    >
      <section className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div className="relative">
          <Input
            label="Location (city)"
            placeholder="e.g. Mumbai, Pune"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="!bg-white pr-10"
          />
          {city.trim() && (
            <button
              type="button"
              onClick={() => runSearch('', groundType)}
              className="absolute right-3 top-[2.15rem] rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear city"
              title="Clear city"
            >
              ×
            </button>
          )}
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900"
            value={groundType}
            onChange={(e) => setGroundType(e.target.value)}
          >
            <option value="all">All grounds</option>
            <option value="sports">Sports ground</option>
            <option value="event">Event venue</option>
          </select>
        </label>
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </section>

      <section className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          {loadingCount ? (
            'Checking availability…'
          ) : count !== null ? (
            <>
              <strong className="text-brand-800">{count}</strong>
              {city.trim() ? ` ground${count === 1 ? '' : 's'} in “${city.trim()}”` : ' approved grounds'}
              {groundType === 'sports' && ' (sports)'}
              {groundType === 'event' && ' (events)'}
            </>
          ) : null}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Reset filters
          </button>
        )}
      </section>

      {cities.length > 1 && !city.trim() && (
        <p className="mt-1 text-xs text-slate-500">
          Popular:{' '}
          {cities.slice(0, 5).map((c, i) => (
            <span key={c.city}>
              {i > 0 && ' · '}
              <button
                type="button"
                className="font-medium text-brand-700 hover:underline"
                onClick={() => {
                  setCity(c.city);
                  runSearch(c.city, groundType);
                }}
              >
                {c.city} ({c.count})
              </button>
            </span>
          ))}
        </p>
      )}
    </form>
  );
}
