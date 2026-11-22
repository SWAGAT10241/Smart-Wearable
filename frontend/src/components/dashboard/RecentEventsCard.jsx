export default function RecentEventsCard({ recentFalls = [] }) {
  return (
    <section className="flex h-full min-h-[var(--dash-card-min-height)] flex-col rounded-[var(--card-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)] shadow-[var(--shadow-card)]">
      <div className="mb-[var(--space-3)] flex shrink-0 items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text)]">
          Recent Events
        </h2>

        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-[var(--dash-badge-padding-x)] py-[var(--dash-badge-padding-y)] font-mono text-[var(--dash-badge-text-size)] text-[var(--color-text-secondary)]">
          {recentFalls.length} today
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-[var(--space-1)]">
        {recentFalls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-xl)] border border-[var(--status-optimal)]/30 bg-[var(--status-optimal)]/10 p-[var(--space-6)] text-center">
            <div className="flex h-[var(--dash-icon-box-size)] w-[var(--dash-icon-box-size)] shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--status-optimal)]/20 text-[var(--status-optimal)] text-lg font-bold">
              ✓
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--color-text)]">
                No fall events detected
              </div>

              <div className="mt-[var(--space-1)] text-xs text-[var(--status-optimal)]">
                Safe operational status
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-[var(--space-2)]">
            {recentFalls.map((fall) => (
              <div
                key={fall._id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-[var(--space-3)] transition hover:border-[var(--color-accent)]/40"
              >
                <div className="flex items-start justify-between gap-[var(--space-3)]">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)]">
                      {new Date(fall.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-[var(--space-0-5)] text-xs capitalize text-[var(--color-text-secondary)]">
                      {fall.severity} fall
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded px-[var(--space-1-5)] py-[var(--space-0-5)] text-[var(--dash-badge-text-size)] font-bold uppercase tracking-wider ${
                      fall.severity === "severe"
                        ? "bg-[var(--status-sos)]/20 text-[var(--status-sos)] border border-[var(--status-sos)]/30"
                        : "bg-[var(--status-warning)]/20 text-[var(--text-warning)] border border-[var(--status-warning)]/30"
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
