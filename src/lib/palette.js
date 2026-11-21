import { useEffect, useState } from "react";

// Extrait les couleurs dominantes d'une image (dans le navigateur, sans serveur).
// Renvoie [{ hex, share }] trié par importance. Résultats mis en cache.
const cache = new Map();

const toHex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

export function extractPalette(src, n = 5) {
  if (cache.has(src)) return cache.get(src);
  const p = new Promise((ok) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      try {
        const S = 72, c = document.createElement("canvas");
        const k = Math.min(S / img.naturalWidth, S / img.naturalHeight);
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
        const x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0, c.width, c.height);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const buckets = new Map();
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 128) continue;
          const key = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4);
          const b = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
          b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2]; b.n++;
          buckets.set(key, b);
        }
        const total = d.length / 4;
        const sorted = [...buckets.values()].map((b) => ({ r: b.r / b.n, g: b.g / b.n, b: b.b / b.n, n: b.n })).sort((a, b) => b.n - a.n);
        // Fusionne les teintes trop proches pour garder des couleurs distinctes.
        const out = [];
        for (const c1 of sorted) {
          const near = out.find((o) => (o.r - c1.r) ** 2 + (o.g - c1.g) ** 2 + (o.b - c1.b) ** 2 < 42 ** 2);
          if (near) near.n += c1.n; else if (out.length < n * 3) out.push({ ...c1 });
        }
        out.sort((a, b) => b.n - a.n);
        ok(out.slice(0, n).map((o) => ({ hex: toHex(o.r, o.g, o.b), share: o.n / total })));
      } catch { ok([]); }
    };
    img.onerror = () => ok([]);
    img.src = src;
  });
  cache.set(src, p);
  return p;
}

export function usePalette(src, enabled = true, n = 5) {
  const [pal, setPal] = useState([]);
  useEffect(() => {
    if (!src || !enabled) return;
    let live = true;
    extractPalette(src, n).then((p) => live && setPal(p));
    return () => { live = false; };
  }, [src, enabled, n]);
  return pal;
}

// Couleur de texte lisible sur un fond donné.
export const inkOn = (hex) => {
  const v = parseInt(hex.slice(1), 16), r = v >> 16, g = (v >> 8) & 255, b = v & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#141414" : "#F6F2EC";
};
