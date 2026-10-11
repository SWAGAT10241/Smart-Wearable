import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";
import { getSeverityColor } from "../../utils/metrics";

export function RecentEventsCard({ falls = [], onDismissFall, activeFall, className = "" }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white">Recent Safety Incidents</h3>
        </div>
        <span className="text-xs text-slate-500">{falls.length} Recorded</span>
      </div>

      {activeFall && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-bold text-red-200">FALL DETECTED NOW</span>
              <p className="text-xs text-red-300/80 mt-0.5">
                Immediate attention required. Emergency contacts notified.
              </p>
            </div>
          </div>
          <button
            onClick={() => onDismissFall?.(activeFall._id)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-72 pr-1">
        {falls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
            <p className="text-sm">No safety incidents recorded.</p>
          </div>
        ) : (
          falls.slice(0, 10).map((fall) => (
            <div
              key={fall._id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium uppercase border ${getSeverityColor(
                    fall.severity,
                  )}`}
                >
                  {fall.severity || "Fall"}
                </span>
                <span className="text-slate-300 font-medium">
                  Status: {fall.status || "detected"}
                </span>
              </div>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDateTime(fall.timestamp || fall.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentEventsCard;
