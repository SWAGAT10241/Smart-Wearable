export default function LoadingSpinner({
  size = "md",
  className = "",
  label = "Loading...",
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-teal-500 border-t-transparent ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      {label && (
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          {label}
        </span>
      )}
    </div>
  );
}
