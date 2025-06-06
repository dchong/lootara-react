import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import pkg from "./package.json";
import { execSync } from "child_process";

// Get the short Git SHA
const gitSha = execSync("git rev-parse --short HEAD").toString().trim();

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(`${pkg.version}+${gitSha}`),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/firestore", "firebase/storage"],
        },
      },
    },
  },
  server: {
    watch: {
      usePolling: true, // if needed
    },
    open: false, // auto-opens browser on start
  },
});
