import { Activity, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dashboard", Icon: Activity },
  { to: "/history", label: "History", Icon: History },
  { to: "/settings", label: "Settings", Icon: Settings },
];

export default function MobileNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-around border-t border-[var(--color-border)] bg-[color:var(--color-surface)]/95 px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_28px_rgba(16,42,67,0.08)] backdrop-blur lg:hidden"
    >
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold transition ${
              isActive
                ? "bg-teal-400/10 text-teal-700"
                : "text-[var(--color-text-muted)]"
            }`
          }
        >
          <Icon aria-hidden="true" size={20} strokeWidth={2.25} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
