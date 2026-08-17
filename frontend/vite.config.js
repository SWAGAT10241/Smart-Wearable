import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// TrailGuard frontend — talks to the trailguard-backend Express API
// (see .env.example for the two env vars it needs)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
