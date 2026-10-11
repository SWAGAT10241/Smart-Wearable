import { Navigation, MapPin } from "lucide-react";
import LiveMap from "../LiveMap";
import { formatCoordinates, formatTimeAgo } from "../../utils/formatters";

export function LiveLocationCard({ location, className = "" }) {
  const hasCoordinates = location?.latitude != null && location?.longitude != null;

  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col ${className}`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Location</h3>
            <p className="text-xs text-slate-400">
              {hasCoordinates
                ? formatCoordinates(location.latitude, location.longitude)
                : "Awaiting GPS satellite signal"}
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Updated: {formatTimeAgo(location?.timestamp || location?.createdAt)}
        </span>
      </div>

      <div className="h-64 sm:h-80 w-full relative">
        <LiveMap location={location} />
      </div>
    </div>
  );
}

export default LiveLocationCard;
