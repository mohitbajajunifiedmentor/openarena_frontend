import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ownerApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { getGroundImage } from '../../utils/images.js';

export default function OwnerGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () =>
    ownerApi
      .grounds()
      .then((r) => setGrounds(r.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (g) => {
    setBusyId(g._id);
    try {
      await ownerApi.setGroundActive(g._id, !g.isActive);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const deactivate = async (g) => {
    if (!window.confirm(`Deactivate "${g.name}"? It will be hidden from search.`)) return;
    setBusyId(g._id);
    try {
      await ownerApi.deleteGround(g._id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <section>
          <h1 className="font-display text-3xl font-bold">My grounds</h1>
          <p className="mt-1 text-sm text-muted">Add, edit, activate or deactivate your listings</p>
        </section>
        <Link to="/owner/grounds/new"><Button>Add ground</Button></Link>
      </header>
      <section className="space-y-4">
        {grounds.map((g) => (
          <article
            key={g._id}
            className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5 ${
              g.isActive === false ? 'border-slate-200 opacity-75' : 'border-slate-200'
            }`}
          >
            <img src={getGroundImage(g)} alt="" className="h-20 w-28 rounded-xl object-cover" />
            <section className="min-w-[140px] flex-1">
              <h3 className="font-semibold">{g.name}</h3>
              <p className="text-sm text-muted">
                {g.location?.city} · {g.groundType || 'mixed'} · {g.capacity} capacity
              </p>
              <p className="text-xs text-muted">{g.photos?.length || 0} photos uploaded</p>
            </section>
            <section className="flex flex-wrap items-center gap-2">
              <Badge
                className={
                  g.listingStatus === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }
              >
                {g.listingStatus}
              </Badge>
              <Badge className={g.isActive !== false ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-600'}>
                {g.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
              <Link to={`/grounds/${g._id}`}>
                <Button variant="ghost">Preview</Button>
              </Link>
              <Link to={`/owner/grounds/${g._id}/schedule`}>
                <Button variant="ghost">Schedule</Button>
              </Link>
              <Link to={`/owner/grounds/${g._id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button
                variant="ghost"
                disabled={busyId === g._id}
                onClick={() => toggleActive(g)}
              >
                {g.isActive !== false ? 'Deactivate' : 'Activate'}
              </Button>
              {g.isActive !== false && (
                <Button variant="ghost" disabled={busyId === g._id} onClick={() => deactivate(g)}>
                  Remove
                </Button>
              )}
            </section>
          </article>
        ))}
        {!grounds.length && <p className="text-muted">No grounds yet. Add your first listing.</p>}
      </section>
    </section>
  );
}
