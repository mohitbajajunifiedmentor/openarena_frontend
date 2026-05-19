import { Link } from 'react-router-dom';

const pillars = [
  {
    title: 'Clarity before commitment',
    body: 'Structured profiles, imagery, schedules, capacity, and indicative pricing reduce back-and-forth before anyone sends a booking request.',
  },
  {
    title: 'Calendars without collisions',
    body: 'Slot-level awareness helps prevent double bookings for owners while giving players and organisers predictable availability.',
  },
  {
    title: 'Separate roles, single product',
    body: 'Public discovery for guests, self-serve dashboards for verified venue operators, and guardrails administrators expect on a mature marketplace.',
  },
];

const audiences = [
  {
    headline: 'Players & event hosts',
    copy: 'Search by city and venue type, compare amenities, inspect photos, then share headcount and notes in a structured request.',
    icon: '🎟️',
  },
  {
    headline: 'Ground & venue operators',
    copy: 'Publish weekly hours, block dates for maintenance, tailor pricing tiers, and triage approvals from one operational workspace.',
    icon: '🏟️',
  },
  {
    headline: 'Program administrators',
    copy: 'Onboard credible operators, oversee catalog quality, and keep the broader network aligned with organisational standards.',
    icon: '⚙️',
  },
];

export default function About() {
  return (
    <article className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">About OpenArena</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.25rem]">
            Venue discovery and bookings, orchestrated end to end.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100">
            OpenArena is a unified web platform that connects organisers with audited sports grounds and curated event venues. We align
            what guests see publicly with how operators maintain inventory behind the scenes.
          </p>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-wide text-brand-100">Partnership lineage</dt>
              <dd className="mt-3 text-sm leading-relaxed text-white">
                Conceived collaboratively by <strong>Unified Mentor</strong> and <strong>Eventup.com</strong>, combining programme leadership
                with market-ready experience design.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-wide text-brand-100">Channels</dt>
              <dd className="mt-3 text-sm leading-relaxed text-white">
                Responsive web for desktop & mobile-first discovery, optimised for organisers who coordinate on behalf of leagues, schools,
                and experiential brands.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <dt className="text-xs uppercase tracking-wide text-brand-100">Governance</dt>
              <dd className="mt-3 text-sm leading-relaxed text-white">
                New owner accounts provision through administrators, ensuring credible listings before they reach the marketplace.
              </dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/#venues"
              className="inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-950 shadow hover:bg-brand-50"
            >
              Browse catalogue
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-xl border border-white/35 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Why the platform exists</h2>
            <p className="mt-4 text-muted">
              Lands that host grassroots sport or community events are fragmented across chats, spreadsheets, and personal networks.
              Operators lose leverage; organisers lose certainty. OpenArena anchors both sides inside a repeatable workflow—from first
              impression to validated booking proposals.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-surface p-8 shadow-sm">
            <h3 className="font-display text-xl font-semibold text-ink">Mission</h3>
            <p className="mt-3 text-muted">
              Make credible venue information instantaneous and slot coordination trustworthy for every stakeholder in the lifecycle.
            </p>
            <h3 className="mt-8 font-display text-xl font-semibold text-ink">Vision</h3>
            <p className="mt-3 text-muted">
              Become the reference operating layer for programmable open spaces—from tournament weekends to marquee cultural programming.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-3xl font-bold text-ink">Product principles</h2>
          <p className="mt-3 max-w-2xl text-muted">
            These guardrails steer every roadmap conversation—from onboarding copy to reconciliation tooling.
          </p>
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {pillars.map((p) => (
              <li key={p.title} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
                <p className="font-display text-lg font-semibold text-ink">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold text-ink">Who benefits</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.headline} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-2xl" aria-hidden>
                {a.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{a.headline}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-brand-950 py-14 text-brand-50 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Ready when your calendar is.</h2>
            <p className="mt-3 text-sm text-brand-100">
              Need platform documentation, onboarding support, or a walkthrough tailored to municipality-scale programmes?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/how-it-works"
              className="inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50"
            >
              How it works
            </Link>
            <Link to="/faq" className="inline-flex rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Read FAQ
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
