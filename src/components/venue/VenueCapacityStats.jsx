export default function VenueCapacityStats({ ground }) {
  const ed = ground.eventDetails || {};
  const sd = ground.sportsDetails || {};

  if (ground.groundType === 'event') {
    return (
      <section className="grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {ed.seatedCapacity != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Seated</p>
            <p className="text-2xl font-bold">{ed.seatedCapacity}</p>
          </article>
        )}
        {ed.standingCapacity != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Standing</p>
            <p className="text-2xl font-bold">{ed.standingCapacity}</p>
          </article>
        )}
        {ed.minGuests != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Minimum guests</p>
            <p className="text-2xl font-bold">{ed.minGuests}</p>
          </article>
        )}
        {ed.rooms != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Rooms / halls</p>
            <p className="text-2xl font-bold">{ed.rooms}</p>
          </article>
        )}
        {ed.washrooms != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Washrooms</p>
            <p className="text-2xl font-bold">{ed.washrooms}</p>
          </article>
        )}
        {ed.dressingRooms != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Dressing rooms</p>
            <p className="text-2xl font-bold">{ed.dressingRooms}</p>
          </article>
        )}
        {ed.parkingSpaces != null && (
          <article>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Parking</p>
            <p className="text-2xl font-bold">{ed.parkingSpaces} cars</p>
          </article>
        )}
      </section>
    );
  }

  return (
    <section className="grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2 lg:grid-cols-4">
      <article>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Max players</p>
        <p className="text-2xl font-bold">{ground.capacity}</p>
      </article>
      <article>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Playing hours</p>
        <p className="text-2xl font-bold">
          {ground.openingTime || '06:00'} – {ground.closingTime || '22:00'}
        </p>
      </article>
      {sd.surfaceType && (
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Surface</p>
          <p className="text-2xl font-bold">{sd.surfaceType}</p>
        </article>
      )}
      {sd.sportsAllowed && (
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sports</p>
          <p className="text-lg font-bold">{sd.sportsAllowed}</p>
        </article>
      )}
      {sd.peakHoursStart && sd.peakHoursEnd && (
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Peak hours</p>
          <p className="text-2xl font-bold">
            {sd.peakHoursStart} – {sd.peakHoursEnd}
          </p>
        </article>
      )}
      {ground.groundType === 'mixed' && ed.washrooms != null && (
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Washrooms</p>
          <p className="text-2xl font-bold">{ed.washrooms}</p>
        </article>
      )}
    </section>
  );
}
