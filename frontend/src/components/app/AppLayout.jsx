import Sidebar from "../Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Topographic Elevation Mesh Canvas */}
      <div
        className="pointer-events-none fixed inset-0 z-0 tg-topographic-mesh"
        aria-hidden="true"
      />

      <Sidebar />

      <main className="relative z-10 flex min-w-0 flex-1 flex-col gap-[var(--page-section-gap)] p-[var(--page-padding-mobile)] sm:p-[var(--page-padding-tablet)] lg:p-[var(--page-padding-desktop)]">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
