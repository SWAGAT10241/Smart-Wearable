import React from "react";

export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="tg-card h-full min-h-[410px]">
      {/* Top Accent Stroke */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{
          background: recentFalls.length > 0
            ? "linear-gradient(90deg, var(--status-sos), transparent 65%)"
            : "linear-gradient(90deg, var(--status-optimal), transparent 65%)",
        }}
      />

      {/* Header Deck */}
      <div className="tg-card-header">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 dark:border-white/10 bg-[var(--surface-warning)] text-xs text-[var(--status-warning)]">
            <span>⚡</span>
          </div>
          <h2 className="tg-card-title">
            Incident Log
          </h2>
        </div>

        <span className="tg-badge tg-badge-neutral font-mono text-[11px]">
          {recentFalls.length} today
        </span>
      </div>

      {/* Events List */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {recentFalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 text-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-accent)] text-[var(--status-optimal)] text-base font-bold">
              ✓
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--color-text)]">
                No incidents detected
              </div>

              <div className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                All systems operating normally
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
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--color-text)]">
                      {new Date(fall.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-0.5 text-xs capitalize text-[var(--color-text-secondary)]">
                      {fall.severity} fall event
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
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
