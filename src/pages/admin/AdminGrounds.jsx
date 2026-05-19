import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { getGroundImage } from '../../utils/images.js';

export default function AdminGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.pendingGrounds().then((r) => setGrounds(r.data)).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const review = async (id, listingStatus) => {
    await adminApi.reviewGround(id, { listingStatus });
    load();
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Approve ground listings</h1>
      <section className="mt-6 space-y-4">
        {grounds.map((g) => (
          <article key={g._id} className="flex gap-4 rounded-2xl border bg-white p-5">
            <img src={getGroundImage(g)} alt={g.name} className="h-24 w-32 rounded-xl object-cover" />
            <section className="flex-1">
            <h3 className="font-semibold">{g.name}</h3>
            <p className="text-sm text-muted">{g.location?.city} · Owner: {g.owner?.name}</p>
            <section className="mt-3 flex gap-2">
              <Button onClick={() => review(g._id, 'approved')}>Approve</Button>
              <Button variant="danger" onClick={() => review(g._id, 'rejected')}>Reject</Button>
            </section>
            </section>
          </article>
        ))}
        {!grounds.length && <p className="text-muted">No pending listings.</p>}
      </section>
    </section>
  );
}
