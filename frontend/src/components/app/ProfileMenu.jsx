import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const username = user?.username || "User";
  const email = user?.email || "";

  const menuClass =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-alt)]";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex items-center gap-3 rounded-full
          border border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-2.5 py-2 shadow-sm transition
          hover:border-[var(--color-accent)]
          hover:shadow-md
        "
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#b7f3df,#15967f)] text-sm font-bold text-white shadow-inner">
          {username.charAt(0).toUpperCase()}
        </span>

        <span className="hidden text-left sm:block">
          <span className="block max-w-[130px] truncate text-sm font-semibold text-[var(--color-text)]">
            {username}
          </span>
          <span className="block max-w-[130px] truncate text-[11px] text-[var(--color-text-muted)]">
            {email}
          </span>
        </span>

        <FiChevronDown
          className={`text-[var(--color-text-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="
          absolute right-0 top-[calc(100%+10px)] z-50 w-60
          overflow-hidden rounded-2xl
          border border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-2 shadow-xl
        ">
          <div className="border-b border-[var(--color-border)] px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#b7f3df,#15967f)] font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {username}
                </p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <FiUser className="text-[18px] text-[var(--color-text-muted)]" />
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className={menuClass}
            >
              <FiSettings className="text-[18px] text-[var(--color-text-muted)]" />
              Settings
            </Link>
          </div>

          <div className="border-t border-[var(--color-border)] pt-1">
            <button
              type="button"
              onClick={logout}
              className="
                flex w-full items-center gap-3 rounded-xl
                px-3 py-2.5 text-sm text-red-500 transition
                hover:bg-red-50
              "
            >
              <FiLogOut className="text-[18px]" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}