export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-[var(--card-radius-expanded)]
        border border-[var(--border-default)]
        bg-[var(--surface-card)]/90
        p-[var(--card-padding-expanded)]
        shadow-[var(--shadow-card-lg)]
        backdrop-blur-2xl
        text-[var(--text-primary)]
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
