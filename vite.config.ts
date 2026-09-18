import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = "tower-of-hanoi-visualizer";

export default defineConfig({
  base:
    process.env.GITHUB_ACTIONS === "true"
      ? `/${repositoryName}/`
      : (process.env.VITE_BASE_PATH ?? "/"),
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true
  }
});
