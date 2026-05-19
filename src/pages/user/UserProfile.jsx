import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    authApi
      .me()
      .then((r) => {
        setForm({ name: r.data.name || '', phone: r.data.phone || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">Profile settings</h1>
      <p className="mt-1 text-muted">{user?.email}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-brand-800">{message}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </section>
  );
}
