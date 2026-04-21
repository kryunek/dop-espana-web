import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "dop-web";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "true" ? `/${repositoryName}/` : "/",
  clearScreen: false,
  server: {
    strictPort: true,
    port: 1420,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: "es2022",
  },
});
