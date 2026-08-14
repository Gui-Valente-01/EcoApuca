import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Build estático para hospedagem sem servidor (GitHub Pages).
 *
 * Separado do `vite.config.ts` de propósito: aquele carrega vinext + Cloudflare
 * e continua sendo o usado por `npm run dev` / `npm run build`. Este aqui só
 * empacota `app/page.tsx` como uma SPA de arquivos estáticos.
 *
 * O caminho base é passado pelo CI (`--base=/nome-do-repo/`), porque no GitHub
 * Pages o site fica em `usuario.github.io/nome-do-repo/`, não na raiz.
 */
export default defineConfig({
  root: "static-site",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
