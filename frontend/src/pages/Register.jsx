import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const EMPTY = {
  username: '', email: '', password: '',
  phoneNumber: '', emergencyContactName: '', emergencyContactPhone: '',
  height: '', weight: '',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout headline="Set up your safety profile.">
      <form className="tg-formcard" onSubmit={onSubmit}>
        <h2 className="tg-formcard__title">Create your account</h2>
        <p className="tg-formcard__sub">Takes about a minute — every field here keeps you safer on trail.</p>

        {error && <div className="tg-formcard__error">{error}</div>}

        <div className="tg-formcard__section-label"><span>YOUR ACCOUNT</span></div>
        <div className="tg-formcard__row">
          <Field label="Username" name="username" placeholder="trailblazer_23" value={form.username} onChange={onChange} required />
          <Field label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
        </div>
        <Field label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} required />

        <div className="tg-formcard__section-label"><span>SAFETY INFO</span></div>
        <div className="tg-formcard__row">
          <Field label="Phone number" name="phoneNumber" placeholder="+1 555 010 2938" value={form.phoneNumber} onChange={onChange} required />
          <Field label="Height (cm)" name="height" type="number" placeholder="175" value={form.height} onChange={onChange} required />
        </div>
        <div className="tg-formcard__row">
          <Field label="Emergency contact name" name="emergencyContactName" placeholder="Priya Nair" value={form.emergencyContactName} onChange={onChange} required />
          <Field label="Weight (kg)" name="weight" type="number" placeholder="70" value={form.weight} onChange={onChange} required />
        </div>
        <Field label="Emergency contact phone" name="emergencyContactPhone" placeholder="+1 555 837 1120" value={form.emergencyContactPhone} onChange={onChange} required />

        <Button type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>

        <p className="tg-formcard__footer">
          Already have an account? <Link to="/login" className="tg-formcard__link">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
