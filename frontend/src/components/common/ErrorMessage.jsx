export default function ErrorMessage({
  title = "Error",
  message,
  onRetry,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-red-200">{title}</h4>
            <p className="mt-1 text-xs text-red-300/80">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/30 transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
