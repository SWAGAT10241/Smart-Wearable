export default function SectionCard({ title, children, className = "" }) {
  return (
    <section
      className={`
        rounded-[var(--card-radius)]
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-[var(--card-padding)]
        shadow-[var(--shadow-card)]
        
        ${className}
      `}
    >
      {title && (
        <h3 className="mb-[var(--card-gap)] text-lg font-semibold text-slate-900">{title}</h3>
      )}

      {children}
    </section>
  );
}
