import Constants from "expo-constants";
import { getToken } from "./storage";

const configuredApiUrl =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.29.131:3000/api";

const API_URL = configuredApiUrl.replace(/\/+$/, "");

export const WS_URL =
  Constants.expoConfig?.extra?.wsUrl || "ws://192.168.29.131:3000/live";

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = await getToken();

    if (!token) {
      throw new Error("Authentication required");
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
  } catch (error) {
    throw new Error(
      "Could not connect to TrailGuard server. Make sure your Mac and device are on the same Wi-Fi network and the backend is running.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

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
};

export const vitalsApi = {
  latest: (deviceId) =>
    request(`/vitals/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 24) =>
    request(
      `/vitals/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      { auth: true },
    ),

  stats: (deviceId, hours = 24) =>
    request(
      `/vitals/stats?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      { auth: true },
    ),
};

export const environmentApi = {
  latest: (deviceId) =>
    request(`/environment/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 24) =>
    request(
      `/environment/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      { auth: true },
    ),

  stats: (deviceId, hours = 24) =>
    request(
      `/environment/stats?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      { auth: true },
    ),
};

export const locationApi = {
  latest: (deviceId) =>
    request(`/location/latest?deviceId=${encodeURIComponent(deviceId)}`, {
      auth: true,
    }),

  history: (deviceId, hours = 24) =>
    request(
      `/location/history?deviceId=${encodeURIComponent(deviceId)}&hours=${hours}`,
      { auth: true },
    ),
};

export const fallsApi = {
  all: (deviceId) =>
    request(`/falls?deviceId=${encodeURIComponent(deviceId)}`, { auth: true }),

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

  remove: (deviceId) =>
    request(`/devices/${encodeURIComponent(deviceId)}`, {
      method: "DELETE",
      auth: true,
    }),
};

export { API_URL };
