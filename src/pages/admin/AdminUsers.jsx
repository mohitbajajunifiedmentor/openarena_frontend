import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.users().then((r) => setUsers(r.data)).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const toggle = async (id, isActive) => {
    await adminApi.updateUser(id, { isActive: !isActive });
    load();
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Manage users</h1>
      <section className="mt-6 space-y-3">
        {users.map((u) => (
          <article key={u._id} className="flex items-center justify-between rounded-xl border bg-white p-4">
            <section>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted">{u.email} · {u.role}</p>
            </section>
            <Button variant={u.isActive ? 'danger' : 'primary'} onClick={() => toggle(u._id, u.isActive)}>
              {u.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </article>
        ))}
      </section>
    </section>
  );
}
