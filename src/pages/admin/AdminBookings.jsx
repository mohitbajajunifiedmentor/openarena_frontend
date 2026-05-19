import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services.js';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { STATUS_COLORS, formatDate, formatCurrency } from '../../utils/format.js';
import { formatTime12 } from '../../utils/time.js';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [responding, setResponding] = useState({});
  const [respondModal, setRespondModal] = useState({ open: false, bookingId: null, status: null, note: '' });

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter !== 'all') params.status = filter;
    params.sortBy = sortBy;

    adminApi.bookings(params)
      .then((r) => setBookings(r.data))
      .catch((err) => console.error('Error loading bookings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter, sortBy]);

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
      await adminApi.respondBooking(bookingId, { status, adminNote: note });
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
        <h1 className="font-display text-4xl font-bold">Bookings Management</h1>
        <p className="text-muted">Review, approve, and manage all platform bookings</p>
      </header>

      {/* Statistics Cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article className="rounded-2xl border bg-white p-5">
          <p className="text-xs text-muted">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold">{stats.total}</p>
        </article>
        <article className="rounded-2xl border bg-amber-50 p-5">
          <p className="text-xs text-amber-800">Pending Approval</p>
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
          <p className="text-xs text-brand-800">Total Revenue</p>
          <p className="mt-1 text-xl font-bold text-brand-900">{formatCurrency(revenue)}</p>
        </article>
      </section>

      {/* Filters & Search */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder="Search by ground name, user, or email..."
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
        <select
          className="rounded-xl border px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </section>

      {/* Bookings Table */}
      <section className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Ground</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Date & Time</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Price</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-center font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.ground?.name}</p>
                      <p className="text-xs text-muted">{b.ground?.location?.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.user?.name}</p>
                      <p className="text-xs text-muted">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p>{formatDate(b.date || b.bookingDate)}</p>
                      <p className="text-xs text-muted">{formatTime12(b.startTime)}–{formatTime12(b.endTime)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium capitalize">{b.bookingType}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={STATUS_COLORS[b.status]}>{b.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {b.status === 'pending' && (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setRespondModal({ open: true, bookingId: b._id, status: 'approved', note: '' })}
                              disabled={responding[b._id]}
                              type="button"
                              className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRespondModal({ open: true, bookingId: b._id, status: 'rejected', note: '' })}
                              disabled={responding[b._id]}
                              type="button"
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        <Link
                          to={`/bookings/${b._id}`}
                          className="text-xs font-semibold text-brand-600 underline-offset-2 hover:text-brand-800 hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Respond Modal */}
      {respondModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-bold mb-4">
              {respondModal.status === 'approved' ? 'Approve' : 'Reject'} Booking
            </h2>
            <label className="block space-y-2 mb-6 text-sm">
              <span className="font-medium">Note (optional)</span>
              <textarea
                className="w-full rounded-xl border px-3 py-2 text-sm resize-none"
                rows="4"
                placeholder={respondModal.status === 'approved' ? 'Approval note...' : 'Rejection reason...'}
                value={respondModal.note}
                onChange={(e) => setRespondModal((prev) => ({ ...prev, note: e.target.value }))}
              />
            </label>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setRespondModal({ open: false, bookingId: null, status: null, note: '' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleRespond(respondModal.bookingId, respondModal.status, respondModal.note)
                }
                disabled={responding[respondModal.bookingId]}
                className={`flex-1 ${respondModal.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                {responding[respondModal.bookingId] ? 'Processing...' : respondModal.status === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
