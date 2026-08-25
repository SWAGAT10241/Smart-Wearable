export default function PageHeader({
  title,
  subtitle,
  right,
  children,
}) {
  return (
    <header className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </h1>

        {(subtitle || children) && (
          <div className="mt-1 text-sm text-slate-500">
            {subtitle}
            {children}
          </div>
        )}
      </div>

      {right}
    </header>
  );
}