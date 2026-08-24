import { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);

  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative">
      {/* Bell */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:shadow-sm"
      >
        <IoIosNotificationsOutline size={28} />

        {/* Red notification dot */}
        {hasNotifications && (
          <span className="absolute right-[7px] top-[6px] flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />

            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#f5f8fa] bg-red-500" />
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">
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
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <IoIosNotificationsOutline
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <p className="text-sm font-medium text-slate-700">
                You're all caught up
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No new notifications.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      ⚠
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {notification.message}
                      </p>

                      {notification.time && (
                        <p className="mt-1 text-[10px] text-slate-400">
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
