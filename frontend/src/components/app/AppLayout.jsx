import Sidebar from "../Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <Sidebar />

      <main className=" flex min-w-0 flex-1 flex-col gap-6 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
