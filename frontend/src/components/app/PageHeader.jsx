export default function PageHeader({ title, subtitle, right, children }) {
  return (
    <header className="flex flex-col gap-[var(--card-gap)] rounded-[var(--card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)] shadow-[var(--shadow-card)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          {title}
        </h1>

        {(subtitle || children) && (
          <div className="mt-[var(--space-1)] text-sm text-[var(--color-text-secondary)]">
            {subtitle}
            {children}
          </div>
        )}
      </div>

      {right}
    </header>
  );
}
