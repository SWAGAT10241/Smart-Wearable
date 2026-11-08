import NotificationBell from "../app/NotificationBell";
import ProfileMenu from "../app/ProfileMenu";

export default function DashboardHeader({ user, selectedDevice, notifications = [] }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 px-1 py-1">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="tg-page-title truncate">
            Welcome back, {user?.username || "Explorer"}
          </h1>

          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        <p className="tg-page-subtitle truncate">
          {selectedDevice
            ? `${selectedDevice.deviceName || selectedDevice.name || "Wearable"} · Active tracking`
            : "No device selected"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <NotificationBell notifications={notifications} />
        <ProfileMenu />
      </div>
    </header>
  );
}
