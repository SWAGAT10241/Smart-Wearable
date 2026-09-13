import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import AppLayout from "../components/app/AppLayout";
import Field from "../components/auth/Field";
import Button from "../components/auth/Button";
import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";
import { authApi } from "../lib/apiClient";
import PhoneField from "../components/auth/PhoneField";

function Row({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-3 text-sm">
      <span className="font-medium text-[var(--color-text-secondary)]">{label}</span>
      <span className="flex items-center gap-2 text-right text-[var(--color-text)]">
        {value}
        {badge && (
          <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-400">
            {badge}
          </span>
        )}
      </span>
    </div>
  );
}

function DeviceCard({ device, selected, onSelect, onRename, onStatusChange, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(device.deviceName || device.name || "TrailGuard Wearable");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(device.deviceName || device.name || "TrailGuard Wearable");
  }, [device.deviceName, device.name]);

  const deviceName = device.deviceName || device.name || "TrailGuard Wearable";
  const isActive = device.status === "active";

  const saveName = async () => {
    const value = name.trim();
    if (!value) return;
    setBusy(true);
    try {
      await onRename(device.deviceId, value);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        selected
          ? "border-teal-400/60 bg-teal-400/5"
          : "border-[var(--color-border)] bg-[var(--color-surface-alt)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-3">
              <Field
                label="Device name"
                name="deviceName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex gap-2">
                <Button onClick={saveName} disabled={busy || !name.trim()}>
                  {busy ? "Saving…" : "Save"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setName(deviceName);
                    setEditing(false);
                  }}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h4 className="truncate text-base font-semibold text-[var(--color-text)]">
                  {deviceName}
                </h4>

                {selected && (
                  <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-teal-400">
                    Selected
                  </span>
                )}
              </div>

              <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
                {device.deviceId}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isActive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
            {isActive ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      {!editing && (
        <div className="mt-4 flex flex-wrap gap-2">
          {isActive && !selected && (
            <Button
              variant="secondary"
              className="!h-11 !w-auto px-5"
              onClick={() => onSelect(device.deviceId)}
            >
              Select
            </Button>
          )}

          <Button
            variant="secondary"
            className="!h-11 !w-auto px-5"
            onClick={() => setEditing(true)}
          >
            Rename
          </Button>

          <Button
            variant="secondary"
            className="!h-11 !w-auto px-5"
            onClick={() => onStatusChange(device.deviceId, device.status)}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>

          {onRemove && (
            <Button
              variant="ghost"
              className="!h-11 !w-auto px-5"
              onClick={() => onRemove(device.deviceId)}
            >
              Unpair
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  const {
    devices,
    selectedDevice,
    selectedDeviceId,
    selectDevice,
    registerDevice,
    renameDevice,
    updateDeviceStatus,
    removeDevice,
    loading: devicesLoading,
  } = useDevices();

  const [deviceIdInput, setDeviceIdInput] = useState("");
  const [deviceNameInput, setDeviceNameInput] = useState("TrailGuard Wearable");
  const [registeringDevice, setRegisteringDevice] = useState(false);
  const [deviceError, setDeviceError] = useState("");
  const [deviceSuccess, setDeviceSuccess] = useState("");

  const [editingSafety, setEditingSafety] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      phoneNumber: user.phoneNumber || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      height: user.height ?? "",
      weight: user.weight ?? "",
    });
  }, [user]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveSafety = async () => {
    setBusy(true);

    try {
      await authApi.completeProfile({
        ...form,
        height: form.height === "" ? "" : Number(form.height),
        weight: form.weight === "" ? "" : Number(form.weight),
      });

      await refreshUser();
      setEditingSafety(false);
    } catch (e) {
      console.error("Failed to update safety information:", e);
    } finally {
      setBusy(false);
    }
  };

  const cancelSafety = () => {
    setForm({
      phoneNumber: user?.phoneNumber || "",
      emergencyContactName: user?.emergencyContactName || "",
      emergencyContactPhone: user?.emergencyContactPhone || "",
      height: user?.height ?? "",
      weight: user?.weight ?? "",
    });
    setEditingSafety(false);
  };

  const register = async (e) => {
    e.preventDefault();
    setDeviceError("");
    setDeviceSuccess("");

    const id = deviceIdInput.trim().toUpperCase();
    const name = deviceNameInput.trim() || "TrailGuard Wearable";

    if (!id) {
      setDeviceError("Enter your TrailGuard device ID.");
      return;
    }

    setRegisteringDevice(true);

    try {
      const device = await registerDevice(id, name);
      setDeviceSuccess(`${device?.deviceId || id} is connected to your account.`);
      setDeviceIdInput("");
      setDeviceNameInput("TrailGuard Wearable");
    } catch (e) {
      setDeviceError(e?.message || "Failed to connect device.");
    } finally {
      setRegisteringDevice(false);
    }
  };

  const toggleStatus = async (deviceId, status) => {
    const next = status === "active" ? "inactive" : "active";
    const device = devices.find((d) => d.deviceId === deviceId);
    const name = device?.deviceName || device?.name || "this device";

    if (!window.confirm(`${next === "inactive" ? "Deactivate" : "Activate"} ${name}?`)) return;

    await updateDeviceStatus(deviceId, next);
  };

  const remove = async (deviceId) => {
    const device = devices.find((d) => d.deviceId === deviceId);
    const name = device?.deviceName || device?.name || "this device";

    if (!window.confirm(`Unpair ${name} from your account?`)) return;

    await removeDevice(deviceId);
  };

  const phone = user?.phoneNumber || "Not provided";

  const emergency =
    user?.emergencyContactName && user?.emergencyContactPhone
      ? `${user.emergencyContactName} · ${user.emergencyContactPhone}`
      : "Not provided";

  const height = user?.height != null ? `${user.height} cm` : "Not provided";
  const weight = user?.weight != null ? `${user.weight} kg` : "Not provided";

  const card =
    "rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]";

  const option = (active) =>
    `rounded-xl border p-4 text-left transition ${
      active
        ? "border-teal-400 bg-teal-400/10 ring-2 ring-teal-400/20"
        : "border-[var(--color-border)] bg-[var(--color-surface-alt)] hover:border-teal-400/40"
    }`;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your account, safety information, and TrailGuard devices.
          </p>
        </header>

        {/* Appearance */}
        <section className={card}>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Appearance</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Choose how TrailGuard looks on your device.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={setLightTheme} className={option(theme === "light")}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">Light</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Use the bright theme
                  </p>
                </div>
              </div>
            </button>

            <button type="button" onClick={setDarkTheme} className={option(theme === "dark")}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">Dark</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Use the dark theme
                  </p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Account */}
        <section className={card}>
          <h3 className="mb-4 text-lg font-semibold text-[var(--color-text)]">
            Account
          </h3>

          <div className="space-y-3">
            <Row label="Username" value={user?.username || "Not provided"} />
            <Row label="Email" value={user?.email || "Not provided"} />
            <Row
              label="Sign-in method"
              value={user?.authProvider === "google" ? "Google" : "Email & password"}
              badge={user?.authProvider === "google" ? "CONNECTED" : undefined}
            />
          </div>
        </section>

        {/* Safety */}
        <section className={card}>
          <h3 className="mb-4 text-lg font-semibold text-[var(--color-text)]">
            Safety Info
          </h3>

          {!editingSafety ? (
            <div className="space-y-3">
              <Row label="Phone number" value={phone} />
              <Row label="Emergency contact" value={emergency} />
              <Row label="Height" value={height} />
              <Row label="Weight" value={weight} />

              <Button variant="secondary" onClick={() => setEditingSafety(true)}>
                Edit safety info
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <PhoneField label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={onChange} defaultCountry="IN"/>
                <Field label="Height (cm)" name="height" type="number" value={form.height} onChange={onChange} />
                <Field label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={onChange} />
                <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={onChange} />
              </div>
              <PhoneField label="Emergency contact phone" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={onChange} defaultCountry="IN"/>
              <div className="grid gap-3 md:grid-cols-2">
                <Button onClick={saveSafety} disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </Button>
                <Button variant="secondary" onClick={cancelSafety} disabled={busy}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Devices */}
        <section className={card}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Devices</h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Connect and manage your TrailGuard wearables.
              </p>
            </div>

            <span className="rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
              {devices.length} {devices.length === 1 ? "device" : "devices"}
            </span>
          </div>

          {/* Connect */}
          <div className="mb-5 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-4">
            <h4 className="text-sm font-semibold text-[var(--color-text)]">
              Connect TrailGuard Wearable
            </h4>

            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              Enter the device ID printed on your physical TrailGuard wearable.
              This is a one-time setup.
            </p>

            <form onSubmit={register} className="mt-4 space-y-3">
              <Field
                label="Device ID"
                name="deviceId"
                value={deviceIdInput}
                onChange={(e) => setDeviceIdInput(e.target.value)}
                placeholder="Enter device ID"
                disabled={registeringDevice}
              />

              <Field
                label="Device name"
                name="deviceName"
                value={deviceNameInput}
                onChange={(e) => setDeviceNameInput(e.target.value)}
                placeholder="TrailGuard Wearable"
                disabled={registeringDevice}
              />

              {deviceError && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-400">
                  {deviceError}
                </div>
              )}

              {deviceSuccess && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-400">
                  {deviceSuccess}
                </div>
              )}

              <Button type="submit" disabled={registeringDevice || !deviceIdInput.trim()}>
                {registeringDevice ? "Connecting…" : "Connect Device"}
              </Button>
            </form>
          </div>

          {/* Device list */}
          {devicesLoading ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center text-sm text-[var(--color-text-secondary)]">
              Loading devices…
            </div>
          ) : devices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
              <div className="text-sm font-semibold text-[var(--color-text)]">
                No devices connected
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Enter your device ID above to connect your TrailGuard wearable.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <DeviceCard
                  key={device.deviceId}
                  device={device}
                  selected={device.deviceId === selectedDeviceId}
                  onSelect={selectDevice}
                  onRename={renameDevice}
                  onStatusChange={toggleStatus}
                  onRemove={remove}
                />
              ))}
            </div>
          )}

          {/* Selected device */}
          {selectedDevice && (
            <div className="mt-4 rounded-xl border border-teal-400/30 bg-teal-400/5 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-400">
                Selected device
              </div>

              <div className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                {selectedDevice.deviceName ||
                  selectedDevice.name ||
                  "TrailGuard Wearable"}
              </div>

              <div className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                {selectedDevice.deviceId}
              </div>
            </div>
          )}
        </section>

        {/* Preferences + Danger */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className={card}>
            <h3 className="mb-4 text-lg font-semibold text-[var(--color-text)]">
              Preferences
            </h3>

            <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-text)]">Current theme</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  Your theme preference is saved automatically.
                </p>
              </div>

              <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-400">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </div>
          </section>

          <section className={card}>
            <h3 className="mb-4 text-lg font-semibold text-[var(--color-text)]">
              Danger Zone
            </h3>

            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
              Signing out ends your session on this device.
            </p>

            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}