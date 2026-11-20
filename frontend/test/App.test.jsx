import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import App from "../src/App";

afterEach(() => {
  cleanup();
});

describe("TrailGuard Frontend App", () => {
  it("renders the application without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
