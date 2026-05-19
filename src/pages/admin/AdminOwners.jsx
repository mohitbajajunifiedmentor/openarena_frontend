import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.owners().then((r) => setOwners(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      await adminApi.createOwner(form);
      setMsg(`Owner account created for ${form.email}`);
      setForm({ name: '', email: '', password: '', phone: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Land owners & managers</h1>
      <p className="mt-1 text-muted">Only admins can create owner accounts</p>

      <form onSubmit={handleCreate} className="mt-8 space-y-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
        <h2 className="font-semibold text-brand-900">Create new owner</h2>
        <section className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Temporary password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </section>
        {msg && <p className="text-sm text-brand-700">{msg}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Create owner account</Button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <section className="mt-10 space-y-3">
          <h2 className="font-semibold">Existing owners ({owners.length})</h2>
          {owners.map((o) => (
            <article key={o._id} className="flex justify-between rounded-xl border bg-white p-4">
              <section>
                <p className="font-medium">{o.name}</p>
                <p className="text-sm text-muted">{o.email} · {o.groundCount ?? 0} grounds</p>
              </section>
              <span className={`text-xs font-semibold ${o.isActive ? 'text-brand-700' : 'text-red-600'}`}>
                {o.isActive ? 'Active' : 'Inactive'}
              </span>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
