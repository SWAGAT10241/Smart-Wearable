export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-white/[0.04]">
      {/* Top subtle highlight rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mb-3.5 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-amber-500/10 text-amber-400">
            <span className="text-sm">⚡</span>
          </div>
          <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-text)]">
            Recent Events
          </h2>
        </div>

        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 font-mono text-[11px] font-semibold text-[var(--color-text-secondary)] shadow-xs">
          {recentFalls.length} today
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {recentFalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 text-xl font-bold shadow-xs">
              ✓
            </div>

            <div>
              <div className="text-sm font-bold text-[var(--color-text)]">
                No fall events detected
              </div>

              <div className="mt-1 text-xs font-medium text-emerald-400">
                Safe operational telemetry status
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentFalls.map((fall) => (
              <div
                key={fall._id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3.5 transition-all hover:border-[var(--color-accent)]/40 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)]">
                      {new Date(fall.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-0.5 text-xs font-medium capitalize text-[var(--color-text-secondary)]">
                      {fall.severity} fall
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      fall.severity === "severe"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {fall.status?.replace(/_/g, " ") || "DETECTED"}
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
