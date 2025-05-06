import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  base: "/tetelekzv/",
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    outDir: "tetelekzv",
    assetsDir: "assets",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/tetelekzv/BackEnd": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tetelekzv\/BackEnd/, "/BackEnd"),
        logLevel: "debug",
      },
    },
  },
});
