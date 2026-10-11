import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorMessage({ title = "Error", message, onRetry, className = "" }) {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 ${className}`}>
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold text-red-300">{title}</h4>}
        <p className="text-sm text-red-300/80 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 p-1.5 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
          title="Retry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
