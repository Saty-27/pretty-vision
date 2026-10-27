import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5057",
        changeOrigin: true
      },
      "/sitemap.xml": {
        target: "http://127.0.0.1:5057",
        changeOrigin: true
      },
      "/robots.txt": {
        target: "http://127.0.0.1:5057",
        changeOrigin: true
      },
      "/llms.txt": {
        target: "http://127.0.0.1:5057",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://127.0.0.1:5057",
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["lucide-react"],
          "vendor-charts": ["recharts"],
          "vendor-quill": ["react-quill"],
          "vendor-socket": ["socket.io-client"]
        }
      }
    }
  }
});
