import { Sparkline } from "./Sparkline";

export function ChartCard({
  title,
  value,
  unit = "",
  trend,
  data = [],
  color = "#10b981",
  icon: Icon,
  badgeText,
  badgeClass = "bg-slate-800 text-slate-300",
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: `${color}15`, color }}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
            <span className="text-sm font-medium text-slate-400">{title}</span>
          </div>
          {badgeText && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            {value != null ? value : "—"}
          </span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-end justify-between">
        <div>
          {trend && (
            <span className="text-xs text-slate-400 font-medium">
              {trend}
            </span>
          )}
        </div>
        <Sparkline data={data} color={color} width={100} height={32} />
      </div>
    </div>
  );
}

export default ChartCard;
