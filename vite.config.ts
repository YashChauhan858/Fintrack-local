import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: false,
  },

  build: {
    rolldownOptions: {
      treeshake: false,
      output: {
        codeSplitting: {
          groups: [
            // If module path contains: react or react-dom, put them in separate chunk react-vendor.js
            {
              name: "react-vendor",
              test: /react|react-dom/,
            },
            {
              name: "charts",
              test: /chart.js|recharts|ag-grid/,
            },
          ],
        },
      },
    },
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: "esbuild",
  },
});
