import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="flex h-[400px] sm:h-[420px] flex-col rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Live Location
        </h2>

        <span className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
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

      <div className="min-h-0 flex-1 overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-inner">
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
