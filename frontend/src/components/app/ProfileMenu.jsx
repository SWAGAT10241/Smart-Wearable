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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const username = user?.username || "User";
  const email = user?.email || "";

  return (
    <div ref={menuRef} className="relative">
      {/* Profile button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      >
        {/* Avatar */}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#b7f3df,#15967f)] text-sm font-bold text-white shadow-inner">
          {username.charAt(0).toUpperCase()}
        </span>

        {/* Name */}
        <span className="hidden text-left sm:block">
          <span className="block max-w-[130px] truncate text-sm font-semibold text-slate-800">
            {username}
          </span>

          <span className="block max-w-[130px] truncate text-[11px] text-slate-400">
            {email}
          </span>
        </span>

        <FiChevronDown
          className={`text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

          {/* Profile information */}
          <div className="border-b border-slate-100 px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#b7f3df,#15967f)] font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {username}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <FiUser className="text-[18px] text-slate-500" />
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <FiSettings className="text-[18px] text-slate-500" />
              Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
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