import { formatCurrency } from '../../utils/format.js';
import { formatTime12 } from '../../utils/time.js';
import Button from '../ui/Button.jsx';

export default function BookingSummary({
  ground,
  date,
  startTime,
  endTime,
  slotType,
  totalPrice,
  lockExpiresAt,
  loading,
  error,
  onConfirm,
}) {
  const secondsLeft = lockExpiresAt
    ? Math.max(0, Math.floor((new Date(lockExpiresAt) - Date.now()) / 1000))
    : 0;

  return (
    <section className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <h3 className="font-display text-lg font-semibold">Booking summary</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <section className="flex justify-between"><dt className="text-muted">Ground</dt><dd className="font-medium">{ground?.name}</dd></section>
        <section className="flex justify-between"><dt className="text-muted">Area</dt><dd>{ground?.area} {ground?.areaUnit}</dd></section>
        <section className="flex justify-between"><dt className="text-muted">Capacity</dt><dd>{ground?.capacity} people</dd></section>
        <section className="flex justify-between"><dt className="text-muted">Date</dt><dd>{date}</dd></section>
        {startTime && endTime && (
          <section className="flex justify-between"><dt className="text-muted">Time</dt><dd>{formatTime12(startTime)} – {formatTime12(endTime)}</dd></section>
        )}
        <section className="flex justify-between"><dt className="text-muted">Type</dt><dd className="capitalize">{slotType?.replace('_', ' ')}</dd></section>
        <section className="flex justify-between border-t pt-2 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-brand-700">{formatCurrency(totalPrice)}</dd></section>
      </dl>
      {lockExpiresAt && secondsLeft > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Slot held for <strong>{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</strong> — complete booking before it expires.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-4 w-full" onClick={onConfirm} disabled={loading || !date}>
        {loading ? 'Processing...' : 'Submit booking request'}
      </Button>
      <p className="mt-2 text-center text-xs text-muted">Owner or admin will approve your request</p>
    </section>
  );
}
