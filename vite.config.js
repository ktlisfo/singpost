import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/singpost/",
  server: {
    hmr:
      process.env.CODESANDBOX_SSE || process.env.GITPOD_WORKSPACE_ID
        ? 443
        : undefined,
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        route: "./route.html",
      },
    },
  },
});
