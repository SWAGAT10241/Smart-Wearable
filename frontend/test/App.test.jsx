import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";

describe("App Routing Integrity", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders Landing page at route /", async () => {
    window.history.pushState({}, "Landing", "/");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Off-Grid Telemetry and Fall Rescue for Wilderness Operations/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/ACCESS WEB DASHBOARD/i)).toBeInTheDocument();
  });

  it("renders Login page at route /login", async () => {
    window.history.pushState({}, "Login", "/login");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign up/i })).toBeInTheDocument();
  });

  it("renders Register page at route /register", async () => {
    window.history.pushState({}, "Register", "/register");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Create your account")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Create Safety Profile/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign in/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated user from /dashboard to /login", async () => {
    window.history.pushState({}, "Dashboard", "/dashboard");
    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
      expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
    });
  });

  it("renders NotFound page for unknown route", async () => {
    window.history.pushState({}, "Unknown", "/non-existent-route-xyz");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText(/Off-Trail: Route Not Found/i)).toBeInTheDocument();
    });
  });
});
