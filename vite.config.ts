import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@config": resolve(__dirname, "./src/config"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@types": resolve(__dirname, "./src/types"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          "vendor-wagmi": ["wagmi", "wagmi/chains", "wagmi/connectors"],
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'Buffer': ['buffer', 'Buffer'],
    'process.env.NODE_DEBUG': 'false',
  },
  envPrefix: ['VITE_'],
});
