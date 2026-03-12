import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mockApiMiddleware } from "./mock-api.js";
import { evolutionApiPlugin } from "./evolution-api.js";
import { fileURLToPath } from "url";
import * as path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEEDS_DIR = path.join(__dirname, "public/seeds");
const USE_MOCK = !process.env.ANTHROPIC_API_KEY;

if (USE_MOCK) {
  console.log("\n🌀 No ANTHROPIC_API_KEY — soul generation uses mock; evolution mode reads ~/.nutshell/config.json\n");
}

export default defineConfig({
  plugins: [
    react(),
    evolutionApiPlugin(SEEDS_DIR),
    ...(USE_MOCK ? [mockApiMiddleware()] : []),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
          "anthropic-version": "2023-06-01",
        },
      },
    },
  },
});
