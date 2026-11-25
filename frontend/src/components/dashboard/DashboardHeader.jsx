import { useState, useEffect } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import NotificationBell from "../app/NotificationBell";
import SearchModal from "../common/SearchModal";
import useUpdatedTime from "../../hooks/useUpdatedTime";

export default function DashboardHeader({
  user,
  selectedDevice,
  lastSeen,
  notifications = [],
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isArmed = Boolean(selectedDevice);
  const effectiveLastSeen = lastSeen || selectedDevice?.lastSeen;
  const lastSeenText = useUpdatedTime(effectiveLastSeen);

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-[var(--space-4)] px-[var(--dash-header-padding-x)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[var(--space-3)]">
            <h1 className="truncate text-2xl font-extrabold tracking-[-0.03em] text-[var(--color-text)]">
              Mission Operations Overview
            </h1>

            <div className="flex items-center gap-[var(--dash-status-group-gap)]">
              <div className="inline-flex items-center gap-[var(--space-1-5)] rounded-full border border-[var(--status-optimal)]/30 bg-[var(--status-optimal)]/10 px-[var(--dash-badge-padding-x)] py-[var(--dash-badge-padding-y)] text-[var(--dash-badge-text-size)] font-bold tracking-wider text-[var(--status-optimal)] shadow-sm">
                <span className="relative flex h-[var(--dash-status-dot-size)] w-[var(--dash-status-dot-size)]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-optimal)] opacity-75" />
                  <span className="relative inline-flex h-[var(--dash-status-dot-size)] w-[var(--dash-status-dot-size)] rounded-full bg-[var(--status-optimal)]" />
                </span>
                <span>{isArmed ? "INCIDENT DETECTION ARMED" : "STANDBY"}</span>
              </div>

              {isArmed && effectiveLastSeen && (
                <span className="hidden sm:inline-flex items-center gap-[var(--space-1)] text-[var(--font-size-xs)] font-mono text-[var(--color-text-muted)]">
                  <span className="h-[var(--dash-status-dot-size)] w-[var(--dash-status-dot-size)] rounded-full bg-[var(--status-optimal)]" />
                  Last sync: {lastSeenText || "Just now"}
                </span>
              )}
            </div>
          </div>

          <p className="mt-[var(--space-0-5)] text-sm text-[var(--color-text-secondary)] font-medium">
            {selectedDevice
              ? `${selectedDevice.deviceName || selectedDevice.name || "TrailGuard Wearable"} · Live trail telemetry and incident monitoring.`
              : "No device selected · Pair your wearable in Settings."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-[var(--space-3)]">
          {/* Top Header Command Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Search incidents, actions, navigation (⌘K)"
            className="hidden md:flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3.5 py-2 text-xs text-[var(--color-text-secondary)] shadow-sm transition hover:border-teal-500/40 hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] cursor-pointer"
          >
            <HiOutlineMagnifyingGlass className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Quick search or command…</span>
            <kbd className="ml-2 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)] font-semibold">
              ⌘K
            </kbd>
          </button>

          <NotificationBell notifications={notifications} />
        </div>
      </header>

      {/* Global Interactive Command Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
