import { DAY_STATUS_STYLES, getLocalDateKey } from '../../utils/time.js';

const LEGEND = [
  { key: 'available', label: 'Available' },
  { key: 'partial', label: 'Partial' },
  { key: 'past', label: 'Past' },
  { key: 'hidden', label: 'Unavailable' },
];

export default function BookingCalendar({
  year,
  month,
  days,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  loading,
}) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthLabel = new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const todayKey = getLocalDateKey();

  const dayMap = Object.fromEntries((days || []).map((d) => [d.date, d]));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, key, info: dayMap[key] });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrevMonth} className="rounded-lg px-2 py-1 text-sm hover:bg-slate-100">←</button>
        <h3 className="font-display font-semibold">{monthLabel}</h3>
        <button type="button" onClick={onNextMonth} className="rounded-lg px-2 py-1 text-sm hover:bg-slate-100">→</button>
      </header>

      <section className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </section>

      {loading ? (
        <section className="grid h-48 animate-pulse grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <section key={i} className="rounded-lg bg-slate-100" />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <span key={`e-${i}`} />;
            const isPastDay = cell.key < todayKey;
            if (isPastDay) {
              return (
                <span
                  key={cell.key}
                  className="flex h-10 cursor-not-allowed select-none items-center justify-center rounded-lg border border-transparent bg-slate-50 text-sm font-medium text-slate-400 opacity-70"
                  title="This date has passed"
                  aria-disabled="true"
                >
                  {cell.day}
                </span>
              );
            }

            const hidden =
              !cell.info || cell.info.status === 'blocked' || cell.info.status === 'full';
            if (hidden) {
              return <span key={cell.key} className="h-10 rounded-lg bg-slate-50" aria-hidden />;
            }
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => onSelectDate(cell.key)}
                className={`flex h-10 flex-col items-center justify-center rounded-lg text-sm font-medium transition ${
                  selectedDate === cell.key ? 'ring-2 ring-brand-600 ring-offset-1' : ''
                } ${DAY_STATUS_STYLES[cell.info?.status] || 'bg-slate-100 text-slate-500'}`}
              >
                {cell.day}
              </button>
            );
          })}
        </section>
      )}

      <section className="mt-4 flex flex-wrap gap-3 text-xs">
        {LEGEND.map((l) => (
          <span key={l.key} className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${
                l.key === 'hidden'
                  ? 'bg-slate-100'
                  : l.key === 'past'
                    ? 'bg-slate-200'
                    : DAY_STATUS_STYLES[l.key]?.split(' ')[0]
              }`}
            />
            {l.label}
          </span>
        ))}
      </section>
    </section>
  );
}
