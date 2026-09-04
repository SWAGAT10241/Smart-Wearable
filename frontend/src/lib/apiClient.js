// ------------------------------------------------------------
// API BASE URL
// ------------------------------------------------------------

const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const API_URL = normalizedApiUrl.endsWith("/api") ? normalizedApiUrl : `${normalizedApiUrl}/api`;

// ------------------------------------------------------------
// AUTH TOKEN
// ------------------------------------------------------------

function getToken() {
  return localStorage.getItem("trailguard_token")
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
    if (!token) {
      throw new Error("Authentication required");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
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
// VITALS
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
// ENVIRONMENT
// ------------------------------------------------------------

export const environmentApi = {
  latest: (deviceId) =>
    request(`/environment/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),
  history: (deviceId, hours = 1) =>
    request(
      `/environment/history?deviceId=${encodeURIComponent(
        deviceId,
      )}&hours=${hours}`,
      {
        auth: true,
      },
    ),
  stats: (deviceId, hours = 1) =>
    request(
      `/environment/stats?deviceId=${encodeURIComponent(
        deviceId,
      )}&hours=${hours}`,
      {
        auth: true,
      },
    ),
};

// ------------------------------------------------------------
// LOCATION
// ------------------------------------------------------------

export const locationApi = {
  latest: (deviceId) =>
    request(`/location/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 24) =>
    request(
      `/location/history?deviceId=${encodeURIComponent(
        deviceId,
      )}&hours=${hours}`,
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
    request(`/falls?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

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
// DEVICES
// ------------------------------------------------------------

export const devicesApi = {
  /*
   * Get devices belonging to the logged-in user.
   */
  all: () =>
    request("/devices", {
      auth: true,
    }),

  /*
   * Pair a TrailGuard device.
   */
  register: (deviceId, deviceName = "TrailGuard Wearable") =>
    request("/devices/register", {
      method: "POST",
      body: {
        deviceId,
        deviceName,
      },
      auth: true,
    }),

  /*
   * Rename device.
   */
  rename: (deviceId, deviceName) =>
    request(`/devices/${encodeURIComponent(deviceId)}`, {
      method: "PATCH",
      body: {
        deviceName,
      },
      auth: true,
    }),

  /*
   * Unpair device.
   */
  remove: (deviceId) =>
    request(`/devices/${encodeURIComponent(deviceId)}`, {
      method: "DELETE",
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

console.log("[API] Base URL:", API_URL);
