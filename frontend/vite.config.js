import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: ["@zxing/browser"],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
  },
});