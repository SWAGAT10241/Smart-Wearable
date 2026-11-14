export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-[var(--card-radius-expanded)]
        border border-[var(--color-border)]
        bg-[var(--color-surface)]/[0.78]
        p-[var(--card-padding-expanded)]
        shadow-[0_20px_60px_rgba(7,28,46,0.22)]
        backdrop-blur-xl
        sm:p-[var(--space-9)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}