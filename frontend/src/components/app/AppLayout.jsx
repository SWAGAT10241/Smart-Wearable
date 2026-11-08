import Sidebar from "../Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-4 p-3.5 sm:p-5 lg:p-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
