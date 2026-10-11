/**
 * Metric calculations for GPS distance, telemetry summary statistics, and caloric expenditure.
 */

/**
 * Calculate distance between two GPS coordinates using the Haversine formula.
 *
 * @param {{latitude: number, longitude: number}} a
 * @param {{latitude: number, longitude: number}} b
 * @returns {number} Distance in kilometers
 */
export function distanceBetweenPoints(a, b) {
  const R = 6371; // Earth radius in km

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
 * Calculate min, average, and max for an array of numbers.
 *
 * @param {Array<number>} values
 * @returns {{min: number|null, average: number|null, max: number|null}}
 */
export function calculateNumericStats(values) {
  const numbers = (values || []).map(Number).filter(Number.isFinite);

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
 * Estimate calories burned during trail activity based on distance, duration, and elevation.
 *
 * @param {number} distanceKm
 * @param {number} durationMs
 * @param {number} [elevationGain=0]
 * @returns {number|null} Estimated calories burned
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

  // Estimated MET for trail activity
  let met = 5;
  if (speed >= 7) met = 8;
  else if (speed >= 5) met = 7;
  else if (speed >= 3) met = 6;

  // Reference body weight in kg (default 70kg)
  const weightKg = 70;
  let calories = met * weightKg * hours;

  // Elevation contributor
  if (Number.isFinite(Number(elevationGain)) && Number(elevationGain) > 0) {
    calories += Number(elevationGain) * 0.05;
  }

  return Math.round(calories);
}
