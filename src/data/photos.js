import { PHOTO_INFO } from "./photoInfo.js";

// Toutes les images de src/assets/photos/ sont chargées automatiquement (tri par nom).
// Titres et tags : voir photoInfo.js. title est { fr, en } (utiliser p(photo.title) dans les composants).
const files = import.meta.glob("../assets/photos/*.{jpg,jpeg,png,webp,avif}", { eager: true, query: "?url", import: "default" });

export const TAG_LABELS = {
  bw: { fr: "Noir et blanc", en: "Black & white" }, golden: "Golden hour", table: "Table", street: "Street", nuit: { fr: "Nuit", en: "Night" }, archi: { fr: "Architecture", en: "Architecture" },
};

export const PHOTOS = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const key = path.split("/").pop().replace(/\.[^.]+$/, "");
    const i = PHOTO_INFO[key] || {};
    const fr = i.title || key.replace(/[-_]/g, " ");
    return { key, src, title: { fr, en: i.title_en || fr }, tags: i.tags || [], ratio: i.ratio || 4 / 5, exif: i.exif || "" };
  });
