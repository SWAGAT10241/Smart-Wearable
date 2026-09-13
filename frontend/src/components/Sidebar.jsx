import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiLink, FiX } from "react-icons/fi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

import { useDevices } from "../context/DeviceContext";
import loginBackground from "../assets/images/login-background.png";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "/history", label: "History", icon: MdHistory },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const { selectedDevice, registerDevice, removeDevice } = useDevices();

  const [showPairModal, setShowPairModal] = useState(false);
  const [showUnpairModal, setShowUnpairModal] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [pairing, setPairing] = useState(false);
  const [unpairing, setUnpairing] = useState(false);
  const [pairError, setPairError] = useState("");

  const deviceName =
    selectedDevice?.deviceName || selectedDevice?.name || "TrailGuard Wearable";

  const handlePair = async (event) => {
    event?.preventDefault();

    const id = deviceId.trim().toUpperCase();

    if (!id) {
      setPairError("Enter your TrailGuard device ID.");
      return;
    }

    setPairError("");
    setPairing(true);

    try {
      await registerDevice(id, "TrailGuard Wearable");
      setDeviceId("");
      setShowPairModal(false);
    } catch (error) {
      console.error("Failed to pair device:", error);
      setPairError(error?.message || "Failed to pair device.");
    } finally {
      setPairing(false);
    }
  };

  const handleUnpair = async () => {
    if (!selectedDevice?.deviceId) return;

    setUnpairing(true);

    try {
      await removeDevice(selectedDevice.deviceId);
      setShowUnpairModal(false);
    } catch (error) {
      console.error("Failed to unpair device:", error);
    } finally {
      setUnpairing(false);
    }
  };

  const openPairModal = () => {
    setPairError("");
    setDeviceId("");
    setShowPairModal(true);
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="relative hidden min-h-screen w-[250px] shrink-0 overflow-hidden bg-[#061B2D] lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[#061B2D]" />

        <div
          className="absolute inset-x-0 bottom-0 h-[52%] bg-cover bg-bottom"
          style={{ backgroundImage: `url(${loginBackground})` }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[65%]"
          style={{
            background:
              "linear-gradient(to bottom,#061B2D 0%,rgba(6,27,45,.97) 20%,rgba(6,27,45,.88) 45%,rgba(6,27,45,.62) 72%,rgba(6,27,45,.78) 100%)",
          }}
        />

        <div className="absolute inset-0 bg-[#031827]/10" />

        <div className="relative z-10 flex min-h-screen flex-col px-4 py-5">
          {/* LOGO */}
          <div className="mb-8 flex items-center gap-2.5 px-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-400/15">
              🛡
            </span>

            <span className="text-xl font-semibold text-white">
              Trail<span className="text-[#2DD4BF]">Guard</span>
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#0E9C8C]/30 text-[#42E3D0]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="shrink-0 text-[20px]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* BOTTOM */}
          <div className="mt-5 space-y-3">
            {/* SAFETY */}
            <div className="rounded-2xl border border-white/10 bg-[#102F4A]/65 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-400/15">
                  🛡
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-white">
                    Stay safe. Explore more.
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    TrailGuard is watching
                    <br />
                    over you.
                  </p>
                </div>
              </div>
            </div>

            {/* DEVICE */}
            <div className="rounded-2xl border border-white/10 bg-[#102F4A]/65 p-4 shadow-lg backdrop-blur-sm">
              {selectedDevice ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />

                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-white">
                        Device paired
                      </div>

                      <p className="mt-1 truncate text-[11px] text-slate-300">
                        {deviceName}
                      </p>

                      <p className="mt-0.5 truncate font-mono text-[9px] text-slate-500">
                        {selectedDevice.deviceId}
                      </p>
                    </div>

                    <FiLink className="text-[18px] text-emerald-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowUnpairModal(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <FiLink className="text-[15px]" />
                    Unpair Device
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-500" />

                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-white">
                        No device paired
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400">
                        Pair your TrailGuard wearable
                        <br />
                        to start monitoring.
                      </p>
                    </div>

                    <FiLink className="text-[18px] text-slate-500" />
                  </div>

                  <button
                    type="button"
                    onClick={openPairModal}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-3 py-2 text-[11px] font-semibold text-[#06202D] transition hover:bg-[#5EEAD4]"
                  >
                    <FiLink className="text-[15px]" />
                    Pair Device
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MODAL BACKDROP */}
      {(showPairModal || showUnpairModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-[2px]">
          {/* PAIR MODAL */}
          {showPairModal && (
            <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-2xl">
              <ModalHeader
                title="Pair TrailGuard Device"
                text="Enter the device ID printed on your TrailGuard wearable."
                onClose={() => setShowPairModal(false)}
              />

              <form onSubmit={handlePair} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                    Device ID
                  </label>

                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="Enter your device ID"
                    autoFocus
                    disabled={pairing}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-3 font-mono text-sm uppercase text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-teal-400"
                  />
                </div>

                {pairError && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-400">
                    {pairError}
                  </div>
                )}

                <ModalButtons
                  onCancel={() => setShowPairModal(false)}
                  onConfirm={handlePair}
                  cancelText="Cancel"
                  confirmText={pairing ? "Pairing…" : "Pair Device"}
                  disabled={pairing || !deviceId.trim()}
                />
              </form>
            </div>
          )}

          {/* UNPAIR MODAL */}
          {showUnpairModal && selectedDevice && (
            <div className="w-full max-w-[440px] rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl">
              <ModalHeader
                title="Unpair Device?"
                text="This will disconnect the wearable from your account."
                onClose={() => setShowUnpairModal(false)}
              />

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="text-[15px] font-bold text-slate-900 dark:text-white">
                  {deviceName}
                </div>

                <div className="mt-1.5 font-mono text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
                  {selectedDevice.deviceId}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3.5 text-sm font-medium leading-5 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                Historical telemetry will be preserved. Only the device pairing
                will be removed.
              </div>

              <ModalButtons
                onCancel={() => setShowUnpairModal(false)}
                onConfirm={handleUnpair}
                cancelText="Cancel"
                confirmText={unpairing ? "Unpairing…" : "Unpair Device"}
                disabled={unpairing}
                danger
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* =========================================================
 * MODAL HEADER
 * ======================================================= */

function ModalHeader({ title, text, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">{title}</h2>
        <p className="mt-1.5 text-sm leading-5 text-[var(--color-text-secondary)]">
          {text}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
      >
        <FiX className="text-xl" />
      </button>
    </div>
  );
}

/* =========================================================
 * MODAL BUTTONS
 * ======================================================= */

function ModalButtons({
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  disabled,
  danger = false,
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-text-muted)] hover:bg-[var(--color-border)] disabled:opacity-50"
      >
        {cancelText}
      </button>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className={`rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          danger
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-teal-500 text-white hover:bg-teal-600"
        }`}
      >
        {confirmText}
      </button>
    </div>
  );
}
