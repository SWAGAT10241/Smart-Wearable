import Sidebar from "../Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-[var(--page-section-gap)] p-[var(--page-padding-mobile)] sm:p-[var(--page-padding-tablet)] lg:p-[var(--page-padding-desktop)]">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
