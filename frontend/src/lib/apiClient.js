import { API_URL } from "../config/env";
import { ApiError } from "../utils/errors";

// ------------------------------------------------------------
// AUTH TOKEN
// ------------------------------------------------------------

export function getToken() {
  try {
    return localStorage.getItem("trailguard_token");
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem("trailguard_token", token);
  } catch (err) {
    console.error("[Auth] Failed to persist token:", err);
  }
}

export function clearToken() {
  try {
    localStorage.removeItem("trailguard_token");
  } catch (err) {
    console.error("[Auth] Failed to clear token:", err);
  }
}

// ------------------------------------------------------------
// GENERIC REQUEST WITH ERROR HANDLING
// ------------------------------------------------------------

export async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (!token) {
      throw new ApiError("Authentication required", 401, "UNAUTHENTICATED");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError(
      networkError.message || "Network error. Please check your internet connection.",
      0,
      "NETWORK_ERROR",
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = data.error || data.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data.code || "REQUEST_FAILED", data.details);
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
  all: () =>
    request("/devices", {
      auth: true,
    }),

  register: (deviceId, deviceName = "TrailGuard Wearable") =>
    request("/devices/register", {
      method: "POST",
      body: {
        deviceId,
        deviceName,
      },
      auth: true,
    }),

  rename: (deviceId, deviceName) =>
    request(`/devices/${encodeURIComponent(deviceId)}`, {
      method: "PATCH",
      body: {
        deviceName,
      },
      auth: true,
    }),

  updateStatus: (deviceId, status) =>
    request(`/devices/${encodeURIComponent(deviceId)}/status`, {
      method: "PATCH",
      body: { status },
      auth: true,
    }),

  remove: (deviceId) =>
    request(`/devices/${encodeURIComponent(deviceId)}`, {
      method: "DELETE",
      auth: true,
    }),
};

export default {
  authApi,
  vitalsApi,
  environmentApi,
  locationApi,
  fallsApi,
  devicesApi,
  getToken,
  saveToken,
  clearToken,
  request,
};
