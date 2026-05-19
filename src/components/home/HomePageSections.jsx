import { Link } from 'react-router-dom';

function StatCard({ value, label, hint }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-3xl font-bold tabular-nums text-brand-800">{value}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function HomeStatsStrip({ total, cityCount }) {
  const hasNumbers = total != null || cityCount != null;
  if (!hasNumbers) return null;

  return (
    <section className="border-y border-slate-200/80 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-12">
        <StatCard
          value={total != null ? total : '—'}
          label="Listed venues"
          hint="Sports grounds & event spaces"
        />
        <StatCard
          value={cityCount != null ? `${cityCount}` : '—'}
          label="Cities on the map"
          hint="More locations added regularly"
        />
        <StatCard value="3 steps" label="To send a request" hint="Search, pick a slot, owner confirms" />
      </div>
    </section>
  );
}

const VALUE_PROPS = [
  {
    title: 'Photos & clarity',
    body: 'Every card shows imagery, capacity, amenities, and rough pricing before you decide.',
    icon: '🖼️',
  },
  {
    title: 'Fair scheduling',
    body: 'Time slots surface conflicts upfront so double-bookings stay out of the picture.',
    icon: '⏱️',
  },
  {
    title: 'Sports & events',
    body: 'Cricket nets, turf football, lawns for weddings — filter by venue type in seconds.',
    icon: '🎯',
  },
  {
    title: 'Track requests',
    body: 'Log in anytime to view status under My Bookings after you submit a request.',
    icon: '✅',
  },
];

export function HomeValueProps() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Built for organisers & teams</h2>
          <p className="mt-3 text-muted">
            OpenArena brings venue discovery and booking requests into one calm flow — whether you&apos;re lining up a league match
            or locking a celebration date.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v) => (
            <article
              key={v.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {v.icon}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBrowseCategories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="mb-10">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Browse by venue type</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Jump straight into the inventory that fits your outing — turf games, nets, lawns, banquet halls and more.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/?groundType=sports#venues"
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-teal-600 p-8 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Play</p>
          <h3 className="mt-3 font-display text-2xl font-bold">Sports grounds</h3>
          <p className="mt-2 max-w-sm text-sm text-brand-50">
            Turf & grass pitches, nets, multisport arenas — hourly slots tuned for practise and matches.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3">
            See sports venues <span aria-hidden>→</span>
          </span>
        </Link>
        <Link
          to="/?groundType=event#venues"
          className="group relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-700 via-rose-600 to-amber-600 p-8 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-100">Celebrate</p>
          <h3 className="mt-3 font-display text-2xl font-bold">Event venues</h3>
          <p className="mt-2 max-w-sm text-sm text-rose-50">
            Open lawns, halls, and mixed-use spaces suited for gigs, receptions, corporates & community gatherings.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3">
            See event spaces <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

const MINI_STEPS = [
  { title: 'Search & filter', desc: 'City, type, and tags narrow the list to venues that actually fit.' },
  { title: 'Open a venue', desc: 'Gallery, rules, capacity, and transparent pricing on every detail page.' },
  { title: 'Request a slot', desc: 'Pick date & time, add headcount, and send — the owner reviews next.' },
];

export function HomeHowItWorksTeaser() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <header className="max-w-md">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">From browse to booking</h2>
            <p className="mt-3 text-muted">
              No guesswork: you always know what you&apos;re requesting, and owners keep calendars conflict-aware.
            </p>
            <Link
              to="/how-it-works"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Read the full playbook <span aria-hidden>→</span>
            </Link>
          </header>
          <ol className="grid flex-1 gap-6 sm:grid-cols-3">
            {MINI_STEPS.map((step, idx) => (
              <li key={step.title} className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function HomePopularCities({ cities }) {
  if (!cities?.length) return null;

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">Popular cities</h2>
        <p className="mt-1 text-sm text-muted">Tap a city to instantly filter the catalogue below.</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {cities.slice(0, 12).map((c) => (
            <li key={c.city}>
              <Link
                to={`/?city=${encodeURIComponent(c.city)}#venues`}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
              >
                {c.city}
                <span className="ml-2 text-xs text-muted">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeBottomCtas() {
  return (
    <section className="border-t border-slate-200">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <article className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white lg:min-h-[220px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Organisers</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Ready when you are</h2>
            <p className="mt-2 text-sm text-slate-300">
              Create an account to save favourites, send requests faster, and track replies in My Bookings.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </article>
        <article className="flex flex-col justify-between rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-8 lg:min-h-[220px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Venue operators</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-950">List your ground or hall</h2>
            <p className="mt-2 text-sm text-muted">
              Owner tools for photos, weekly hours, blackout dates, pricing, and booking oversight — all in one panel.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Owner login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Register as venue manager
            </Link>
          </div>
        </article>
      </div>
      <footer className="border-t border-slate-100 bg-brand-950 py-6 text-center text-xs text-brand-200">
        <Link to="/sports-events" className="font-medium text-brand-100 underline-offset-2 hover:text-white hover:underline">
          Inspiration: sports & outdoor events playbook
        </Link>
      </footer>
    </section>
  );
}
