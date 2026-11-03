import Sidebar from "../Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-6 p-5 pb-24 sm:p-6 sm:pb-24 lg:p-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
