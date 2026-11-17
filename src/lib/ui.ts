import type { CSSProperties } from "react";
import type { FontKey, Theme } from "./types";

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const FONTS: Record<FontKey, { label: string; display: string; body: string; upper?: boolean }> = {
  trattoria: { label: "Cantina", display: "'Caprasimo', Georgia, serif", body: "'Instrument Sans', system-ui, sans-serif" },
  poster: { label: "Pôster", display: "'Bowlby One', Impact, sans-serif", body: "'Archivo', system-ui, sans-serif", upper: true },
  bairro: { label: "Bairro", display: "'Fredoka', system-ui, sans-serif", body: "'Nunito', system-ui, sans-serif" },
  elegante: { label: "Ateliê", display: "'Bodoni Moda', Didot, serif", body: "'Jost', system-ui, sans-serif" },
  pista: { label: "Pista", display: "'Saira Condensed', system-ui, sans-serif", body: "'Saira', system-ui, sans-serif", upper: true },
  moderna: { label: "Moderna", display: "'Sora', system-ui, sans-serif", body: "'Sora', system-ui, sans-serif" },
};

const RADIUS = { reto: [0, 0, 0], suave: [10, 16, 22], redondo: [16, 24, 32] };

export function themeVars(t: Theme): CSSProperties {
  const f = FONTS[t.font];
  const [r1, r2, r3] = RADIUS[t.corners];
  return {
    "--accent": t.accent,
    "--on-accent": t.onAccent,
    "--bg": t.bg,
    "--surface": t.surface,
    "--text": t.text,
    "--muted": t.muted,
    "--line": t.line,
    "--f-display": f.display,
    "--f-body": f.body,
    "--display-case": f.upper ? "uppercase" : "none",
    "--r1": `${r1}px`,
    "--r2": `${r2}px`,
    "--r3": `${r3}px`,
    "--pill": t.corners === "reto" ? "0px" : "999px",
  } as CSSProperties;
}

/** Texto legível sobre uma cor (preto ou branco) */
export function readableOn(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? "#141414" : "#FFFFFF";
}

export const onlyDigits = (s: string) => s.replace(/\D/g, "");
export const waLink = (num: string, text: string) =>
  `https://wa.me/55${onlyDigits(num).replace(/^55/, "")}?text=${encodeURIComponent(text)}`;

export const SALES_WA = "61982762065";
export const SALES_SITE = "https://sites-express-vitrine.sites-express-vitrine.workers.dev";
