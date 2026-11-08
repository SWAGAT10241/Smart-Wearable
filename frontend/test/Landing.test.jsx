import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Landing from "../src/pages/Landing";
import { ThemeProvider } from "../src/context/ThemeContext";

describe("Landing Page", () => {
  it("renders the landing page headline and navigation without crashing", () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </ThemeProvider>
    );

    expect(screen.getAllByText(/TRAIL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GUARD/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Off-Grid Telemetry and Fall Rescue for Wilderness Operations/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ACCESS WEB DASHBOARD/i)).toBeInTheDocument();
  });
});
