import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/apiClient';
import './Settings.css';

function Row({ label, value, badge }) {
  return (
    <div className="tg-settings__row">
      <span className="tg-settings__row-label">{label}</span>
      <span className="tg-settings__row-value">
        {value}
        {badge && <span className="tg-settings__badge">{badge}</span>}
      </span>
    </div>
  );
}

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: user?.phoneNumber || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || '',
    height: user?.height || '',
    weight: user?.weight || '',
  });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setBusy(true);
    try {
      await authApi.completeProfile(form);
      await refreshUser();
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tg-page">
      <Sidebar />
      <main className="tg-settings">
        <h1>Settings</h1>

        <section className="tg-settings__card">
          <h3>Account</h3>
          <Row label="Username" value={user?.username} />
          <Row label="Email" value={user?.email} />
          <Row label="Sign-in method" value={user?.authProvider === 'google' ? 'Google' : 'Email & password'} badge={user?.authProvider === 'google' ? 'CONNECTED' : undefined} />
        </section>

        <section className="tg-settings__card">
          <h3>Safety Info</h3>
          {!editing ? (
            <>
              <Row label="Phone number" value={user?.phoneNumber} />
              <Row label="Emergency contact" value={`${user?.emergencyContactName} · ${user?.emergencyContactPhone}`} />
              <Row label="Height" value={`${user?.height} cm`} />
              <Row label="Weight" value={`${user?.weight} kg`} />
              <Button variant="secondary" onClick={() => setEditing(true)}>Edit safety info</Button>
            </>
          ) : (
            <div className="tg-settings__editform">
              <div className="tg-formcard__row">
                <Field label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
                <Field label="Height (cm)" name="height" type="number" value={form.height} onChange={onChange} />
              </div>
              <div className="tg-formcard__row">
                <Field label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={onChange} />
                <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={onChange} />
              </div>
              <Field label="Emergency contact phone" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={onChange} />
              <div className="tg-formcard__row">
                <Button onClick={onSave} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </section>

        <section className="tg-settings__card">
          <h3>Device</h3>
          <Row label="Paired device" value={user?.deviceId || 'None'} badge={user?.deviceId ? 'CONNECTED' : undefined} />
          <Button variant="secondary">Re-pair device</Button>
        </section>

        <div className="tg-settings__grid">
          <section className="tg-settings__card">
            <h3>Preferences</h3>
            <div className="tg-settings__toggle-row">
              <span>Light theme</span>
              <span className="tg-settings__toggle"><span className="tg-settings__toggle-knob" /></span>
            </div>
          </section>

          <section className="tg-settings__card">
            <h3>Danger Zone</h3>
            <p className="tg-settings__hint">Signing out ends your session on this device.</p>
            <Button variant="ghost" onClick={logout}>Log out</Button>
          </section>
        </div>
      </main>
    </div>
  );
}
