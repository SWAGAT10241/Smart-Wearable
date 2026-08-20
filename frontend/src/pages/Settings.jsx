import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/apiClient';

function Row({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="flex items-center gap-2 text-right text-slate-800">
        {value}
        {badge && <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-teal-700">{badge}</span>}
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
      <main className="flex flex-1 flex-col gap-6 bg-slate-50 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">Settings</h1>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Account</h3>
          <div className="space-y-3">
            <Row label="Username" value={user?.username} />
            <Row label="Email" value={user?.email} />
            <Row label="Sign-in method" value={user?.authProvider === 'google' ? 'Google' : 'Email & password'} badge={user?.authProvider === 'google' ? 'CONNECTED' : undefined} />
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Safety Info</h3>
          {!editing ? (
            <div className="space-y-3">
              <Row label="Phone number" value={user?.phoneNumber} />
              <Row label="Emergency contact" value={`${user?.emergencyContactName} · ${user?.emergencyContactPhone}`} />
              <Row label="Height" value={`${user?.height} cm`} />
              <Row label="Weight" value={`${user?.weight} kg`} />
              <Button variant="secondary" onClick={() => setEditing(true)}>Edit safety info</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
                <Field label="Height (cm)" name="height" type="number" value={form.height} onChange={onChange} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={onChange} />
                <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={onChange} />
              </div>
              <Field label="Emergency contact phone" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={onChange} />
              <div className="grid gap-3 md:grid-cols-2">
                <Button onClick={onSave} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Device</h3>
          <div className="space-y-3">
            <Row label="Paired device" value={user?.deviceId || 'None'} badge={user?.deviceId ? 'CONNECTED' : undefined} />
            <Button variant="secondary">Re-pair device</Button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Preferences</h3>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <span>Light theme</span>
              <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm" />
              </span>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Danger Zone</h3>
            <p className="mb-4 text-sm text-slate-500">Signing out ends your session on this device.</p>
            <Button variant="ghost" onClick={logout}>Log out</Button>
          </section>
        </div>
      </main>
    </div>
  );
}
