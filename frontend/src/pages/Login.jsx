import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/apiClient';
import { isProfileComplete } from '../lib/profileCompletion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(isProfileComplete(user) ? '/dashboard' : '/complete-profile');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Peace of mind on every trail.">
      <form className="tg-formcard tg-formcard--login" onSubmit={onSubmit}>
        <h2 className="tg-formcard__title">Welcome back</h2>
        <p className="tg-formcard__sub">Log in to see your live trail dashboard.</p>

        {error && <div className="tg-formcard__error">{error}</div>}

        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          leadingIcon="✉"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          leadingIcon="🔒"
          trailingIcon="◉"
          required
        />

        <Button type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</Button>

        <div className="tg-formcard__divider"><span /><em>or</em><span /></div>

        <Button
          variant="secondary"
          className="bg-slate-900 text-white shadow-[0_10px_20px_rgba(16,42,67,0.28)] hover:bg-slate-800"
          type="button"
          onClick={() => (window.location.href = authApi.googleLoginUrl())}
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[13px] font-bold text-red-500">G</span>
          Continue with Google
        </Button>

        <p className="tg-formcard__footer">
          Don't have an account? <Link to="/register" className="tg-formcard__link">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
