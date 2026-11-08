import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="tg-card h-full min-h-[410px]">
      {/* Top Accent Stroke */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{
          background: hasLocation
            ? "linear-gradient(90deg, var(--status-optimal), transparent 65%)"
            : "linear-gradient(90deg, var(--status-warning), transparent 65%)",
        }}
      />

      {/* Header Deck */}
      <div className="tg-card-header">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 bg-[var(--surface-accent)] text-xs text-[var(--status-optimal)]">
            <span>📍</span>
          </div>
          <h2 className="tg-card-title">
            Live Location
          </h2>
        </div>

        <span className={`tg-badge ${hasLocation ? "tg-badge-optimal" : "tg-badge-warning"}`}>
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                hasLocation ? "animate-ping bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                hasLocation ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          {locationUpdatedText}
        </span>
      </div>

      {/* Map Viewport */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-inner">
        <LiveMap
          latitude={loc?.latitude}
          longitude={loc?.longitude}
          trail={trail}
        />
      </div>

      {/* Coordinates Footer */}
      <div className="mt-2.5 flex shrink-0 items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)]/80 px-3 py-1.5 font-mono text-xs">
        <span className="text-[11px] text-[var(--color-text-muted)]">
          Coordinates
        </span>
        <span className="font-bold tracking-tight text-[var(--color-text)] tabular-nums">
          {hasLocation
            ? `${Number(loc.latitude).toFixed(4)}° N, ${Number(loc.longitude).toFixed(4)}° E`
            : "No signal"}
        </span>
      </div>
    </section>
  );
}
