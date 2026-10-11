import { Loader2 } from "lucide-react";

export function LoadingSpinner({ message = "Loading...", size = "default", className = "" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-slate-400 gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-emerald-500 ${sizeClasses[size] || sizeClasses.default}`} />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
