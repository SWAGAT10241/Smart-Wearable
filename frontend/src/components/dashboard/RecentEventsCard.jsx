export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="flex min-h-0 flex-col rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          Recent Events
        </h2>

        <button
          type="button"
          className="text-xs font-medium text-[var(--color-accent-dark)] transition hover:opacity-80"
        >
          View all
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {recentFalls.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/40 bg-emerald-500/10 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              ✓
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--color-text)]">
                No fall events today
              </div>

              <div className="mt-0.5 text-xs text-emerald-400">
                All clear
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentFalls.map((fall) => (
              <div
                key={fall._id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 transition hover:border-[var(--color-accent)]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text)]">
                      {new Date(fall.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-1 text-xs capitalize text-[var(--color-text-secondary)]">
                      {fall.severity} fall
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[var(--color-border)] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {fall.status?.replace(/_/g, " ") || "UNKNOWN"}
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
