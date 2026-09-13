import { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative flex h-10 w-10 items-center justify-center
          rounded-full text-[var(--color-text-secondary)]
          transition hover:bg-[var(--color-surface)]
          hover:shadow-sm
        "
      >
        <IoIosNotificationsOutline size={28} />

        {hasNotifications && (
          <span className="absolute right-[7px] top-[6px] flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-red-500" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-12 z-50 w-[340px]
            overflow-hidden rounded-2xl
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            shadow-xl
          "
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Notifications
            </h3>

            {hasNotifications && (
              <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                {notifications.length} new
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-alt)]">
                <IoIosNotificationsOutline
                  size={22}
                  className="text-[var(--color-text-muted)]"
                />
              </div>

              <p className="text-sm font-medium text-[var(--color-text)]">
                You're all caught up
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                No new notifications.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="
                    border-b border-[var(--color-border)]
                    px-4 py-3 transition
                    hover:bg-[var(--color-surface-alt)]
                  "
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      ⚠
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                        {notification.message}
                      </p>

                      {notification.time && (
                        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                          {notification.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
