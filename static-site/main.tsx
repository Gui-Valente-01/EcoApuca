/**
 * Entrada da versão estática (GitHub Pages).
 *
 * Reaproveita exatamente o mesmo `app/page.tsx` usado pelo `npm run dev`.
 * O que o Next fazia via `app/layout.tsx` (fontes e <head>) está no index.html.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Elemento #root não encontrado no index.html.");
}

createRoot(container).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
