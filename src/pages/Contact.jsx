import { useState } from 'react';
import { Link } from 'react-router-dom';

/** Replace with your production contact email when configuring the deployment. */
const SUPPORT_EMAIL = 'support@example.com';

function MailIcon() {
  return (
    <svg className="h-6 w-6 text-brand-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}

const channels = [
  {
    title: 'Guest & organiser enquiries',
    description:
      'Questions about bookings, availability, cancellations, or how to register for an organisation account.',
    action: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('OpenArena enquiry')}`,
    cta: 'Email support',
  },
  {
    title: 'Venue partnerships',
    description: 'Rolling out turf, arenas, lawns, or mixed-use estates? Discuss onboarding timelines and integrations.',
    action: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('OpenArena venue partnership')}`,
    cta: 'Partnership inbox',
  },
  {
    title: 'Administrative programmes',
    description: 'District sports boards, institutes, or franchise networks needing deployment guidance.',
    action: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('OpenArena programme deployment')}`,
    cta: 'Programme desk',
  },
];

export default function Contact() {
  const [notice, setNotice] = useState('');

  return (
    <article className="bg-white">
      <section className="border-b border-slate-200 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">We respond with context, not canned scripts.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Choose the inbox that mirrors your stakeholder role. Operational responses are routed to the Unified Mentor × Eventup.com
            implementation team administering this deployment—swap the placeholder email in code when moving to production.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {channels.map((c) => (
            <article key={c.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <MailIcon />
              </div>
              <h2 className="mt-6 font-display text-xl font-semibold text-ink">{c.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>
              <p className="mt-4 font-mono text-xs text-brand-800">{c.action}</p>
              <a
                href={c.href}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {c.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-10 rounded-3xl border border-brand-100 bg-brand-50/60 p-8 lg:grid-cols-[1fr_1fr] lg:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-950">Prefer to draft in your client?</h2>
            <p className="mt-3 text-sm text-muted">
              Copy the inbox address once and share it internally. For sensitive attachments, encrypt email per your organisational policy—we
              do not ingest documents through anonymous web uploads yet.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-brand-700">Support email</p>
              <p className="mt-2 font-mono text-sm">{SUPPORT_EMAIL}</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(SUPPORT_EMAIL);
                    setNotice('Address copied.');
                    setTimeout(() => setNotice(''), 2500);
                  } catch {
                    setNotice('Select and copy manually.');
                  }
                }}
              >
                Copy to clipboard
              </button>
              {notice && <p className="mt-2 text-xs font-medium text-brand-900">{notice}</p>}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted">
          Looking for tactical answers first?{' '}
          <Link to="/faq" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Visit FAQ
          </Link>
          {' · '}
          <Link to="/about" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            About OpenArena
          </Link>
        </p>
      </section>
    </article>
  );
}
