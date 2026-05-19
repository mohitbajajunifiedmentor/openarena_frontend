import { SLOT_STATUS_STYLES, formatTime12 } from '../../utils/time.js';

export default function TimeSlotPicker({ slots, selectedStart, selectedEnd, onSelectRange, slotType, onSlotTypeChange }) {
  return (
    <section className="space-y-4">
      <section className="flex flex-wrap gap-2">
        {[
          { id: 'hourly', label: 'Hourly' },
          { id: 'half_day', label: 'Half day' },
          { id: 'full_day', label: 'Full day' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSlotTypeChange(t.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              slotType === t.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </section>

      {slotType === 'half_day' && (
        <section className="flex gap-2">
          <button type="button" onClick={() => onSelectRange('morning', null)} className="flex-1 rounded-xl border border-brand-200 bg-brand-50 py-2 text-sm font-medium">
            Morning half
          </button>
          <button type="button" onClick={() => onSelectRange('afternoon', null)} className="flex-1 rounded-xl border border-brand-200 bg-brand-50 py-2 text-sm font-medium">
            Afternoon half
          </button>
        </section>
      )}

      {slotType === 'hourly' && (
        <section className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {slots?.map((slot) => {
            const selected = selectedStart === slot.startTime && selectedEnd === slot.endTime;
            const disabled = slot.status !== 'available';
            return (
              <button
                key={`${slot.startTime}-${slot.endTime}`}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelectRange(slot.startTime, slot.endTime)}
                className={`rounded-xl border px-2 py-2 text-xs font-medium ${SLOT_STATUS_STYLES[slot.status]} ${
                  selected ? '!ring-2 !ring-brand-600' : ''
                }`}
              >
                {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
              </button>
            );
          })}
        </section>
      )}

      {slotType === 'full_day' && (
        <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-800">Full day uses opening – closing hours for the selected date.</p>
      )}
    </section>
  );
}
