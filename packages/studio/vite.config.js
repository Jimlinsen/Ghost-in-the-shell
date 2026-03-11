import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockApiMiddleware } from "./mock-api.js";

const USE_MOCK = !process.env.ANTHROPIC_API_KEY;

if (USE_MOCK) {
  console.log("\n🌀 Mock API mode — no API key detected\n");
}

export default defineConfig({
  plugins: [
    react(),
    ...(USE_MOCK ? [mockApiMiddleware()] : []),
  ],
  server: {
    port: 5173,
    ...(USE_MOCK ? {} : {
      proxy: {
        "/api/anthropic": {
          target: "https://api.anthropic.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
          headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
        },
      },
    }),
  },
});
