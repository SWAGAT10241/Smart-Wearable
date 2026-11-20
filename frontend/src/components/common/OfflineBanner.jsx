import { useState, useEffect } from "react";
import { IoCloudOfflineOutline } from "react-icons/io5";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" && !navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-sm animate-fadeIn">
      <div className="flex items-center gap-2">
        <IoCloudOfflineOutline className="h-4 w-4 shrink-0 text-amber-500" />
        <span>
          Basecamp Offline Mode Active · Cached telemetry and local controls available
        </span>
      </div>
      <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
        PWA Cached
      </span>
    </div>
  );
}
