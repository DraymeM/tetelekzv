import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true, target: "react" }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
  base: "/tetelekzv/",
  build: {
    outDir: "tetelekzv",
    assetsDir: "assets",
    target: "esnext",
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
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
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/_tests_/**/*.test.{ts,tsx}"],
    watch: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/validator/**"],
      clean: false,
      coverageDirectory: "coverage",
    },
  },
});
