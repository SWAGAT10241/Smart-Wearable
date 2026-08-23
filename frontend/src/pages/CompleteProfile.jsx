import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from "../components/auth/Field";
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfile() {
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phoneNumber: '', emergencyContactName: '', emergencyContactPhone: '', height: '', weight: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await completeProfile(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <form className="tg-formcard tg-formcard--card" onSubmit={onSubmit}>
        <span className="tg-badge-pill">ONE LAST STEP</span>
        <h2 className="tg-formcard__title">Finish setting up your safety profile</h2>
        <p className="tg-formcard__sub">
          Google didn't share this with us — we need it so TrailGuard knows who to alert, and where, if something goes wrong.
        </p>

        {error && <div className="tg-formcard__error">{error}</div>}

        <div className="tg-formcard__row">
          <Field label="Phone number" name="phoneNumber" placeholder="+1 555 010 2938" value={form.phoneNumber} onChange={onChange} required />
          <Field label="Height (cm)" name="height" type="number" placeholder="175" value={form.height} onChange={onChange} required />
        </div>
        <div className="tg-formcard__row">
          <Field label="Emergency contact name" name="emergencyContactName" placeholder="Priya Nair" value={form.emergencyContactName} onChange={onChange} required />
          <Field label="Weight (kg)" name="weight" type="number" placeholder="70" value={form.weight} onChange={onChange} required />
        </div>
        <Field label="Emergency contact phone" name="emergencyContactPhone" placeholder="+1 555 837 1120" value={form.emergencyContactPhone} onChange={onChange} required />

        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Complete profile & continue'}</Button>
      </form>
    </div>
  );
}
