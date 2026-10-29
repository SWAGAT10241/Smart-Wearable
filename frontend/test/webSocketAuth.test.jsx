import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LiveDataProvider } from "../src/context/LiveDataContext";
import { emergencyApi } from "../src/lib/apiClient";
import { WS_URL } from "../src/config/env";

vi.mock("../src/context/DeviceContext", () => ({
  useDevices: () => ({ selectedDeviceId: null }),
}));
vi.mock("../src/lib/apiClient", () => ({
  emergencyApi: { getWsTicket: vi.fn() },
  devicePairingApi: {},
}));

beforeEach(() => {
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
