import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LiveDataProvider, useLiveData } from "../src/context/LiveDataContext";
import { emergencyApi } from "../src/lib/apiClient";
import { WS_URL } from "../src/config/env";

const updateDeviceHeartbeat = vi.hoisted(() => vi.fn());

vi.mock("../src/context/DeviceContext", () => ({
  useDevices: () => ({ selectedDeviceId: null, updateDeviceHeartbeat }),
}));
vi.mock("../src/lib/apiClient", () => ({
  emergencyApi: { getWsTicket: vi.fn() },
  devicePairingApi: {},
  getToken: vi.fn(() => "test-jwt-token"),
}));

beforeEach(() => {
  updateDeviceHeartbeat.mockClear();
  vi.stubGlobal("WebSocket", vi.fn(function () {
    this.close = vi.fn();
  }));
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it.each(["failed", "missing"])("opens no socket when ticket acquisition is %s", async (mode) => {
  if (mode === "failed") emergencyApi.getWsTicket.mockRejectedValue(new Error("unavailable"));
  else emergencyApi.getWsTicket.mockResolvedValue({});

  await act(async () => render(<LiveDataProvider><div /></LiveDataProvider>));

  expect(emergencyApi.getWsTicket).toHaveBeenCalled();
  expect(WebSocket).not.toHaveBeenCalled();
});

it("authenticates using only the ticket subprotocol", async () => {
  emergencyApi.getWsTicket.mockResolvedValue({ ticket: "single-use" });

  await act(async () => render(<LiveDataProvider><div /></LiveDataProvider>));

  expect(WebSocket).toHaveBeenCalledExactlyOnceWith(WS_URL, ["trailguard", "ticket.single-use"]);
});


it("preserves freshness on fall status changes and updates it on device activity", async () => {
  emergencyApi.getWsTicket.mockResolvedValue({ ticket: "single-use" });
  let liveData;
  function Probe() {
    liveData = useLiveData();
    return null;
  }
  await act(async () => render(<LiveDataProvider><Probe /></LiveDataProvider>));
  const socket = WebSocket.mock.instances[0];
  const send = (type, data) => act(() => socket.onmessage({
    data: JSON.stringify({ type, deviceId: "device-1", data }),
  }));
  const contact = "2026-11-15T12:00:00Z";
  const originalFall = "2026-11-15T11:00:00Z";

  send("fall_status_update", { timestamp: originalFall, status: "resolved" });
  expect(liveData.lastSeen).toBeNull();
  expect(updateDeviceHeartbeat).not.toHaveBeenCalled();

  send("vitals", { timestamp: contact, heartRate: 75 });
  expect(liveData.lastSeen).toBe(contact);
  expect(updateDeviceHeartbeat).toHaveBeenLastCalledWith("device-1", contact);
  updateDeviceHeartbeat.mockClear();

  send("fall_status_update", { timestamp: originalFall, status: "resolved" });
  expect(liveData.lastSeen).toBe(contact);
  expect(updateDeviceHeartbeat).not.toHaveBeenCalled();

  const heartbeat = "2026-11-15T12:01:00Z";
  send("device_heartbeat", { lastSeen: heartbeat });
  expect(liveData.lastSeen).toBe(heartbeat);
  expect(updateDeviceHeartbeat).toHaveBeenLastCalledWith("device-1", heartbeat);
});
