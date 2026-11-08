import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-white/[0.04]">
      {/* Top subtle highlight rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Subtle ambient radar glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl"
        style={{ background: hasLocation ? "var(--status-optimal)" : "var(--status-warning)" }}
      />

      <div className="mb-3.5 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-emerald-500/10 text-emerald-400">
            <span className="text-sm">📍</span>
          </div>
          <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-text)]">
            Live Location
          </h2>
        </div>

        <span className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] shadow-xs">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                hasLocation ? "animate-ping bg-emerald-400" : "bg-slate-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                hasLocation ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
          </span>
          {locationUpdatedText}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-inner">
        <LiveMap
          latitude={loc?.latitude}
          longitude={loc?.longitude}
          trail={trail}
        />
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2 font-mono text-xs font-semibold text-[var(--color-text-secondary)]">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Coordinates</span>
        <span className="text-[13px] font-bold text-[var(--color-text)]">
          {hasLocation
            ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}`
            : "--, --"}
        </span>
      </div>
    </section>
  );
}
