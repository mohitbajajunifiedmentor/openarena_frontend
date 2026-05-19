import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogApi, ownerApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import ImageUpload from '../../components/ui/ImageUpload.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { getCategoryImage } from '../../utils/images.js';

const empty = {
  name: '',
  tagline: '',
  description: '',
  tags: '',
  groundType: 'sports',
  boundarySize: '',
  area: '',
  areaUnit: 'sqft',
  capacity: '',
  openingTime: '06:00',
  closingTime: '22:00',
  location: { address: '', city: '', state: '', pincode: '' },
  rules: '',
  photos: [],
  amenities: [],
  supportedSports: [],
  supportedEvents: [],
  pricing: { hourly: '', daily: '', eventBased: '' },
  eventDetails: {
    seatedCapacity: '',
    standingCapacity: '',
    minGuests: '',
    rooms: '',
    washrooms: '',
    dressingRooms: '',
    parkingSpaces: '',
    cateringAvailable: false,
  },
  sportsDetails: {
    surfaceType: '',
    sportsAllowed: '',
    peakHoursStart: '',
    peakHoursEnd: '',
    advanceBookingDays: '',
    equipmentIncluded: '',
  },
};

export default function OwnerGroundForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [amenities, setAmenities] = useState([]);
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([catalogApi.amenities(), catalogApi.categories('sports'), catalogApi.categories('event')]).then(([a, s, e]) => {
      setAmenities(a.data); setSports(s.data); setEvents(e.data);
    });
    if (isEdit) {
      ownerApi.grounds().then((r) => {
        const g = r.data.find((x) => x._id === id);
        if (g) setForm({
          ...empty,
          ...g,
          tags: g.tags?.join(', ') ?? '',
          area: g.area ?? '',
          capacity: g.capacity ?? '',
          photos: g.photos ?? [],
          amenities: g.amenities?.map((a) => a._id || a) ?? [],
          supportedSports: g.supportedSports?.map((c) => c._id || c) ?? [],
          supportedEvents: g.supportedEvents?.map((c) => c._id || c) ?? [],
          eventDetails: { ...empty.eventDetails, ...g.eventDetails },
          sportsDetails: { ...empty.sportsDetails, ...g.sportsDetails },
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const toggleArr = (key, val) => {
    const arr = form[key].includes(val) ? form[key].filter((x) => x !== val) : [...form[key], val];
    setForm({ ...form, [key]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const num = (v) => (v === '' || v == null ? undefined : Number(v));
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      area: Number(form.area),
      capacity: Number(form.capacity),
      photos: form.photos || [],
      pricing: {
        hourly: num(form.pricing.hourly),
        daily: num(form.pricing.daily),
        eventBased: num(form.pricing.eventBased),
      },
      eventDetails: {
        seatedCapacity: num(form.eventDetails.seatedCapacity),
        standingCapacity: num(form.eventDetails.standingCapacity),
        minGuests: num(form.eventDetails.minGuests),
        rooms: num(form.eventDetails.rooms),
        washrooms: num(form.eventDetails.washrooms),
        dressingRooms: num(form.eventDetails.dressingRooms),
        parkingSpaces: num(form.eventDetails.parkingSpaces),
        cateringAvailable: Boolean(form.eventDetails.cateringAvailable),
      },
      sportsDetails: {
        surfaceType: form.sportsDetails.surfaceType || undefined,
        sportsAllowed: form.sportsDetails.sportsAllowed || undefined,
        peakHoursStart: form.sportsDetails.peakHoursStart || undefined,
        peakHoursEnd: form.sportsDetails.peakHoursEnd || undefined,
        advanceBookingDays: num(form.sportsDetails.advanceBookingDays),
        equipmentIncluded: form.sportsDetails.equipmentIncluded || undefined,
      },
    };
    try {
      if (isEdit) await ownerApi.updateGround(id, payload);
      else await ownerApi.createGround(payload);
      navigate('/owner/grounds');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{isEdit ? 'Edit ground' : 'Add ground'}</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <ImageUpload label="Ground photos — upload multiple angles (front, side, aerial)" multiple value={form.photos} onChange={(photos) => setForm({ ...form, photos })} max={8} />
        <Input label="Venue name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short pitch for the card" />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Full description</span>
          <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Wedding, Garden, Parking" />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Listing type</span>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.groundType || 'sports'}
            onChange={(e) => setForm({ ...form, groundType: e.target.value })}
          >
            <option value="sports">Sports ground</option>
            <option value="event">Event venue</option>
            <option value="mixed">Sports & events (mixed)</option>
          </select>
        </label>
        {(form.groundType === 'event' || form.groundType === 'mixed') && (
          <fieldset className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 space-y-3">
            <legend className="text-sm font-semibold text-rose-900">Event venue details</legend>
            <section className="grid gap-3 sm:grid-cols-2">
              <Input label="Seated capacity" type="number" value={form.eventDetails.seatedCapacity} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, seatedCapacity: e.target.value } })} />
              <Input label="Standing capacity" type="number" value={form.eventDetails.standingCapacity} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, standingCapacity: e.target.value } })} />
              <Input label="Minimum guests" type="number" value={form.eventDetails.minGuests} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, minGuests: e.target.value } })} />
              <Input label="Rooms / halls" type="number" value={form.eventDetails.rooms} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, rooms: e.target.value } })} />
              <Input label="Washrooms" type="number" value={form.eventDetails.washrooms} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, washrooms: e.target.value } })} />
              <Input label="Dressing rooms" type="number" value={form.eventDetails.dressingRooms} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, dressingRooms: e.target.value } })} />
              <Input label="Parking spaces" type="number" value={form.eventDetails.parkingSpaces} onChange={(e) => setForm({ ...form, eventDetails: { ...form.eventDetails, parkingSpaces: e.target.value } })} />
            </section>
          </fieldset>
        )}
        {(form.groundType === 'sports' || form.groundType === 'mixed') && (
          <fieldset className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 space-y-3">
            <legend className="text-sm font-semibold text-brand-900">Sports ground details</legend>
            <section className="grid gap-3 sm:grid-cols-2">
              <Input label="Surface type" value={form.sportsDetails.surfaceType} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, surfaceType: e.target.value } })} placeholder="Grass, Turf" />
              <Input label="Sports allowed" value={form.sportsDetails.sportsAllowed} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, sportsAllowed: e.target.value } })} />
              <Input label="Peak hours start" value={form.sportsDetails.peakHoursStart} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, peakHoursStart: e.target.value } })} placeholder="17:00" />
              <Input label="Peak hours end" value={form.sportsDetails.peakHoursEnd} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, peakHoursEnd: e.target.value } })} />
              <Input label="Advance booking (days)" type="number" value={form.sportsDetails.advanceBookingDays} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, advanceBookingDays: e.target.value } })} />
              <Input label="Equipment included" value={form.sportsDetails.equipmentIncluded} onChange={(e) => setForm({ ...form, sportsDetails: { ...form.sportsDetails, equipmentIncluded: e.target.value } })} />
            </section>
            <section className="grid gap-3 sm:grid-cols-2">
              <Input label="Opens at" value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })} />
              <Input label="Closes at" value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })} />
            </section>
          </fieldset>
        )}
        <Input label="Address" required value={form.location.address} onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })} />
        <section className="grid gap-4 sm:grid-cols-2">
          <Input label="City" required value={form.location.city} onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} />
          <Input label="Pincode" value={form.location.pincode} onChange={(e) => setForm({ ...form, location: { ...form.location, pincode: e.target.value } })} />
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <Input label="Area" type="number" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Unit</span>
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.areaUnit} onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}>
              <option value="sqft">sq.ft</option>
              <option value="acres">acres</option>
            </select>
          </label>
          <Input label="Capacity" type="number" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </section>
        <Input label="Boundary size" value={form.boundarySize} onChange={(e) => setForm({ ...form, boundarySize: e.target.value })} />
        <Input label="Rules" value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
        <fieldset>
          <legend className="text-sm font-medium">Amenities</legend>
          <section className="mt-2 flex flex-wrap gap-2">
            {amenities.map((a) => (
              <label key={a._id} className="flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-sm">
                <input type="checkbox" checked={form.amenities.includes(a._id)} onChange={() => toggleArr('amenities', a._id)} />
                {a.name}
              </label>
            ))}
          </section>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Supported sports</legend>
          <section className="mt-2 grid gap-2 sm:grid-cols-2">
            {sports.map((c) => (
              <label key={c._id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 ${form.supportedSports.includes(c._id) ? 'border-brand-500 bg-brand-50' : ''}`}>
                <img src={getCategoryImage(c)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <input type="checkbox" className="sr-only" checked={form.supportedSports.includes(c._id)} onChange={() => toggleArr('supportedSports', c._id)} />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </section>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Supported events</legend>
          <section className="mt-2 grid gap-2 sm:grid-cols-2">
            {events.map((c) => (
              <label key={c._id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 ${form.supportedEvents.includes(c._id) ? 'border-brand-500 bg-brand-50' : ''}`}>
                <img src={getCategoryImage(c)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <input type="checkbox" className="sr-only" checked={form.supportedEvents.includes(c._id)} onChange={() => toggleArr('supportedEvents', c._id)} />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </section>
        </fieldset>
        <section className="grid gap-4 sm:grid-cols-3">
          <Input label="Hourly price (₹)" type="number" value={form.pricing.hourly} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, hourly: e.target.value } })} />
          <Input label="Daily price (₹)" type="number" value={form.pricing.daily} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, daily: e.target.value } })} />
          <Input label="Event price (₹)" type="number" value={form.pricing.eventBased} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, eventBased: e.target.value } })} />
        </section>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">{isEdit ? 'Save changes' : 'Submit for approval'}</Button>
      </form>
    </section>
  );
}
