export function InfoRow({ label, value, hint, className = "" }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0 ${className}`}>
      <span className="text-sm text-slate-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-white">{value}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

export default InfoRow;
