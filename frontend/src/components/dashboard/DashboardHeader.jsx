import NotificationBell from "../app/NotificationBell";
import ProfileMenu from "../app/ProfileMenu";

export default function DashboardHeader({ user, selectedDevice, notifications = [] }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 px-1">
      <div className="min-w-0">
        <h1 className="truncate text-[26px] font-bold tracking-[-0.03em] text-[var(--color-text)]">
          Welcome back, {user?.username || "User"}! 👋
        </h1>

        <p className="mt-0.5 text-[14px] text-[var(--color-text-secondary)]">
          {selectedDevice
            ? `${selectedDevice.deviceName || selectedDevice.name || "TrailGuard Wearable"} · Your trail overview for today.`
            : "No device selected."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <NotificationBell notifications={notifications} />
        <ProfileMenu />
      </div>
    </header>
  );
}
