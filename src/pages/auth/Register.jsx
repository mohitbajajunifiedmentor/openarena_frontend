import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role: 'user' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-2xl font-bold">Create user account</h1>
      <p className="mt-1 text-sm text-muted">Book sports grounds and event venues on OpenArena</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input label="Full name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        <Input label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <Input label="Password" type="password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
      </form>
      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-muted">
        Land owner / manager accounts are created by the platform admin only — not via public signup.
      </p>
      <p className="mt-4 text-center text-sm text-muted">
        Have an account? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link>
      </p>
    </section>
  );
}
