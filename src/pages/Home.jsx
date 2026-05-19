import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import HomeSearch from '../components/home/HomeSearch.jsx';
import {
  HomeBottomCtas,
  HomeBrowseCategories,
  HomeHowItWorksTeaser,
  HomePopularCities,
  HomeStatsStrip,
  HomeValueProps,
} from '../components/home/HomePageSections.jsx';
import GroundCard from '../components/grounds/GroundCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import { groundsApi } from '../api/services.js';
import HeroBackground from '../components/home/HeroBackground.jsx';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discovery, setDiscovery] = useState({ total: null, cities: [] });

  const city = searchParams.get('city') || '';
  const groundType = searchParams.get('groundType') || '';
  const hasSearch = Boolean(city || groundType);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 50 };
    if (city) params.city = city;
    if (groundType) params.groundType = groundType;
    setError('');
    groundsApi
      .list(params)
      .then((r) => {
        setListings(r.data.grounds || []);
        setTotal(r.data.total ?? r.data.grounds?.length ?? 0);
      })
      .catch((err) => {
        setListings([]);
        setTotal(0);
        setError(err.message || 'Could not load venues. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, [city, groundType]);

  useEffect(() => {
    groundsApi
      .locationStats({})
      .then((r) => {
        setDiscovery({
          total: r.data?.total ?? null,
          cities: r.data?.cities || [],
        });
      })
      .catch(() => {
        setDiscovery({ total: null, cities: [] });
      });
  }, []);

  useEffect(() => {
    if (!hasSearch && window.location.hash !== '#venues') return;
    const t = window.setTimeout(() => {
      document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(t);
  }, [city, groundType, hasSearch, loading]);

  const cityCount = discovery.cities?.length ?? 0;

  const venuesSection = (
    <section id="venues" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <header className="mb-8">
        <h2 className="font-display text-3xl font-bold">
          {hasSearch ? 'Search results' : groundType === 'sports' ? 'Sports grounds' : groundType === 'event' ? 'Event venues' : 'All venues'}
        </h2>
        <p className="mt-1 text-muted">
          {city
            ? `${total} venue${total === 1 ? '' : 's'} in ${city}`
            : `${total} venues available`}
          {hasSearch ? '' : ' — click a card for details & booking'}
        </p>
        {hasSearch && (
          <Link
            to={{ pathname: '/', hash: 'venues' }}
            className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
          >
            ← Show all venues
          </Link>
        )}
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {loading ? (
        <Loader />
      ) : listings.length ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((g) => (
            <GroundCard key={g._id} ground={g} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-muted">No venues match your search.</p>
          <p className="mt-2 text-sm text-slate-500">Try another city or venue type.</p>
        </section>
      )}
    </section>
  );

  const marketingSections = (
    <>
      <HomeStatsStrip total={discovery.total} cityCount={cityCount} />
      <HomeValueProps />
      <HomeBrowseCategories />
      <HomeHowItWorksTeaser />
      <HomePopularCities cities={discovery.cities} />
    </>
  );

  return (
    <article className="bg-white">
      <section className="relative min-h-[520px] overflow-hidden text-white">
        <HeroBackground />
        <section className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-100 backdrop-blur-sm sm:text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" aria-hidden />
            Discovery · Scheduling · Trusted venues
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Your next turf match or celebration starts here.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Search by city and venue type, compare photos and amenities, then request a slot — owners respond with a clear approve or reschedule path.
          </p>
          <section className="mt-8 flex flex-wrap gap-3">
            <a
              href="#venues"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-md transition hover:bg-brand-50"
            >
              Browse catalogue
            </a>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-white/35 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              How booking works
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-brand-100 transition hover:text-white"
            >
              About OpenArena
            </Link>
          </section>
          <HomeSearch />
        </section>
      </section>

      {hasSearch ? (
        <>
          {venuesSection}
          {marketingSections}
        </>
      ) : (
        <>
          {marketingSections}
          {venuesSection}
        </>
      )}

      <HomeBottomCtas />
    </article>
  );
}
