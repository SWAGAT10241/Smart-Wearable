import { useEffect, useState } from "react";

import AppLayout from "../components/app/AppLayout";
import Field from "../components/auth/Field";
import Button from "../components/auth/Button";

import { useAuth } from "../context/AuthContext";
import { useDevices } from "../context/DeviceContext";

import { authApi } from "../lib/apiClient";

function Row({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
      <span className="font-medium text-slate-600">{label}</span>

      <span className="flex items-center gap-2 text-right text-slate-800">
        {value}

        {badge && (
          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-teal-700">
            {badge}
          </span>
        )}
      </span>
    </div>
  );
}

function DeviceCard({ device, selected, onSelect, onRename, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(
    device.deviceName || device.name || "TrailGuard Wearable",
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(device.deviceName || device.name || "TrailGuard Wearable");
  }, [device.deviceName, device.name]);

  const saveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setBusy(true);

    try {
      await onRename(device.deviceId, trimmedName);
      setEditing(false);
    } catch (error) {
      console.error("Failed to rename device:", error);
    } finally {
      setBusy(false);
    }
  };

  const cancelRename = () => {
    setName(device.deviceName || device.name || "TrailGuard Wearable");
    setEditing(false);
  };

  const deviceName = device.deviceName || device.name || "TrailGuard Wearable";

  const isActive = device.status === "active";

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        selected ? "border-teal-300 bg-teal-50/50" : "border-slate-200 bg-white"
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
                onChange={(event) => setName(event.target.value)}
              />

              <div className="flex gap-2">
                <Button onClick={saveName} disabled={busy || !name.trim()}>
                  {busy ? "Saving…" : "Save"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={cancelRename}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h4 className="truncate text-base font-semibold text-slate-900">
                  {deviceName}
                </h4>

                {selected && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-700">
                    Selected
                  </span>
                )}
              </div>

              <p className="mt-1 font-mono text-xs text-slate-500">
                {device.deviceId}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />

            {isActive ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      {!editing && (
        <div className="mt-4 flex flex-wrap gap-2">
          {!selected && (
            <Button
              variant="secondary"
              onClick={() => onSelect(device.deviceId)}
            >
              Select
            </Button>
          )}

          <Button variant="secondary" onClick={() => setEditing(true)}>
            Rename
          </Button>

          {onRemove && (
            <Button variant="ghost" onClick={() => onRemove(device.deviceId)}>
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();

  const {
    devices,
    selectedDevice,
    selectedDeviceId,
    selectDevice,
    registerDevice,
    renameDevice,
    removeDevice,
    loading: devicesLoading,
  } = useDevices();

  /*
   * ----------------------------------------------------------
   * Device registration state
   * ----------------------------------------------------------
   */

  const [deviceIdInput, setDeviceIdInput] = useState("");
  const [deviceNameInput, setDeviceNameInput] = useState("TrailGuard Wearable");
  const [registeringDevice, setRegisteringDevice] = useState(false);
  const [deviceRegistrationError, setDeviceRegistrationError] = useState("");
  const [deviceRegistrationSuccess, setDeviceRegistrationSuccess] = useState("");

  /*
   * ----------------------------------------------------------
   * Safety state
   * ----------------------------------------------------------
   */

  const [editingSafety, setEditingSafety] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    height: "",
    weight: "",
  });

  /*
   * ----------------------------------------------------------
   * Sync safety form with authenticated user
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      phoneNumber: user.phoneNumber || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      height: user.height ?? "",
      weight: user.weight ?? "",
    });
  }, [user]);

  /*
   * ----------------------------------------------------------
   * Form change
   * ----------------------------------------------------------
   */

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /*
   * ----------------------------------------------------------
   * Save safety information
   * ----------------------------------------------------------
   */

  const onSaveSafety = async () => {
    setBusy(true);
    try {
      await authApi.completeProfile({
        ...form,
        height: form.height === "" ? "" : Number(form.height),
        weight: form.weight === "" ? "" : Number(form.weight),
      });
      await refreshUser();
      setEditingSafety(false);
    } catch (error) {
      console.error("Failed to update safety information:", error);
    } finally {
      setBusy(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * Cancel safety editing
   * ----------------------------------------------------------
   */

  const onCancelSafety = () => {
    setForm({
      phoneNumber: user?.phoneNumber || "",
      emergencyContactName: user?.emergencyContactName || "",
      emergencyContactPhone: user?.emergencyContactPhone || "",
      height: user?.height ?? "",
      weight: user?.weight ?? "",
    });

    setEditingSafety(false);
  };

  /*
   * ----------------------------------------------------------
   * Safety display values
   * ----------------------------------------------------------
   */

  const phoneNumber = user?.phoneNumber || "Not provided";
  const emergencyContact =
    user?.emergencyContactName && user?.emergencyContactPhone
      ? `${user.emergencyContactName} · ${user.emergencyContactPhone}`
      : "Not provided";
  const height = user?.height != null ? `${user.height} cm` : "Not provided";
  const weight = user?.weight != null ? `${user.weight} kg` : "Not provided";

  /*
   * ----------------------------------------------------------
   * ONE-TIME DEVICE REGISTRATION
   * ----------------------------------------------------------
   */

  const handleRegisterDevice = async (event) => {
    event.preventDefault();
    setDeviceRegistrationError("");
    setDeviceRegistrationSuccess("");
    const deviceId = deviceIdInput.trim().toUpperCase();
    const deviceName = deviceNameInput.trim() || "TrailGuard Wearable";
    if (!deviceId) {
      setDeviceRegistrationError("Enter your TrailGuard device ID.");
      return;
    }
    setRegisteringDevice(true);
    try {
      const device = await registerDevice(deviceId, deviceName);
      setDeviceRegistrationSuccess(
        `${device?.deviceId || deviceId} is connected to your account.`,
      );
      setDeviceIdInput("");
      setDeviceNameInput("TrailGuard Wearable");
    } catch (error) {
      console.error("Failed to register device:", error);
      setDeviceRegistrationError(error?.message || "Failed to connect device.");
    } finally {
      setRegisteringDevice(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * Device handlers
   * ----------------------------------------------------------
   */

  const handleSelectDevice = (deviceId) => {
    selectDevice(deviceId);
  };
  const handleRenameDevice = async (deviceId, name) => {
    await renameDevice(deviceId, name);
  };
  const handleRemoveDevice = async (deviceId) => {
    const device = devices.find((item) => item.deviceId === deviceId);
    const deviceName = device?.deviceName || device?.name || "this device";
    const confirmed = window.confirm(`Remove ${deviceName} from your account?`);
    if (!confirmed) {
      return;
    }
    try {
      await removeDevice(deviceId);
    } catch (error) {
      console.error("Failed to remove device:", error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ----------------------------------------------------
            Header
        ----------------------------------------------------- */}
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account, safety information, and TrailGuard devices.
          </p>
        </div>
        {/* ----------------------------------------------------
            Account
        ----------------------------------------------------- */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Account</h3>
          <div className="space-y-3">
            <Row label="Username" value={user?.username || "Not provided"} />
            <Row label="Email" value={user?.email || "Not provided"} />
            <Row
              label="Sign-in method"
              value={
                user?.authProvider === "google" ? "Google" : "Email & password"
              }
              badge={user?.authProvider === "google" ? "CONNECTED" : undefined}
            />
          </div>
        </section>

        {/* ----------------------------------------------------
            Safety Info
        ----------------------------------------------------- */}

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Safety Info
          </h3>
          {!editingSafety ? (
            <div className="space-y-3">
              <Row label="Phone number" value={phoneNumber} />
              <Row label="Emergency contact" value={emergencyContact} />
              <Row label="Height" value={height} />
              <Row label="Weight" value={weight} />
              <Button variant="secondary" onClick={() => setEditingSafety(true)}>
                Edit safety info
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Phone number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={onChange}
                />
                <Field
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={form.height}
                  onChange={onChange}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Emergency contact name"
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={onChange}
                />
                <Field
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={form.weight}
                  onChange={onChange}
                />
              </div>
              <Field
                label="Emergency contact phone"
                name="emergencyContactPhone"
                value={form.emergencyContactPhone}
                onChange={onChange}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Button onClick={onSaveSafety} disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={onCancelSafety}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------
            Devices
        ----------------------------------------------------- */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Devices</h3>
              <p className="mt-1 text-sm text-slate-500">
                Connect and manage your TrailGuard wearables.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {devices.length} {devices.length === 1 ? "device" : "devices"}
            </span>
          </div>
          {/* --------------------------------------------------
              ONE-TIME DEVICE CONNECTION
          --------------------------------------------------- */}
          <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Connect TrailGuard Wearable
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Enter the device ID printed on your physical TrailGuard
                wearable. This is a one-time setup that connects the wearable to
                your account.
              </p>
            </div>
            <form onSubmit={handleRegisterDevice} className="space-y-3">
              <Field
                label="Device ID"
                name="deviceId"
                value={deviceIdInput}
                onChange={(event) => setDeviceIdInput(event.target.value)}
                placeholder="TG290820260001"
                disabled={registeringDevice}
              />
              <Field
                label="Device name"
                name="deviceName"
                value={deviceNameInput}
                onChange={(event) => setDeviceNameInput(event.target.value)}
                placeholder="TrailGuard Wearable"
                disabled={registeringDevice}
              />
              {deviceRegistrationError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deviceRegistrationError}
                </div>
              )}
              {deviceRegistrationSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {deviceRegistrationSuccess}
                </div>
              )}
              <Button type="submit"disabled={registeringDevice || !deviceIdInput.trim()}>
                {registeringDevice ? "Connecting…" : "Connect Device"}
              </Button>
            </form>
          </div>
          {/* --------------------------------------------------
              DEVICE LIST
          --------------------------------------------------- */}
          {devicesLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Loading devices…
            </div>
          ) : devices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="text-sm font-semibold text-slate-800">
                No devices connected
              </div>
              <p className="mt-1 text-xs text-slate-500">
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
                  onSelect={handleSelectDevice}
                  onRename={handleRenameDevice}
                  onRemove={devices.length > 1 ? handleRemoveDevice : undefined}
                />
              ))}
            </div>
          )}
          {/* --------------------------------------------------
              SELECTED DEVICE
          --------------------------------------------------- */}
          {selectedDevice && (
            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                Active device
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {selectedDevice.deviceName ||
                  selectedDevice.name ||
                  "TrailGuard Wearable"}
              </div>

              <div className="mt-0.5 font-mono text-xs text-slate-500">
                {selectedDevice.deviceId}
              </div>
            </div>
          )}
        </section>
        {/* ----------------------------------------------------
            Preferences + Danger Zone
        ----------------------------------------------------- */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preferences */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Preferences
            </h3>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <span>Light theme</span>
              <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200">
                <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm" />
              </span>
            </div>
          </section>
          {/* Danger Zone */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Danger Zone
            </h3>
            <p className="mb-4 text-sm text-slate-500">
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