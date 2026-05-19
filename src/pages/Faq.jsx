import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Is OpenArena only for metropolitan cities?',
    answer:
      'No. Any steward with an approved venue profile can participate. Density of listings depends on how many operators onboard in each geography.',
  },
  {
    question: 'Do users pay instantly on the platform?',
    answer:
      'The default workflow issues booking requests owners review manually. Settlement logic can extend to integrated payments—consult your rollout plan with the administering team.',
  },
  {
    question: 'How do owners approve or deny requests?',
    answer:
      'Operators sign in to dedicated dashboards listing pending matches, attendee counts, conflicts, and internal notes prior to approving, rejecting, or requesting changes.',
  },
  {
    question: 'What prevents double bookings?',
    answer:
      'Slot generation respects weekly schedules, blackout windows, active locks, and existing confirmed bookings—conflicts bubble up before confirmations finalise.',
  },
  {
    question: 'Can we brand the experience for municipalities?',
    answer:
      'Deployments can wrap OpenArena beneath programme-specific landing experiences. Reach the programme inbox on the Contact page with governance requirements.',
  },
  {
    question: 'Who can create venue operator accounts?',
    answer:
      'Administrators provision owner roles to maintain catalogue integrity. Casual players never receive operator credentials without oversight.',
  },
];

export default function Faq() {
  return (
    <article className="bg-white">
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">FAQ</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink">Answers organisers ask before committing.</h1>
          <p className="mt-4 text-muted">
            Still deciding? Combine this page with{' '}
            <Link to="/how-it-works" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
              How it works
            </Link>{' '}
            for sequential detail.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <dl className="divide-y divide-slate-200">
          {faqs.map((item) => (
            <div key={item.question} className="py-8">
              <dt className="font-display text-lg font-semibold text-ink">{item.question}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-surface p-6 text-center shadow-sm">
          <p className="text-sm text-muted">
            Need something customised? Email or route through{' '}
            <Link to="/contact" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
              Contact
            </Link>{' '}
            so routing metadata stays organised.
          </p>
        </div>
      </section>
    </article>
  );
}
