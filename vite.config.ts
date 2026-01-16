import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ✅ BASE CORRETA PARA GITHUB PAGES
  base: mode === "production" ? "/controle-financeiro/" : "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ BUILD AJUSTADO PARA /docs (PADRÃO GITHUB PAGES)
  build: {
    outDir: "docs",
    emptyOutDir: true,
    sourcemap: false,
  },
}));
