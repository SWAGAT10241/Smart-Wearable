import { useEffect, useState } from 'react';
import { fallsApi } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';
import Button from "../components/auth/Button";

const AUTO_ESCALATE_SECONDS = 30;

// Per design.md §4.6 — full-screen, cannot be dismissed by clicking outside,
// auto-escalates to SOS if the wearer doesn't respond in time.
export default function FallAlertModal() {
  const { activeFall, dismissFall } = useLiveData();
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(AUTO_ESCALATE_SECONDS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!activeFall) return;
    setSecondsLeft(AUTO_ESCALATE_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleSOS();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFall?._id]);

  if (!activeFall) return null;

  async function handleStatus(status) {
    setBusy(true);
    try {
      await fallsApi.updateStatus(activeFall._id, status);
      dismissFall();
    } catch (err) {
      console.error('Failed to update fall status', err);
    } finally {
      setBusy(false);
    }
  }

  const handleOkay = () => handleStatus('confirmed_false_alarm');
  const handleSOS = () => handleStatus('sos_triggered');

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/45">
      <div className="flex w-[560px] max-w-[92vw] flex-col items-center gap-4 rounded-[24px] border-2 border-red-600 bg-white p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100">
          <span className="h-7 w-7 rounded-full bg-red-600" />
        </div>
        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-red-700">
          {(activeFall.severity || 'moderate').toUpperCase()} SEVERITY
        </span>
        <h1 className="m-0 text-[30px] font-bold text-slate-900">Fall Detected</h1>
        <p className="m-0 max-w-[440px] text-sm text-slate-600">
          Detected just now
          {activeFall.latitude && activeFall.longitude
            ? ` near ${activeFall.latitude.toFixed(4)}, ${activeFall.longitude.toFixed(4)}`
            : ''}
          {activeFall.tiltAngle ? `. Tilt angle ${activeFall.tiltAngle}°.` : '.'}
        </p>

        <div className="rounded-lg bg-slate-100 px-3.5 py-2 text-[12px] text-slate-500">
          Auto-escalating to SOS in <strong className="text-[14px] font-semibold text-amber-500">{mm}:{ss}</strong>
        </div>

        <div className="mt-1 flex w-full gap-3.5">
          <Button variant="primary" onClick={handleOkay} disabled={busy}>
            I'm okay
          </Button>
          <Button variant="danger" onClick={handleSOS} disabled={busy}>
            Send SOS now
          </Button>
        </div>

        <p className="m-0 max-w-[440px] text-[12px] text-slate-500">
          Your emergency contact
          {user?.emergencyContactName ? `, ${user.emergencyContactName},` : ''} will be notified by SMS with your location.
        </p>
      </div>
    </div>
  );
}
