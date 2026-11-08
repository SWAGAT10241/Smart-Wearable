import NotificationBell from "../app/NotificationBell";
import ProfileMenu from "../app/ProfileMenu";

/**
 * Minimalist high-density tactical DashboardHeader.
 * Displays user identity, connected hardware device link status, and tactical system pill.
 */
export default function DashboardHeader({ user, selectedDevice, notifications = [] }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 px-0.5 py-1">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="truncate text-xl font-black tracking-tight text-[var(--color-text)] sm:text-2xl font-mono">
            COMMAND / {user?.username ? user.username.toUpperCase() : "OPERATOR"}
          </h1>

          <span className="hidden items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--status-optimal)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-optimal)] animate-pulse" />
            TELEMETRY ONLINE
          </span>
        </div>

        <p className="mt-0.5 font-mono text-xs text-[var(--color-text-secondary)]">
          {selectedDevice
            ? `DEVICE: ${selectedDevice.deviceName || selectedDevice.name || "ESP32-S3"} · PROTOCOL: BLE/WS · ACTIVE MONITORING`
            : "STANDBY · NO ACTIVE HARDWARE DEVICE LINKED"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <NotificationBell notifications={notifications} />
        <ProfileMenu />
      </div>
    </header>
  );
}
