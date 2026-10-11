import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  return (
    <section className="flex min-h-0 flex-col rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Live Location
        </h2>

        <span className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <span
            className={`h-2 w-2 rounded-full ${
              hasLocation ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {locationUpdatedText}
        </span>
      </div>

      <div className="min-h-[220px] flex-1 overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <LiveMap
          latitude={loc?.latitude}
          longitude={loc?.longitude}
          trail={trail}
        />
      </div>

      <div className="mt-2 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-secondary)]">
        {hasLocation
          ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}`
          : "--, --"}
      </div>
    </section>
  );
}
