import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../src/pages/NotFound";

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "tester@example.com" },
  }),
}));

describe("NotFound (404) Page", () => {
  it("renders 404 headline and off-trail messages", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Off-Trail: Route Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/NO FIX/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Base Camp/i)).toBeInTheDocument();
  });

  it("renders quick navigation waypoints and search input", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Quick jump: dashboard, history/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /History/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /About SWAAS/i })).toBeInTheDocument();
  });

  it("allows typing into the re-route input form", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Quick jump: dashboard, history/i);
    fireEvent.change(input, { target: { value: "history" } });
    expect(input.value).toBe("history");

    const submitBtn = screen.getByRole("button", { name: /Re-Route/i });
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);
  });
});
