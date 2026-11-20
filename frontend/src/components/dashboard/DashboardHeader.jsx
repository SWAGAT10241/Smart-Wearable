import NotificationBell from "../app/NotificationBell";
import ProfileMenu from "../app/ProfileMenu";
import useUpdatedTime from "../../hooks/useUpdatedTime";

export default function DashboardHeader({
  user,
  selectedDevice,
  lastSeen,
  notifications = [],
}) {
  const isArmed = Boolean(selectedDevice);
  const effectiveLastSeen = lastSeen || selectedDevice?.lastSeen;
  const lastSeenText = useUpdatedTime(effectiveLastSeen);

  return (
    <header className="flex shrink-0 items-center justify-between gap-[var(--space-4)] px-[var(--dash-header-padding-x)]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-[var(--space-3)]">
          <h1 className="truncate text-[var(--font-size-2xl)] font-bold tracking-[-0.03em] text-[var(--color-text)]">
            Welcome back, {user?.username || "User"}! 👋
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

        <p className="mt-[var(--space-0-5)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          {selectedDevice
            ? `${selectedDevice.deviceName || selectedDevice.name || "TrailGuard Wearable"} · Live trail telemetry and incident monitoring.`
            : "No device selected · Pair your wearable in Settings."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[var(--space-4)]">
        <NotificationBell notifications={notifications} />
        <ProfileMenu />
      </div>
    </header>
  );
}
