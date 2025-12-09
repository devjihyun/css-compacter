import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use relative asset paths so the app works offline (file:// or local server)
  base: "./",
  server: {
    port: 3000,
  },
});
