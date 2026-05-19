import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

export default function GroundFilters({ filters, onChange, onSearch, amenities, sports, events }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 font-display text-lg font-semibold">Search & filter</h2>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="City / location" value={filters.city} onChange={(e) => set('city', e.target.value)} placeholder="Mumbai" />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Ground type</span>
          <select
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            value={filters.groundType}
            onChange={(e) => set('groundType', e.target.value)}
          >
            <option value="">All</option>
            <option value="sports">Sports</option>
            <option value="event">Event</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
        <Input label="Min area" type="number" value={filters.minArea} onChange={(e) => set('minArea', e.target.value)} />
        <Input label="Min capacity" type="number" value={filters.minCapacity} onChange={(e) => set('minCapacity', e.target.value)} />
        <Input label="Max people" type="number" value={filters.maxPeople} onChange={(e) => set('maxPeople', e.target.value)} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Sports type</span>
          <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" value={filters.sportsType} onChange={(e) => set('sportsType', e.target.value)}>
            <option value="">Any</option>
            {sports?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Event type</span>
          <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" value={filters.eventType} onChange={(e) => set('eventType', e.target.value)}>
            <option value="">Any</option>
            {events?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Amenities</span>
          <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" value={filters.amenities} onChange={(e) => set('amenities', e.target.value)}>
            <option value="">Any</option>
            {amenities?.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </label>
      </section>
      <section className="mt-4 flex justify-end">
        <Button onClick={onSearch}>Apply filters</Button>
      </section>
    </section>
  );
}
