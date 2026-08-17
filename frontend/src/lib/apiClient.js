// Thin wrapper around the trailguard-backend REST API.
// Every function here maps 1:1 to a route documented in Architecture.md §5 —
// keep this file and that table in sync if the backend's API surface changes.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('trailguard_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ---- Auth ----
export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  completeProfile: (payload) =>
    request('/auth/complete-profile', { method: 'PATCH', body: payload, auth: true }),
  me: () => request('/auth/me', { auth: true }),
  googleLoginUrl: () => `${API_URL}/auth/google`,
};

// ---- Vitals (heart rate + SpO2) ----
export const vitalsApi = {
  latest: (deviceId) => request(`/vitals/latest?deviceId=${encodeURIComponent(deviceId)}`, { auth: true }),
  history: (deviceId, hours = 1) =>
    request(`/vitals/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`, { auth: true }),
};

// ---- Environment (temperature + humidity) ----
export const environmentApi = {
  latest: (deviceId) => request(`/environment/latest?deviceId=${encodeURIComponent(deviceId)}`, { auth: true }),
  average: (deviceId, hours = 1) =>
    request(`/environment/average?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`, { auth: true }),
  history: (deviceId, hours = 1) =>
    request(`/environment/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`, { auth: true }),
};

// ---- Location (GPS trail) ----
export const locationApi = {
  latest: (deviceId) => request(`/location/latest?deviceId=${encodeURIComponent(deviceId)}`, { auth: true }),
  history: (deviceId, hours = 24) =>
    request(`/location/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`, { auth: true }),
};

// ---- Falls ----
export const fallsApi = {
  all: (deviceId) => request(`/falls${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ''}`, { auth: true }),
  latest: (deviceId) => request(`/falls/latest?deviceId=${encodeURIComponent(deviceId)}`, { auth: true }),
  updateStatus: (id, status) =>
    request(`/falls/${id}`, { method: 'PATCH', body: { status }, auth: true }),
};

export function saveToken(token) {
  localStorage.setItem('trailguard_token', token);
}
export function clearToken() {
  localStorage.removeItem('trailguard_token');
}
export { getToken };
