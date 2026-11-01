import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useHistoryData } from "../../mobile/src/hooks/useHistoryData";
import { vitalsApi, environmentApi } from "../../mobile/src/lib/apiClient";

const device = vi.hoisted(() => ({ selectedDeviceId: "device-A" }));
vi.mock("../../mobile/src/context/DeviceContext", () => ({ useDevices: () => device }));
vi.mock("../../mobile/src/lib/apiClient", () => ({
  vitalsApi: { history: vi.fn() },
  environmentApi: { history: vi.fn() },
}));

function deferred() {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}
function request() {
  const vitals = deferred();
  const environment = deferred();
  vitalsApi.history.mockReturnValueOnce(vitals.promise);
  environmentApi.history.mockReturnValueOnce(environment.promise);
  return { vitals, environment };
}
async function succeed(pending, label) {
  await act(async () => {
    pending.vitals.resolve([{ label }]);
    pending.environment.resolve([{ label }]);
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  device.selectedDeviceId = "device-A";
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("ignores old success and finally while the latest refresh is pending", async () => {
  const old = request();
  const { result } = renderHook(() => useHistoryData());
  const latest = request();
  let refresh;
  act(() => { refresh = result.current.refresh(); });
  await succeed(old, "old");
  expect(result.current.vitals).toEqual([]);
  expect(result.current.environment).toEqual([]);
  expect(result.current.loading).toBe(true);
  await succeed(latest, "new");
  await refresh;
  expect(result.current.vitals).toEqual([{ label: "new" }]);
  expect(result.current.environment).toEqual([{ label: "new" }]);
  expect(result.current.loading).toBe(false);
});

it("ignores an old failure after switching devices", async () => {
  const old = request();
  const { result, rerender } = renderHook(() => useHistoryData());
  const latest = request();
  device.selectedDeviceId = "device-B";
  rerender();
  await act(async () => old.vitals.reject(new Error("old failure")));
  expect(result.current.error).toBeNull();
  expect(result.current.loading).toBe(true);
  await succeed(latest, "device-B");
  expect(result.current.vitals).toEqual([{ label: "device-B" }]);
});

it("clears errors and invalidates pending requests when no device is selected", async () => {
  const failed = request();
  const { result, rerender } = renderHook(() => useHistoryData());
  await act(async () => failed.vitals.reject(new Error("current failure")));
  expect(result.current.error).toBe("current failure");
  const pending = request();
  act(() => { void result.current.refresh(); });
  device.selectedDeviceId = null;
  rerender();
  expect(result.current).toMatchObject({ vitals: [], environment: [], loading: false, error: null });
  await succeed(pending, "stale");
  expect(result.current).toMatchObject({ vitals: [], environment: [], loading: false, error: null });
});

it("invalidates a pending rejection on unmount", async () => {
  const pending = request();
  const { unmount } = renderHook(() => useHistoryData());
  unmount();
  await act(async () => pending.vitals.reject(new Error("after unmount")));
  expect(console.log).not.toHaveBeenCalled();
});
