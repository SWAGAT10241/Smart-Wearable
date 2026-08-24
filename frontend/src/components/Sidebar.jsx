import { NavLink } from "react-router-dom";
import { FaBluetooth } from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import loginBackground from "../assets/images/login-background.png";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: HiOutlineSquares2X2,
  },
  {
    to: "/history",
    label: "History",
    icon: MdHistory,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: FiSettings,
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const connected = Boolean(user?.deviceId);

  return (
    <aside className="relative hidden min-h-screen w-[250px] shrink-0 overflow-hidden bg-[#061B2D] lg:flex lg:flex-col">
      {/* =========================================================
          SIDEBAR BACKGROUND
          ========================================================= */}

      {/* Base dark navy */}
      <div className="absolute inset-0 bg-[#061B2D]" />

      {/* Mountain image — visible mainly at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[52%] bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      />

      {/* Fade image into dark navy */}
      <div
        className="absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            "linear-gradient(to bottom, #061B2D 0%, rgba(6,27,45,0.97) 20%, rgba(6,27,45,0.88) 45%, rgba(6,27,45,0.62) 72%, rgba(6,27,45,0.78) 100%)",
        }}
      />

      {/* Very subtle overall dark tint */}
      <div className="absolute inset-0 bg-[#031827]/10" />

      {/* =========================================================
          CONTENT
          ========================================================= */}

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-5">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-400/15">
            🛡
          </span>

          <span className="text-xl font-semibold text-white">
            Trail<span className="text-[#2DD4BF]">Guard</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#0E9C8C]/30 text-[#42E3D0] shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="shrink-0 text-[20px]" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* =========================================================
    BOTTOM SECTION
    ========================================================= */}

        {/* Banners below navigation */}
<div className="mt-5 space-y-3">

  {/* Stay safe banner */}
  <div className="rounded-2xl border border-white/10 bg-[#102F4A]/65 p-4 shadow-lg backdrop-blur-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-400/15">
        🛡
      </div>

      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-white">
          Stay safe. Explore more.
        </div>

        <p className="mt-1 text-[10px] leading-4 text-slate-400">
          TrailGuard is watching
          <br />
          over you.
        </p>
      </div>
    </div>
  </div>

  {/* Device banner */}
  <div className="rounded-2xl border border-white/10 bg-[#102F4A]/65 p-4 shadow-lg backdrop-blur-sm">
    <div className="flex items-center justify-between gap-3">

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              connected
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]"
                : "bg-slate-500"
            }`}
          />

          <span className="text-[12px] font-semibold text-white">
            {connected
              ? "Device connected"
              : "No device connected"}
          </span>
        </div>

        {connected && (
          <p className="mt-1 truncate pl-4 text-[10px] text-slate-400">
            {user.deviceId}
          </p>
        )}
      </div>

      <FaBluetooth
        className={`shrink-0 text-[18px] ${
          connected
            ? "text-slate-200"
            : "text-slate-600"
        }`}
      />

    </div>
  </div>

</div>
      </div>
    </aside>
  );
}
