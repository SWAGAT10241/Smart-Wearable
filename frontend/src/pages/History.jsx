import { useState, useMemo } from "react";
import AppLayout from "../components/app/AppLayout";
import { useDevices } from "../context/DeviceContext";
import ChartCard from "../components/charts/ChartCard";
import LiveMap from "../components/LiveMap";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useTelemetryHistory, HISTORY_RANGES } from "../hooks/useTelemetryHistory";
import {
  IoShieldOutline,
  IoFilterOutline,
  IoLocationOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { maskDeviceId } from "../utils/masking";

function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  if (diffMs < 0) return "Just now";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getTimeGroup(date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    const diffHours = (now - date) / (1000 * 60 * 60);
    if (diffHours <= 1) return "Within Last Hour";
    return "Earlier Today";
  }
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function History() {
  const { selectedDeviceId, selectedDevice } = useDevices();
  const [metricFilter, setMetricFilter] = useState("all"); // 'all' | 'vitals' | 'env'
  const [fallSeverityFilter, setFallSeverityFilter] = useState("all"); // 'all' | 'severe' | 'moderate' | 'minor'
  const [fallSearchQuery, setFallSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // 10 | 20 | 50
  const [currentPage, setCurrentPage] = useState(1);

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
    trail,
  } = useTelemetryHistory(selectedDeviceId, 24);

  // Latest valid location coordinates from historical trail
  const latestLocation = useMemo(() => {
    if (!Array.isArray(trail) || trail.length === 0) return null;
    const valid = trail.filter(
      (p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))
    );
    return valid.length > 0 ? valid[valid.length - 1] : null;
  }, [trail]);

  // Fall counts by severity
  const fallStats = useMemo(() => {
    const counts = { all: falls.length, severe: 0, moderate: 0, minor: 0 };
    for (const f of falls) {
      const sev = (f.severity || "moderate").toLowerCase();
      if (counts[sev] !== undefined) counts[sev]++;
      else counts.moderate++;
    }
    return counts;
  }, [falls]);

  // Filtered fall incidents sorted newest first
  const filteredFalls = useMemo(() => {
    const query = fallSearchQuery.trim().toLowerCase();
    const sorted = [...falls].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return sorted.filter((f) => {
      const sev = (f.severity || "moderate").toLowerCase();
      if (fallSeverityFilter !== "all" && sev !== fallSeverityFilter) return false;

      if (!query) return true;

      const dateObj = new Date(f.timestamp);
      const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();
      const dateStr = dateObj.toLocaleDateString([], { month: "short", day: "numeric" }).toLowerCase();
      const statusStr = (f.status || "").toLowerCase();
      const latLon = `${Number(f.latitude).toFixed(4)}, ${Number(f.longitude).toFixed(4)}`;

      return (
        timeStr.includes(query) ||
        dateStr.includes(query) ||
        sev.includes(query) ||
        statusStr.includes(query) ||
        latLon.includes(query)
      );
    });
  }, [falls, fallSeverityFilter, fallSearchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredFalls.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Paginated slice for current page
  const paginatedFalls = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredFalls.slice(start, start + pageSize);
  }, [filteredFalls, safeCurrentPage, pageSize]);

  // Chronological timeline grouping for the items visible on this page
  const groupedFalls = useMemo(() => {
    const groups = {};
    for (const f of paginatedFalls) {
      const d = new Date(f.timestamp);
      const groupKey = getTimeGroup(d);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(f);
    }
    return groups;
  }, [paginatedFalls]);

  // Short timeline span covered by the current page (e.g., "Nov 7 · 11:45 AM – 10:15 AM")
  const pageTimelineSpan = useMemo(() => {
    if (paginatedFalls.length === 0) return null;
    const latest = new Date(paginatedFalls[0].timestamp);
    const earliest = new Date(paginatedFalls[paginatedFalls.length - 1].timestamp);

    const fmtTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const fmtDate = (d) => d.toLocaleDateString([], { month: "short", day: "numeric" });

    const sameDay = latest.toDateString() === earliest.toDateString();
    if (sameDay) {
      if (fmtTime(latest) === fmtTime(earliest)) {
        return `${fmtDate(latest)} · ${fmtTime(latest)}`;
      }
      return `${fmtDate(latest)} · ${fmtTime(latest)} – ${fmtTime(earliest)}`;
    }
    return `${fmtDate(latest)} ${fmtTime(latest)} – ${fmtDate(earliest)} ${fmtTime(earliest)}`;
  }, [paginatedFalls]);

  const startIndex = filteredFalls.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(filteredFalls.length, safeCurrentPage * pageSize);

  return (
    <AppLayout>
      <div className="flex flex-col gap-3.5">
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-card)] p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
                Telemetry History
              </h1>
              <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                Interactive Route
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {selectedDevice
                ? `${selectedDevice.deviceName || selectedDevice.name || "TrailGuard Wearable"} · ${maskDeviceId(selectedDevice.deviceId)}`
                : "No device selected"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Range Selector */}
            <div className="flex rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)] p-0.5">
              {HISTORY_RANGES.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setRange(item.hours)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    range === item.hours
                      ? "border border-teal-500/30 bg-[var(--brand-teal-subtle)] text-[var(--brand-teal-light)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-2 text-xs text-[var(--text-secondary)]">
            <LoadingSpinner size="sm" label="Aggregating history window..." />
          </div>
        )}

        {/* METRIC CATEGORY TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-default)] pb-2 text-sm">
          <span className="flex items-center gap-1.5 font-bold text-[var(--text-secondary)]">
            <IoFilterOutline className="h-4 w-4 text-teal-400" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setMetricFilter("all")}
            className={`rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold transition ${
              metricFilter === "all"
                ? "bg-[var(--surface-elevated)] text-[var(--action-primary)] font-bold border border-teal-500/30"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            All Charts (5)
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter("vitals")}
            className={`rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold transition ${
              metricFilter === "vitals"
                ? "bg-[var(--surface-elevated)] text-[var(--action-primary)] font-bold border border-teal-500/30"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Biometrics (2)
          </button>
          <button
            type="button"
            onClick={() => setMetricFilter("env")}
            className={`rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold transition ${
              metricFilter === "env"
                ? "bg-[var(--surface-elevated)] text-[var(--action-primary)] font-bold border border-teal-500/30"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Environment (3)
          </button>
        </div>

        {/* COMPACT TREND CHARTS GRID WITH EXPLICIT SCALE INDICATORS */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(metricFilter === "all" || metricFilter === "vitals") && (
            <>
              <ChartCard
                title="Heart Rate"
                points={hrPoints}
                color="var(--action-destructive)"
                unit="bpm"
                sensorType="heart"
                normalRange="Norm: 60-100"
              />
              <ChartCard
                title="Blood Oxygen"
                points={spo2Points}
                color="var(--status-optimal)"
                unit="% SpO₂"
                sensorType="oxygen"
                normalRange="Norm: 95-100%"
              />
            </>
          )}

          {(metricFilter === "all" || metricFilter === "env") && (
            <>
              <ChartCard
                title="Temperature"
                points={tempPoints}
                color="var(--status-warning)"
                unit="°C"
                sensorType="temperature"
                normalRange="Mild: 18-26°C"
              />
              <ChartCard
                title="Humidity"
                points={humidityPoints}
                color="var(--status-info)"
                unit="%"
                sensorType="humidity"
                normalRange="Comfort: 30-60%"
              />
              <ChartCard
                title="Pressure"
                points={pressurePoints}
                color="var(--status-info)"
                unit="hPa"
                sensorType="pressure"
                normalRange="Std: 1000-1025"
              />
            </>
          )}
        </div>

        {/* PROMINENT GPS MOVEMENT MAP (LARGE INTERACTIVE VIEW) */}
        <div className="flex flex-col rounded-[22px] border border-[var(--border-default)] bg-[var(--surface-card)] p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-[var(--brand-teal)]">
                <IoLocationOutline className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                  GPS Movement Route & Terrain
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Interactive satellite topography and recorded GPS waypoints ({range}h window)
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">
              {latestLocation
                ? `${Number(latestLocation.latitude).toFixed(5)}, ${Number(latestLocation.longitude).toFixed(5)}`
                : "No Coordinates"}
            </span>
          </div>

          <div className="h-[360px] overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] sm:h-[400px]">
            {latestLocation ? (
              <LiveMap
                latitude={latestLocation.latitude}
                longitude={latestLocation.longitude}
                trail={trail}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                No GPS coordinates recorded for this {range}h window.
              </div>
            )}
          </div>
        </div>

        {/* FALL INCIDENTS CATEGORIZED TIMELINE */}
        <div className="flex flex-col rounded-[22px] border border-[var(--border-default)] bg-[var(--surface-card)] p-4 shadow-sm">
          {/* Header & Badges */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <IoShieldOutline className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                  Fall Incidents & Impact Timeline
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Chronological event log categorized by time window and impact severity
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                Total: <strong className="text-[var(--text-primary)]">{fallStats.all}</strong>
              </span>
              {fallStats.severe > 0 && (
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 font-bold text-red-400">
                  {fallStats.severe} Severe
                </span>
              )}
              {fallStats.moderate > 0 && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-bold text-amber-400">
                  {fallStats.moderate} Moderate
                </span>
              )}
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="mb-3 flex flex-col gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Severity Category Chips */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setFallSeverityFilter("all");
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  fallSeverityFilter === "all"
                    ? "bg-[var(--brand-teal-subtle)] text-[var(--brand-teal-light)] border border-teal-500/30 font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                All ({fallStats.all})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFallSeverityFilter("severe");
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  fallSeverityFilter === "severe"
                    ? "bg-red-500/25 text-red-400 border border-red-500/40 font-bold"
                    : "text-[var(--text-secondary)] hover:text-red-400"
                }`}
              >
                Severe ({fallStats.severe})
              </button>
              <button
                type="button"
                onClick={() => {
                  setFallSeverityFilter("moderate");
                  setCurrentPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  fallSeverityFilter === "moderate"
                    ? "bg-amber-500/25 text-amber-400 border border-amber-500/40 font-bold"
                    : "text-[var(--text-secondary)] hover:text-amber-400"
                }`}
              >
                Moderate ({fallStats.moderate})
              </button>
              {fallStats.minor > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFallSeverityFilter("minor");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    fallSeverityFilter === "minor"
                      ? "bg-teal-500/25 text-teal-300 border border-teal-500/40 font-bold"
                      : "text-[var(--text-secondary)] hover:text-teal-300"
                  }`}
                >
                  Minor ({fallStats.minor})
                </button>
              )}
            </div>

            {/* Quick Search Input */}
            <div className="relative flex items-center">
              <IoSearchOutline className="absolute left-2.5 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                value={fallSearchQuery}
                onChange={(e) => {
                  setFallSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search time (e.g. 14:30), status..."
                className="w-full sm:w-56 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-1 pl-8 pr-7 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-teal-500/50 focus:outline-none"
              />
              {fallSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setFallSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <IoCloseOutline className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Timeline Scrollable View */}
          <div className="max-h-[380px] overflow-y-auto rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] p-3.5">
            {falls.length === 0 ? (
              <div className="flex h-20 flex-col items-center justify-center gap-1 text-xs text-emerald-400">
                <IoCheckmarkCircleOutline className="h-5 w-5 text-emerald-400" />
                <span>Zero fall incidents detected in this {range}h window. Safe status.</span>
              </div>
            ) : filteredFalls.length === 0 ? (
              <div className="flex h-24 flex-col items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                <p>No fall incidents found matching your search filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFallSearchQuery("");
                    setFallSeverityFilter("all");
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-1 font-semibold text-teal-400 hover:text-teal-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedFalls).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="space-y-2">
                    {/* Time Category Header */}
                    <div className="flex items-center gap-2 sticky top-0 bg-[var(--surface-elevated)]/95 backdrop-blur-sm py-1 z-10">
                      <IoTimeOutline className="h-3 w-3 text-teal-400" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        {groupTitle}
                      </span>
                      <span className="rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] px-2 py-0.2 text-[10px] font-mono text-[var(--text-muted)]">
                        {items.length} {items.length === 1 ? "incident" : "incidents"}
                      </span>
                      <div className="flex-1 border-t border-[var(--border-default)] opacity-50" />
                    </div>

                    {/* Timeline Node List */}
                    <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-default)] space-y-2.5">
                      {items.map((fall) => {
                        const fallDate = new Date(fall.timestamp);
                        const isSevere = (fall.severity || "").toLowerCase() === "severe";
                        const isMinor = (fall.severity || "").toLowerCase() === "minor";

                        return (
                          <div
                            key={fall._id || fall.timestamp}
                            className="relative flex flex-col gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-3 text-xs shadow-xs transition hover:border-[var(--border-strong)] sm:flex-row sm:items-center sm:justify-between"
                          >
                            {/* Dot on Spine */}
                            <span
                              className={`absolute -left-[17px] top-4 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface-card)] ${
                                isSevere
                                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                                  : isMinor
                                  ? "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]"
                                  : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]"
                              }`}
                            />

                            {/* Left: Time & Location */}
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                                  {fallDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })}
                                </span>
                                <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                                  {formatRelativeTime(fallDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                                <IoLocationOutline className="h-3 w-3 text-teal-400" />
                                <span className="font-mono text-[10px]">
                                  {Number.isFinite(Number(fall.latitude)) && Number.isFinite(Number(fall.longitude))
                                    ? `${Number(fall.latitude).toFixed(5)}, ${Number(fall.longitude).toFixed(5)}`
                                    : "GPS coordinates logged"}
                                </span>
                              </div>
                            </div>

                            {/* Right: Badges & Sensor Impact */}
                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                              {Number.isFinite(Number(fall.totalAcceleration)) && (
                                <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                                  Impact: <strong>{Number(fall.totalAcceleration).toFixed(1)}g</strong>
                                </span>
                              )}
                              {Number.isFinite(Number(fall.tiltAngle)) && (
                                <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                                  Tilt: <strong>{Number(fall.tiltAngle).toFixed(0)}°</strong>
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  isSevere
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : isMinor
                                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {fall.severity || "Moderate"}
                              </span>
                              {fall.status && (
                                <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)] capitalize">
                                  {fall.status.replace(/_/g, " ")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination & Short Timeline Bar */}
          {filteredFalls.length > 0 && (
            <div className="mt-3 flex flex-col gap-2.5 border-t border-[var(--border-default)] pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Summary text & Current Page Timeline Window */}
              <div className="flex flex-wrap items-center gap-2 text-[var(--text-secondary)]">
                <span>
                  Showing <strong className="text-[var(--text-primary)]">{startIndex}–{endIndex}</strong> of{" "}
                  <strong className="text-[var(--text-primary)]">{filteredFalls.length}</strong> incidents
                </span>

                {pageTimelineSpan && (
                  <div className="flex items-center gap-1.5 rounded-md border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-[var(--brand-teal)]">
                    <IoTimeOutline className="h-3 w-3" />
                    <span>Timeline: {pageTimelineSpan}</span>
                  </div>
                )}
              </div>

              {/* Right: Items per page selector & Page navigation */}
              <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                {/* Items per page selector */}
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="text-[11px]">Show:</span>
                  <div className="flex rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)] p-0.5">
                    {[10, 20, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setCurrentPage(1);
                        }}
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                          pageSize === size
                            ? "bg-[var(--brand-teal-subtle)] text-[var(--brand-teal-light)] border border-teal-500/30"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Navigation Prev / Next */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="flex h-7 items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-2.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <IoChevronBackOutline className="h-3.5 w-3.5" />
                    <span>Prev</span>
                  </button>

                  <span className="px-2 font-mono text-[11px] text-[var(--text-secondary)]">
                    Page <strong className="text-[var(--text-primary)]">{safeCurrentPage}</strong> of{" "}
                    <strong className="text-[var(--text-primary)]">{totalPages}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="flex h-7 items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-2.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <span>Next</span>
                    <IoChevronForwardOutline className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
