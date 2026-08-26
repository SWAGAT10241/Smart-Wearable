// Thin wrapper around the trailguard-backend REST API.
// Every function here maps 1:1 to a route documented in Architecture.md §5.

// ------------------------------------------------------------
// API BASE URL
// ------------------------------------------------------------

const configuredApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Normalize the API URL so it ALWAYS ends with /api
const API_URL = configuredApiUrl.replace(/\/+$/, "").endsWith("/api")
  ? configuredApiUrl.replace(/\/+$/, "")
  : `${configuredApiUrl.replace(/\/+$/, "")}/api`;

// ------------------------------------------------------------
// AUTH TOKEN
// ------------------------------------------------------------

function getToken() {
  return localStorage.getItem("trailguard_token");
}

// ------------------------------------------------------------
// GENERIC REQUEST
// ------------------------------------------------------------

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();

    if (token) {
      headers.Authorization = "Bearer " + token;
    }
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

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: payload,
    }),

  completeProfile: (payload) =>
    request("/auth/complete-profile", {
      method: "PATCH",
      body: payload,
      auth: true,
    }),

  me: () =>
    request("/auth/me", {
      auth: true,
    }),

  googleLoginUrl: () => `${API_URL}/auth/google`,
};

// ------------------------------------------------------------
// VITALS — Heart Rate + SpO2
// ------------------------------------------------------------

export const vitalsApi = {
  latest: (deviceId) =>
    request(`/vitals/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 1) =>
    request(
      `/vitals/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      {
        auth: true,
      },
    ),

  stats: (deviceId, hours = 1) =>
    request(
      `/vitals/stats?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      {
        auth: true,
      },
    ),
};

// ------------------------------------------------------------
// ENVIRONMENT — Temperature + Humidity
// ------------------------------------------------------------

export const environmentApi = {
  latest: (deviceId) =>
    request(`/environment/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 1) =>
    request(
      `/environment/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      {
        auth: true,
      },
    ),

  stats: (deviceId, hours = 1) =>
    request(
      `/environment/stats?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      {
        auth: true,
      },
    ),
};

// ------------------------------------------------------------
// LOCATION — GPS Trail
// ------------------------------------------------------------

export const locationApi = {
  latest: (deviceId) =>
    request(`/location/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 24) =>
    request(
      `/location/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      {
        auth: true,
      },
    ),
};

// ------------------------------------------------------------
// FALLS
// ------------------------------------------------------------

export const fallsApi = {
  all: (deviceId) =>
    request(
      `/falls${deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : ""}`,
      {
        auth: true,
      },
    ),

  latest: (deviceId) =>
    request(`/falls/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  updateStatus: (id, status) =>
    request(`/falls/${id}`, {
      method: "PATCH",
      body: { status },
      auth: true,
    }),
};

// ------------------------------------------------------------
// TOKEN MANAGEMENT
// ------------------------------------------------------------

export function saveToken(token) {
  localStorage.setItem("trailguard_token", token);
}

export function clearToken() {
  localStorage.removeItem("trailguard_token");
}

export { getToken };

// ------------------------------------------------------------
// DEBUG
// ------------------------------------------------------------

console.log("[API] Base URL:", API_URL);
