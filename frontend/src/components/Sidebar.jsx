import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLink, FiX } from "react-icons/fi";
import { HiOutlineSquares2X2, HiOutlineInformationCircle } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

import { useDevices } from "../context/DeviceContext";
import loginBackground from "../assets/images/login-background.png";
import { maskDeviceId } from "../utils/masking";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "/history", label: "History", icon: MdHistory },
  { to: "/settings", label: "Settings", icon: FiSettings },
  { to: "/about", label: "About", icon: HiOutlineInformationCircle },
];

export default function Sidebar() {
  const { selectedDevice, removeDevice } = useDevices();
  const navigate = useNavigate();

  const [showUnpairModal, setShowUnpairModal] = useState(false);
  const [unpairing, setUnpairing] = useState(false);

  useEffect(() => {
    if (!showUnpairModal) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [showUnpairModal]);

  const deviceName =
    selectedDevice?.deviceName || selectedDevice?.name || "TrailGuard Wearable";

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
    navigate("/settings");
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="relative hidden min-h-screen w-[var(--sidebar-width)] shrink-0 overflow-hidden border-r border-[var(--brand-navy-card-border)] bg-[var(--brand-navy)] lg:flex lg:flex-col">
        {/* ATMOSPHERIC BACKGROUND WITH MOUNTAIN SILHOUETTE */}
        <div className="absolute inset-0 bg-[var(--brand-navy)]" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-cover bg-bottom opacity-85"
          style={{ backgroundImage: `url(${loginBackground})` }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
          style={{
            background:
              "linear-gradient(to bottom, var(--brand-navy) 0%, rgba(6,27,45,.97) 20%, rgba(6,27,45,.88) 45%, rgba(6,27,45,.62) 72%, rgba(6,27,45,.78) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[var(--brand-navy-deep)]/10" />

        <div className="relative z-10 flex min-h-screen flex-col px-4 py-5">
          {/* LOGO & BRAND IDENTITY */}
          <div className="mb-8 flex items-center gap-2.5 px-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-400/15 shadow-sm">
              🛡
            </span>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Trail<span className="text-[var(--brand-teal)]">Guard</span>
              </span>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                viewTransition
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border border-teal-500/30 bg-[var(--brand-teal-subtle)] font-semibold text-[var(--brand-teal-light)] shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="shrink-0 text-[20px]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* DEVICE & SAFETY CARDS */}
          <div className="mt-6 space-y-3">
            {/* SAFETY */}
            <div className="rounded-2xl border border-white/10 bg-[var(--brand-navy-card-bg)] p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-400/15 text-teal-300">
                  🛡
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-white">
                    Stay safe. Explore more.
                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-300">
                    TrailGuard is watching
                    <br />
                    over you.
                  </p>
                </div>
              </div>
            </div>

            {/* DEVICE */}
            <div className="rounded-2xl border border-white/10 bg-[var(--brand-navy-card-bg)] p-4 shadow-lg backdrop-blur-sm">
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

                      <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                        {maskDeviceId(selectedDevice.deviceId)}
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
                        Pair using the QR and Bluetooth flow in Settings.
                      </p>
                    </div>

                    <FiLink className="text-[18px] text-slate-500" />
                  </div>

                  <button
                    type="button"
                    onClick={openPairModal}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-teal)] px-3 py-2 text-[11px] font-semibold text-[var(--brand-navy-text)] transition hover:bg-[var(--brand-teal-hover)]"
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
      {showUnpairModal && (
        <div className="tg-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-[2px]">
          {/* UNPAIR MODAL */}
          {showUnpairModal && selectedDevice && (
            <div className="tg-modal-card w-full max-w-[440px] rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl">
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
