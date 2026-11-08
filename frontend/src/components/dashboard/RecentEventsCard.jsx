import React from "react";

/**
 * Minimalist high-density tactical RecentEventsCard.
 * High information density audit of fall events with severity indicators and timestamps.
 */
export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="group relative flex h-full min-h-[410px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
      {/* Tactical Top Accent Indicator */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{
          background: recentFalls.length > 0
            ? "linear-gradient(90deg, var(--status-sos), transparent 60%)"
            : "linear-gradient(90deg, var(--status-optimal), transparent 60%)",
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 bg-[var(--surface-warning)] text-xs text-[var(--status-warning)]">
            <span>⚡</span>
          </div>
          <h2 className="font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--color-text)]">
            INCIDENT LOG
          </h2>
        </div>

        <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--color-text-secondary)]">
          {recentFalls.length} DETECTED
        </span>
      </div>

      {/* High-density Events List */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {recentFalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 text-center font-mono">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-accent)] text-[var(--status-optimal)] text-base font-bold">
              ✓
            </div>

            <div>
              <div className="text-xs font-bold text-[var(--color-text)]">
                NO CRITICAL INCIDENTS
              </div>

              <div className="mt-0.5 text-[10px] text-[var(--status-optimal)]">
                ALL SYSTEMS OPERATING NOMINALLY
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recentFalls.map((fall) => (
              <div
                key={fall._id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-2.5 transition-all hover:border-[var(--color-accent)]/50"
              >
                <div className="flex items-start justify-between gap-2 font-mono">
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[var(--color-text)]">
                      {new Date(fall.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-0.5 text-[10px] uppercase text-[var(--color-text-secondary)]">
                      {fall.severity} FALL EVENT
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      fall.severity === "severe"
                        ? "bg-red-500/15 text-red-500 border-red-500/30"
                        : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {fall.status?.replace(/_/g, " ") || "LOGGED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
