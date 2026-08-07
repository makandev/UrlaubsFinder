import sharp from "sharp";
import { readFileSync } from "node:fs";
const svg = readFileSync("scripts/icon.svg");
const out = "public";
const tasks = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "favicon-32.png", size: 32 },
];
for (const t of tasks) {
  await sharp(svg).resize(t.size, t.size).png().toFile(`${out}/${t.file}`);
  console.log("✓", t.file);
}
// Maskable: auf vollflächigen Marken-Hintergrund legen (keine transparenten Ecken)
await sharp(svg)
  .resize(410, 410) // ~80% Safe-Zone
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#1d3a34" })
  .png()
  .toFile(`${out}/icon-maskable-512.png`);
console.log("✓ icon-maskable-512.png");
