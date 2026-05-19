import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ownerApi } from '../../api/services.js';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { STATUS_COLORS, formatDate, formatCurrency } from '../../utils/format.js';
import { formatTime12 } from '../../utils/time.js';

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [responding, setResponding] = useState({});
  const [respondModal, setRespondModal] = useState({ open: false, bookingId: null, status: null, note: '' });

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter !== 'all') params.status = filter;

    ownerApi.bookings(params)
      .then((r) => setBookings(r.data))
      .catch((err) => console.error('Error loading bookings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.ground?.name?.toLowerCase().includes(term) ||
      b.user?.name?.toLowerCase().includes(term) ||
      b.user?.email?.toLowerCase().includes(term)
    );
  });

  const handleRespond = async (bookingId, status, note = '') => {
    setResponding((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await ownerApi.respondBooking(bookingId, { status, ownerNote: note });
      setRespondModal({ open: false, bookingId: null, status: null, note: '' });
      load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setResponding((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
  };

  const revenue = bookings
    .filter((b) => b.status === 'approved')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Booking Requests</h1>
        <p className="text-muted">Review and manage booking requests for your grounds</p>
      </header>

      {/* Statistics Cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article className="rounded-2xl border bg-white p-5">
          <p className="text-xs text-muted">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
        </article>
        <article className="rounded-2xl border bg-amber-50 p-5">
          <p className="text-xs text-amber-800">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{stats.pending}</p>
        </article>
        <article className="rounded-2xl border bg-emerald-50 p-5">
          <p className="text-xs text-emerald-800">Approved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">{stats.approved}</p>
        </article>
        <article className="rounded-2xl border bg-red-50 p-5">
          <p className="text-xs text-red-800">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-900">{stats.rejected}</p>
        </article>
        <article className="rounded-2xl border bg-brand-50 p-5">
          <p className="text-xs text-brand-800">Revenue (Approved)</p>
          <p className="mt-1 text-lg font-bold text-brand-900">{formatCurrency(revenue)}</p>
        </article>
      </section>

      {/* Filters & Search */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder="Search by ground name or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </section>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-slate-50 p-8 text-center">
          <p className="text-muted">No bookings found. Once users book your grounds, they'll appear here.</p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredBookings.map((b) => (
            <article
              key={b._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <section className="flex-1">
                  <h3 className="font-semibold text-lg">{b.ground?.name}</h3>
                  <p className="text-sm text-muted">{b.user?.name} ({b.user?.email})</p>
                  <p className="mt-2 text-sm">
                    <strong>Date:</strong> {formatDate(b.date || b.bookingDate)}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {formatTime12(b.startTime)} – {formatTime12(b.endTime)} ({b.slotType?.replace('_', ' ')})
                  </p>
                  <p className="mt-2 text-sm">
                    <strong>Type:</strong> <span className="capitalize">{b.bookingType}</span>
                    <span className="ml-3">
                      <strong>People:</strong> {b.numberOfPeople}
                    </span>
                  </p>
                  <p className="mt-2 text-base font-bold text-brand-700">{formatCurrency(b.totalPrice)}</p>
                  {b.userNote && (
                    <p className="mt-3 rounded-lg bg-slate-50 p-2 text-sm italic">
                      <strong>User Note:</strong> {b.userNote}
                    </p>
                  )}
                </section>

                <section className="flex flex-col items-end gap-3 sm:items-start">
                  <Badge className={STATUS_COLORS[b.status]}>{b.status}</Badge>

                  {b.status === 'pending' && (
                    <section className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() =>
                          setRespondModal({
                            open: true,
                            bookingId: b._id,
                            status: 'approved',
                            note: '',
                          })
                        }
                        disabled={responding[b._id]}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setRespondModal({
                            open: true,
                            bookingId: b._id,
                            status: 'rejected',
                            note: '',
                          })
                        }
                        disabled={responding[b._id]}
                        className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
                      >
                        Reject
                      </button>
                    </section>
                  )}

                  <Link
                    to={`/bookings/${b._id}`}
                    className="text-sm font-semibold text-brand-600 underline-offset-2 hover:text-brand-800 hover:underline"
                  >
                    View details →
                  </Link>
                </section>
              </section>
            </article>
          ))}
        </section>
      )}

      {/* Respond Modal */}
      {respondModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-bold mb-4">
              {respondModal.status === 'approved' ? 'Approve Booking' : 'Reject Booking'}
            </h2>
            <label className="block space-y-2 mb-6 text-sm">
              <span className="font-medium">Note (optional)</span>
              <textarea
                className="w-full rounded-xl border px-3 py-2 text-sm resize-none"
                rows="4"
                placeholder={
                  respondModal.status === 'approved'
                    ? 'e.g., Approved! Please arrange the ground setup.'
                    : 'e.g., Sorry, the ground is not available on this date.'
                }
                value={respondModal.note}
                onChange={(e) =>
                  setRespondModal((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </label>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() =>
                  setRespondModal({
                    open: false,
                    bookingId: null,
                    status: null,
                    note: '',
                  })
                }
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleRespond(
                    respondModal.bookingId,
                    respondModal.status,
                    respondModal.note
                  )
                }
                disabled={responding[respondModal.bookingId]}
                className={`flex-1 ${
                  respondModal.status === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700'
                    : ''
                }`}
              >
                {responding[respondModal.bookingId]
                  ? 'Processing...'
                  : respondModal.status === 'approved'
                  ? 'Approve'
                  : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
