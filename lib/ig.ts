// Loads the couple's photo-wall images from public/ig at build time. Drop a
// jpg/png/webp in that folder and it appears on the homepage rail — the
// filename becomes the caption ("2026-03_airport-goodbye.jpg" → "airport
// goodbye"). No code changes needed to add a photo.

import fs from "node:fs";
import path from "node:path";

const IG_DIR = path.join(process.cwd(), "public", "ig");

export type IgPhoto = { src: string; caption: string };

export function getIgPhotos(): IgPhoto[] {
  if (!fs.existsSync(IG_DIR)) return [];
  return fs
    .readdirSync(IG_DIR)
    .filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name))
    .sort()
    .map((name) => ({
      src: `/ig/${name}`,
      caption: name
        .replace(/\.[^.]+$/, "")
        .replace(/^[\d-]*_/, "") // strip a leading date prefix like "2026-03_"
        .replace(/[-_]+/g, " ")
        .trim(),
    }));
}
