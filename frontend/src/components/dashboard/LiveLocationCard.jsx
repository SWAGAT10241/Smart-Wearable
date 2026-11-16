import { useState } from "react";
import { IoCopyOutline, IoCheckmarkOutline } from "react-icons/io5";
import LiveMap from "../LiveMap";

export default function LiveLocationCard({ loc, trail, hasLocation, locationUpdatedText }) {
  const [copied, setCopied] = useState(false);

  const coordsText = hasLocation
    ? `${Number(loc.latitude).toFixed(5)}, ${Number(loc.longitude).toFixed(5)}`
    : "--, --";

  const handleCopy = async () => {
    if (!hasLocation) return;
    try {
      await navigator.clipboard.writeText(coordsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is blocked
    }
  };

  return (
    <section className="flex h-full min-h-[var(--dash-card-min-height)] flex-col rounded-[var(--card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)] shadow-[var(--shadow-card)]">
      <div className="mb-[var(--space-3)] flex shrink-0 items-center justify-between">
        <h2 className="text-[var(--font-size-md)] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Live Location
        </h2>

        <span className="flex items-center gap-[var(--space-2)] text-xs font-medium text-[var(--color-text-secondary)]">
          <span
            className={`h-[var(--dash-range-dot-size)] w-[var(--dash-range-dot-size)] rounded-full ${
              hasLocation ? "bg-[var(--status-optimal)]" : "bg-[var(--text-muted)]"
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

      <div className="mt-[var(--space-3)] flex shrink-0 items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-[var(--space-4)] py-[var(--space-2)]">
        <span className="font-mono text-sm font-semibold text-[var(--color-text-secondary)]">
          {coordsText}
        </span>

        {hasLocation && (
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-[var(--space-1-5)] rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--font-size-xs)] font-medium transition-colors ${
              copied
                ? "bg-[var(--status-optimal)]/15 text-[var(--status-optimal)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-text)]"
            }`}
            aria-label="Copy coordinates to clipboard"
            title="Copy coordinates to clipboard"
          >
            {copied ? (
              <>
                <IoCheckmarkOutline className="text-sm text-[var(--status-optimal)]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <IoCopyOutline className="text-sm" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
