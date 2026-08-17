import { useEffect, useState } from 'react';
import { fallsApi } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useLiveData } from '../context/LiveDataContext';
import Button from './Button';
import './FallAlertModal.css';

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
    <div className="tg-fallmodal__scrim">
      <div className="tg-fallmodal">
        <div className="tg-fallmodal__icon">
          <span className="tg-fallmodal__icon-dot" />
        </div>
        <span className="tg-fallmodal__badge">{(activeFall.severity || 'moderate').toUpperCase()} SEVERITY</span>
        <h1 className="tg-fallmodal__title">Fall Detected</h1>
        <p className="tg-fallmodal__detail">
          Detected just now
          {activeFall.latitude && activeFall.longitude
            ? ` near ${activeFall.latitude.toFixed(4)}, ${activeFall.longitude.toFixed(4)}`
            : ''}
          {activeFall.tiltAngle ? `. Tilt angle ${activeFall.tiltAngle}°.` : '.'}
        </p>

        <div className="tg-fallmodal__countdown">
          Auto-escalating to SOS in <strong>{mm}:{ss}</strong>
        </div>

        <div className="tg-fallmodal__actions">
          <Button variant="primary" onClick={handleOkay} disabled={busy}>
            I'm okay
          </Button>
          <Button variant="danger" onClick={handleSOS} disabled={busy}>
            Send SOS now
          </Button>
        </div>

        <p className="tg-fallmodal__footnote">
          Your emergency contact
          {user?.emergencyContactName ? `, ${user.emergencyContactName},` : ''} will be notified by SMS with your location.
        </p>
      </div>
    </div>
  );
}
