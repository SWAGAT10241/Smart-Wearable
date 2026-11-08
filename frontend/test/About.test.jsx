import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "../src/pages/About";
import { DeviceProvider } from "../src/context/DeviceContext";

vi.mock("../src/context/DeviceContext", () => ({
  useDevices: () => ({
    selectedDevice: { deviceId: "TRAILGUARD-DEMO-001", deviceName: "TrailGuard Wearable" },
    selectedDeviceId: "TRAILGUARD-DEMO-001",
  }),
  DeviceProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "rahul@example.com", username: "rahul_hikes" },
  }),
}));

describe("About Page", () => {
  it("renders the hero banner and title", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Protection That Goes Where Cell Towers Can't")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/SWAAS \/ TrailGuard Ecosystem/i)
    ).toBeInTheDocument();
  });

  it("switches to the How It Works tab", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const tab = screen.getByRole("button", { name: /How It Works/i });
    fireEvent.click(tab);

    expect(screen.getByText("On-Wrist Sensing")).toBeInTheDocument();
    expect(screen.getByText("Distress Detection")).toBeInTheDocument();
  });

  it("switches to the Wearable Hardware tab", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const tab = screen.getByRole("button", { name: /Wearable Hardware/i });
    fireEvent.click(tab);

    expect(screen.getByText("Pulse Oximeter")).toBeInTheDocument();
    expect(screen.getByText("MAX30100")).toBeInTheDocument();
    expect(screen.getByText("Satellite GPS Receiver")).toBeInTheDocument();
  });

  it("switches to the Privacy & Protection tab", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const tab = screen.getByRole("button", { name: /Privacy & Protection/i });
    fireEvent.click(tab);

    expect(screen.getByText("Local-First Storage")).toBeInTheDocument();
    expect(
      screen.getByText("Hardware Device Authentication")
    ).toBeInTheDocument();
  });
});
