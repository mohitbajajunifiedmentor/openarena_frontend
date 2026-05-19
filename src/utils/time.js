export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

/** Today's calendar date in the user's local timezone (YYYY-MM-DD). */
export function getLocalDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatTime12(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export const DAY_STATUS_STYLES = {
  available: 'bg-emerald-500 text-white',
  partial: 'bg-amber-400 text-amber-950',
  full: 'bg-red-500 text-white',
  blocked: 'bg-slate-300 text-slate-600',
};

export const SLOT_STATUS_STYLES = {
  available: 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  booked: 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed line-through',
  locked: 'border-amber-200 bg-amber-50 text-amber-600 cursor-not-allowed',
  past: 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed',
};
