import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="flex h-[400px] sm:h-[420px] flex-col rounded-[var(--card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)] shadow-[var(--shadow-card)]">
      <div className="mb-[var(--space-3)] flex shrink-0 items-center justify-between">
        <h2 className="text-[var(--font-size-md)] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Live Location
        </h2>

        <span className="flex items-center gap-[var(--space-2)] text-xs font-medium text-[var(--color-text-secondary)]">
          <span
            className={`h-2 w-2 rounded-full ${
              hasLocation ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {locationUpdatedText}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <LiveMap
          latitude={loc?.latitude}
          longitude={loc?.longitude}
          trail={trail}
        />
      </div>

      <div className="mt-[var(--space-3)] shrink-0 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-[var(--space-4)] py-[var(--space-2)] font-mono text-sm font-semibold text-[var(--color-text-secondary)]">
        {hasLocation
          ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}`
          : "--, --"}
      </div>
    </section>
  );
}
