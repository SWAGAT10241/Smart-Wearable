export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="flex flex-col rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Recent Events
        </h2>

        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]">
          {recentFalls.length} today
        </span>
      </div>

      <div className="h-[340px] sm:h-[385px] overflow-y-auto pr-1">
        {recentFalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 p-6 text-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-lg font-bold">
              ✓
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--color-text)]">
                No fall events detected
              </div>

              <div className="mt-1 text-xs text-emerald-400">
                Safe operational status
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recentFalls.map((fall) => (
              <div
                key={fall._id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 transition hover:border-[var(--color-accent)]/40"
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

                    <div className="mt-0.5 text-xs capitalize text-[var(--color-text-secondary)]">
                      {fall.severity} fall
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
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
