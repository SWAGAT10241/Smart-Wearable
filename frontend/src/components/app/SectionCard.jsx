export default function SectionCard({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        rounded-[24px]
        border border-slate-200
        bg-white
        p-5
        shadow-[var(--shadow-card)]
        ${className}
      `}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          {title}
        </h3>
      )}

      {children}
    </section>
  );
}