import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: {
    host: process.env["VITE_HOST"] ?? "127.0.0.1",
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
  build: {
    outDir: "../dist/frontend",
    emptyOutDir: true,
  },
});
