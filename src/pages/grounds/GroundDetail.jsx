import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bookingsApi, catalogApi, groundsApi } from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BookingCalendar from '../../components/booking/BookingCalendar.jsx';
import TimeSlotPicker from '../../components/booking/TimeSlotPicker.jsx';
import PhotoGalleryModal from '../../components/venue/PhotoGalleryModal.jsx';
import VenueCapacityStats from '../../components/venue/VenueCapacityStats.jsx';
import VenueReviews from '../../components/venue/VenueReviews.jsx';
import StarRating from '../../components/venue/StarRating.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { formatCurrency } from '../../utils/format.js';
import { formatTime12, getLocalDateKey } from '../../utils/time.js';
import { getGroundImage, getGroundImageFallback } from '../../utils/images.js';
import SafeImage from '../../components/ui/SafeImage.jsx';

export default function GroundDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const [ground, setGround] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthDays, setMonthDays] = useState([]);
  const [daySlots, setDaySlots] = useState([]);
  const [calLoading, setCalLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [slotType, setSlotType] = useState('hourly');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [lockId, setLockId] = useState(null);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);

  const [bookingType, setBookingType] = useState('sports');
  const [category, setCategory] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(10);
  const [userNote, setUserNote] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([groundsApi.get(id), catalogApi.categories()])
      .then(([g, c]) => {
        setGround(g.data);
        setCategories(c.data);
        setNumberOfPeople(Math.min(10, g.data.capacity));
        setBookingType(g.data.groundType === 'event' ? 'event' : 'sports');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const loadMonth = useCallback(() => {
    setCalLoading(true);
    groundsApi
      .monthAvailability(id, calYear, calMonth)
      .then((r) => setMonthDays(r.data.days))
      .finally(() => setCalLoading(false));
  }, [id, calYear, calMonth]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const loadDaySlots = useCallback(
    (date) => {
      if (!date) return;
      setSlotsLoading(true);
      groundsApi
        .dayAvailability(id, date)
        .then((r) => setDaySlots(r.data.slots || []))
        .finally(() => setSlotsLoading(false));
    },
    [id]
  );

  useEffect(() => {
    if (selectedDate) loadDaySlots(selectedDate);
  }, [selectedDate, loadDaySlots]);

  useEffect(() => {
    const today = getLocalDateKey();
    if (!selectedDate || selectedDate >= today) return;
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
    setLockId(null);
    setLockExpiresAt(null);
  }, [selectedDate]);

  const refreshPriceAndLock = async (date, st, et, type) => {
    if (!date || !isAuthenticated) return;
    setError('');
    try {
      const lockRes = await bookingsApi.lock({
        groundId: id,
        date,
        slotType: type,
        startTime: type === 'hourly' ? st : type === 'half_day' ? st : undefined,
        endTime: type === 'hourly' ? et : undefined,
        numberOfPeople,
      });
      setLockId(lockRes.data.lockId);
      setLockExpiresAt(lockRes.data.expiresAt);
      setStartTime(lockRes.data.startTime);
      setEndTime(lockRes.data.endTime);
      setTotalPrice(lockRes.data.totalPrice);
    } catch (err) {
      setLockId(null);
      setLockExpiresAt(null);
      setError(err.message);
    }
  };

  const handleDateSelect = (date) => {
    if (date < getLocalDateKey()) return;
    setSelectedDate(date);
    setStartTime('');
    setEndTime('');
    setLockId(null);
    setLockExpiresAt(null);
    setError('');
  };

  const handleSlotSelect = (st, et) => {
    setStartTime(st);
    setEndTime(et);
    if (selectedDate) refreshPriceAndLock(selectedDate, st, et, slotType);
  };

  const handleSlotTypeChange = (type) => {
    setSlotType(type);
    setStartTime('');
    setEndTime('');
    setLockId(null);
    if (selectedDate && (type === 'full_day' || type === 'half_day')) {
      refreshPriceAndLock(selectedDate, type === 'half_day' ? 'morning' : undefined, undefined, type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: { pathname: `/grounds/${id}` } } });
    }
    if (!selectedDate || !category) {
      setError('Please select date, time, and event/sport type');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await bookingsApi.create({
        groundId: id,
        lockId,
        bookingType,
        category,
        numberOfPeople: Number(numberOfPeople),
        userNote: [userNote, phone && `Phone: ${phone}`].filter(Boolean).join('\n'),
        slotType,
        date: selectedDate,
        startTime,
        endTime,
      });
      setSuccess('Booking request sent! Owner will confirm shortly.');
      setLockId(null);
      loadMonth();
      loadDaySlots(selectedDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading venue..." />;
  if (!ground) return <p className="p-8 text-center text-red-600">Venue not found</p>;

  const photos = ground.photos?.length ? ground.photos : [getGroundImage(ground)];
  const filteredCats = categories.filter((c) => c.type === bookingType);
  const tags =
    ground.tags?.length > 0
      ? ground.tags
      : [
          ...(ground.amenities?.map((a) => a.name) || []),
          ground.groundType === 'event' ? 'Event Venue' : 'Sports Ground',
        ];
  const isEventVenue = ground.groundType === 'event';
  const basePrice = ground.pricing?.hourly || ground.pricing?.daily || ground.pricing?.eventBased;
  const secondsLeft = lockExpiresAt
    ? Math.max(0, Math.floor((new Date(lockExpiresAt) - Date.now()) / 1000))
    : 0;

  return (
    <article className="bg-slate-50 pb-16">
      <section className="relative h-[280px] w-full bg-slate-800 sm:h-[360px]">
        <SafeImage
          src={photos[0]}
          fallback={getGroundImageFallback(ground)}
          alt={ground.name}
          className="h-full w-full object-cover"
        />
        <section className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="absolute left-4 top-4 rounded border border-white/80 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow hover:bg-slate-50"
          >
            View photos
          </button>
        )}
        <Link to="/" className="absolute right-4 top-4 text-sm font-medium text-white hover:underline">
          ← Back to home
        </Link>
      </section>

      <PhotoGalleryModal photos={photos} open={galleryOpen} onClose={() => setGalleryOpen(false)} />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
        <section className="min-w-0 space-y-6">
          <header>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {isEventVenue ? 'Event venue' : 'Sports ground'} · {ground.location?.city}
            </p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
              <h1 className="font-display text-4xl font-bold text-ink">{ground.name}</h1>
              {basePrice != null && (
                <p className="shrink-0 text-xl font-bold text-brand-700 sm:text-2xl">
                  From {formatCurrency(basePrice)}
                  <span className="text-base font-semibold text-slate-600">
                    {isEventVenue ? ' / event' : ' / hour'}
                  </span>
                </p>
              )}
            </div>
            {ground.ratingAverage > 0 && (
              <div className="mt-3">
                <StarRating rating={ground.ratingAverage} reviewCount={ground.reviewCount} size="lg" />
              </div>
            )}
            {ground.tagline && <p className="mt-3 text-lg text-slate-700">{ground.tagline}</p>}
            <p className="mt-2 text-sm text-muted">
              {ground.location?.address}
              {ground.location?.state ? `, ${ground.location.state}` : ''}
            </p>
          </header>

          <p className="text-sm italic text-slate-600">{tags.join(' · ')}</p>

          <VenueCapacityStats ground={ground} />

          {ground.description ? (
            <section className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              {ground.description.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </section>
          ) : (
            <p className="text-sm text-slate-600">
              {ground.area} {ground.areaUnit} open space
              {ground.boundarySize ? ` · boundary ${ground.boundarySize}` : ''}.
              {ground.rules && <> Rules: {ground.rules}</>}
            </p>
          )}

          <section className="flex flex-wrap gap-2">
            {ground.amenities?.map((a) => (
              <span key={a._id} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-800 shadow-sm">
                {a.name}
              </span>
            ))}
          </section>

          <VenueReviews ground={ground} />
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white shadow-md"
          >
            <header className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
              <span className="text-lg" aria-hidden>
                📅
              </span>
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
                Request booking
              </h2>
            </header>

            <section className="space-y-4 p-5">
              <BookingCalendar
                year={calYear}
                month={calMonth}
                days={monthDays}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                onPrevMonth={() => {
                  if (calMonth === 1) {
                    setCalMonth(12);
                    setCalYear((y) => y - 1);
                  } else setCalMonth((m) => m - 1);
                }}
                onNextMonth={() => {
                  if (calMonth === 12) {
                    setCalMonth(1);
                    setCalYear((y) => y + 1);
                  } else setCalMonth((m) => m + 1);
                }}
                loading={calLoading}
              />

              {selectedDate && (
                <section className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted">Time — {selectedDate}</p>
                  {slotsLoading ? (
                    <p className="text-xs text-muted">Loading slots…</p>
                  ) : (
                    <TimeSlotPicker
                      slots={daySlots}
                      selectedStart={startTime}
                      selectedEnd={endTime}
                      slotType={slotType}
                      onSlotTypeChange={handleSlotTypeChange}
                      onSelectRange={handleSlotSelect}
                    />
                  )}
                </section>
              )}

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Type *</span>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={bookingType}
                  onChange={(e) => {
                    setBookingType(e.target.value);
                    setCategory('');
                  }}
                  disabled={ground.groundType === 'event' || ground.groundType === 'sports'}
                >
                  {ground.groundType !== 'event' && <option value="sports">Sports</option>}
                  {ground.groundType !== 'sports' && <option value="event">Event</option>}
                </select>
              </label>

              <label className="block space-y-1 text-sm">
                <span className="font-medium">{bookingType === 'event' ? 'Event type' : 'Sport'} *</span>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {filteredCats.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <Input
                label="Number of people *"
                type="number"
                min={ground.eventDetails?.minGuests || 1}
                max={ground.capacity}
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
              />

              <Input
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your contact number"
              />

              <label className="block space-y-1 text-sm">
                <span className="font-medium">Message</span>
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Tell us about your event or match…"
                />
              </label>

              {selectedDate && startTime && endTime && (
                <p className="text-sm text-slate-600">
                  {formatTime12(startTime)} – {formatTime12(endTime)} ·{' '}
                  <strong className="text-brand-700">{formatCurrency(totalPrice)}</strong>
                </p>
              )}

              {lockExpiresAt && secondsLeft > 0 && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Slot held {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                </p>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-brand-800">{success}</p>}

              <Button
                type="submit"
                className="w-full !bg-red-600 hover:!bg-red-700"
                disabled={submitting || !selectedDate}
              >
                {submitting ? 'Sending…' : isAuthenticated ? 'Send request' : 'Login to book'}
              </Button>
            </section>
          </form>
        </aside>
      </section>
    </article>
  );
}
