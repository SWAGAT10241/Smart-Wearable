/**
 * Health telemetry domain thresholds and assessment functions.
 */

export const THRESHOLDS = {
  HEART_RATE: {
    MIN_NORMAL: 60,
    MAX_NORMAL: 100,
    WARNING_LOW: 50,
    WARNING_HIGH: 120,
  },
  SPO2: {
    NORMAL: 95,
    WARNING: 90,
  },
  TEMPERATURE: {
    MIN_NORMAL: 20,
    MAX_NORMAL: 37.5,
    WARNING_HIGH: 38.5,
  },
};

/**
 * Assess heart rate status and return state colors/labels.
 *
 * @param {number|null|undefined} bpm
 * @returns {{status: string, color: string, badgeClass: string}}
 */
export function getHeartRateStatus(bpm) {
  if (bpm == null) return { status: "Offline", color: "slate", badgeClass: "badge-slate" };

  if (bpm < THRESHOLDS.HEART_RATE.WARNING_LOW || bpm > THRESHOLDS.HEART_RATE.WARNING_HIGH) {
    return { status: "Critical", color: "red", badgeClass: "badge-red" };
  }
  if (bpm < THRESHOLDS.HEART_RATE.MIN_NORMAL || bpm > THRESHOLDS.HEART_RATE.MAX_NORMAL) {
    return { status: "Warning", color: "amber", badgeClass: "badge-amber" };
  }
  return { status: "Normal", color: "emerald", badgeClass: "badge-emerald" };
}

/**
 * Assess blood oxygen (SpO2) status.
 *
 * @param {number|null|undefined} spo2
 * @returns {{status: string, color: string, badgeClass: string}}
 */
export function getSpo2Status(spo2) {
  if (spo2 == null) return { status: "Offline", color: "slate", badgeClass: "badge-slate" };

  if (spo2 < THRESHOLDS.SPO2.WARNING) {
    return { status: "Hypoxia Risk", color: "red", badgeClass: "badge-red" };
  }
  if (spo2 < THRESHOLDS.SPO2.NORMAL) {
    return { status: "Low", color: "amber", badgeClass: "badge-amber" };
  }
  return { status: "Optimal", color: "emerald", badgeClass: "badge-emerald" };
}

/**
 * Assess ambient/body temperature status.
 *
 * @param {number|null|undefined} tempC
 * @returns {{status: string, color: string, badgeClass: string}}
 */
export function getTemperatureStatus(tempC) {
  if (tempC == null) return { status: "Offline", color: "slate", badgeClass: "badge-slate" };

  if (tempC > THRESHOLDS.TEMPERATURE.WARNING_HIGH) {
    return { status: "High Heat", color: "red", badgeClass: "badge-red" };
  }
  if (tempC > THRESHOLDS.TEMPERATURE.MAX_NORMAL) {
    return { status: "Warm", color: "amber", badgeClass: "badge-amber" };
  }
  return { status: "Comfortable", color: "emerald", badgeClass: "badge-emerald" };
}

/**
 * Get color representation for fall severity.
 *
 * @param {string} severity
 * @returns {string}
 */
export function getSeverityColor(severity) {
  switch ((severity || "").toLowerCase()) {
    case "critical":
    case "severe":
      return "text-red-500 bg-red-500/10 border-red-500/30";
    case "moderate":
      return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    case "minor":
    case "low":
    default:
      return "text-blue-500 bg-blue-500/10 border-blue-500/30";
  }
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula.
 *
 * @param {{latitude: number, longitude: number}} a
 * @param {{latitude: number, longitude: number}} b
 * @returns {number} distance in kilometers
 */
export function distanceBetweenPoints(a, b) {
  const R = 6371;

  const lat1 = Number(a?.latitude);
  const lat2 = Number(b?.latitude);
  const lon1 = Number(a?.longitude);
  const lon2 = Number(b?.longitude);

  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lon2)
  ) {
    return 0;
  }

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Calculate statistical summary (min, avg, max) from numeric values.
 *
 * @param {Array<number|string>} values
 * @returns {{min: number|null, average: number|null, max: number|null}}
 */
export function calculateNumericStats(values = []) {
  const numbers = values.map(Number).filter(Number.isFinite);

  if (!numbers.length) {
    return { min: null, average: null, max: null };
  }

  return {
    min: Math.min(...numbers),
    average: numbers.reduce((sum, value) => sum + value, 0) / numbers.length,
    max: Math.max(...numbers),
  };
}

/**
 * Calculate calories estimated from activity distance, duration, and elevation.
 *
 * @param {number} distanceKm
 * @param {number} durationMs
 * @param {number} [elevationGain=0]
 * @returns {number|null}
 */
export function calculateCalories(distanceKm, durationMs, elevationGain = 0) {
  if (
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(durationMs) ||
    distanceKm <= 0 ||
    durationMs <= 0
  ) {
    return null;
  }

  const hours = durationMs / 3600000;
  if (hours <= 0) return null;

  const speed = distanceKm / hours;

  let met = 5;
  if (speed >= 7) met = 8;
  else if (speed >= 5) met = 7;
  else if (speed >= 3) met = 6;

  const weightKg = 70;
  let calories = met * weightKg * hours;

  if (Number.isFinite(Number(elevationGain)) && Number(elevationGain) > 0) {
    calories += Number(elevationGain) * 0.05;
  }

  return Math.round(calories);
}
