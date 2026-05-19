const steps = [
  { n: '1', title: 'Visit & search', desc: 'Browse grounds and apply filters by area, capacity, type, and amenities.' },
  { n: '2', title: 'View details', desc: 'See photos, rules, pricing, supported sports and events.' },
  { n: '3', title: 'Book a slot', desc: 'Pick date, time, number of people, and send a booking request.' },
  { n: '4', title: 'Owner approval', desc: 'The land owner approves or rejects your request.' },
  { n: '5', title: 'Confirmation', desc: 'Track status in My Bookings — conflict-free scheduling.' },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold">How it works</h1>
      <p className="mt-2 text-muted">User flow from the OpenArena platform requirements</p>
      <ol className="mt-10 space-y-6">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-bold text-white">
              {s.n}
            </span>
            <section>
              <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-1 text-muted">{s.desc}</p>
            </section>
          </li>
        ))}
      </ol>
    </section>
  );
}
