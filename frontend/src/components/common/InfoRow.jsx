export default function InfoRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-3 text-sm">
      <span className="font-medium text-[var(--color-text-secondary)]">{label}</span>
      <span className="flex items-center gap-2 text-right text-[var(--color-text)]">
        {value}
        {badge && (
          <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-400">
            {badge}
          </span>
        )}
      </span>
    </div>
  );
}
