import AppLayout from "../components/app/AppLayout";
import { useDevices } from "../context/DeviceContext";
import ChartCard from "../components/charts/ChartCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useTelemetryHistory, HISTORY_RANGES } from "../hooks/useTelemetryHistory";

export default function History() {
  const { selectedDeviceId, selectedDevice } = useDevices();
  const {
    range,
    setRange,
    falls,
    loading,
    hrPoints,
    spo2Points,
    tempPoints,
    humidityPoints,
    pressurePoints,
    trailPath,
  } = useTelemetryHistory(selectedDeviceId, 24);

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        {/* Header & Range Selector */}
        <div className="flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              History & Trends
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {selectedDevice
                ? `${selectedDevice.deviceName || selectedDevice.name || "TrailGuard Wearable"} · ${
                    selectedDevice.deviceId
                  }`
                : "No device selected"}
            </p>
          </div>

          <div className="flex gap-2">
            {HISTORY_RANGES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setRange(item.hours)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  range === item.hours
                    ? "bg-slate-900 text-white shadow-sm dark:bg-teal-500 dark:text-slate-950 font-semibold"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-secondary)] shadow-[var(--shadow-card)]">
            <LoadingSpinner size="sm" label="Loading history..." />
          </div>
        )}

        {/* History Metric Trend Charts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard
            title="Heart Rate"
            points={hrPoints}
            color="#FF6B85"
            unit="bpm"
          />
          <ChartCard
            title="Blood Oxygen"
            points={spo2Points}
            color="#1976D2"
            unit="% SpO₂"
          />
          <ChartCard
            title="Temperature"
            points={tempPoints}
            color="#F2A93B"
            unit="°C"
          />
          <ChartCard
            title="Humidity"
            points={humidityPoints}
            color="#18BFC1"
            unit="%"
          />
          <ChartCard
            title="Pressure"
            points={pressurePoints}
            color="#8B5CF6"
            unit="hPa"
          />
        </div>

        {/* Trail Path */}
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              Trail Path
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              GPS movement during the selected period
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-3">
            {trailPath ? (
              <svg
                viewBox="0 0 560 220"
                width="100%"
                height="220"
                preserveAspectRatio="none"
              >
                <path
                  d={trailPath}
                  fill="none"
                  stroke="#0E9C8C"
                  strokeWidth="2.5"
                  strokeDasharray="7 5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">
                No location history for this range
              </div>
            )}
          </div>
        </div>

        {/* Fall Events Log */}
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              Fall Event Log
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Detected fall events for this device
            </p>
          </div>
          <div className="grid gap-2 text-sm text-[var(--color-text-secondary)]">
            <div className="hidden grid-cols-[1.2fr_0.7fr_1fr_1fr] gap-3 rounded-xl bg-[var(--color-surface-alt)] px-3 py-2 font-semibold text-[var(--color-text)] md:grid">
              <span>Time</span>
              <span>Severity</span>
              <span>Status</span>
              <span>Location</span>
            </div>

            {falls.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] px-3 py-4 text-[var(--color-text-secondary)]">
                No fall events recorded.
              </div>
            )}

            {falls.map((fall) => (
              <div
                key={fall._id}
                className="grid gap-2 rounded-xl border border-[var(--color-border)] px-3 py-3 md:grid-cols-[1.2fr_0.7fr_1fr_1fr] md:gap-3 transition hover:border-[var(--color-accent)]/40"
              >
                <span>
                  {new Date(fall.timestamp).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className="capitalize">{fall.severity || "--"}</span>
                <span className="capitalize">
                  {fall.status ? fall.status.replace(/_/g, " ") : "--"}
                </span>
                <span>
                  {Number.isFinite(Number(fall.latitude))
                    ? Number(fall.latitude).toFixed(5)
                    : "--"}
                  ,{" "}
                  {Number.isFinite(Number(fall.longitude))
                    ? Number(fall.longitude).toFixed(5)
                    : "--"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
