import LiveMap from "../LiveMap";

/**
 * Minimalist high-density tactical LiveLocationCard.
 * Features corner coordinates, map style controls, and real-time GPS telemetry radar.
 */
export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="group relative flex h-full min-h-[410px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
      {/* Tactical Top Accent Indicator */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{
          background: hasLocation
            ? "linear-gradient(90deg, var(--status-optimal), transparent 60%)"
            : "linear-gradient(90deg, var(--status-warning), transparent 60%)",
        }}
      />

      {/* Subtle Tactical Corner Crosshairs */}
      <span className="pointer-events-none absolute top-1.5 right-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[8px] text-[var(--color-text-muted)] select-none opacity-30">
        +
      </span>

      {/* Header Deck */}
      <div className="mb-2.5 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 bg-[var(--surface-accent)] text-xs text-[var(--status-optimal)]">
            <span>📍</span>
          </div>
          <h2 className="font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--color-text)]">
            LIVE GPS COORDINATES
          </h2>
        </div>

        <span className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-text-secondary)]">
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

      {/* High-density Map Viewport */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-inner">
        <LiveMap
          latitude={loc?.latitude}
          longitude={loc?.longitude}
          trail={trail}
        />
      </div>

      {/* Monospace Tactical Coordinates Footer */}
      <div className="mt-2.5 flex shrink-0 items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)]/80 px-3 py-1.5 font-mono text-xs">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          LAT / LNG
        </span>
        <span className="font-mono text-[12px] font-bold tracking-tight text-[var(--color-text)] tabular-nums">
          {hasLocation
            ? `${Number(loc.latitude).toFixed(5)}°N, ${Number(loc.longitude).toFixed(5)}°E`
            : "--, --"}
        </span>
      </div>
    </section>
  );
}
