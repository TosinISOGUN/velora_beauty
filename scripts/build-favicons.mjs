// Builds the favicon set from the VELORA logo: the VB monogram is cropped out of the full logo
// (the monogram sits above the wordmark), centred on a rounded square in the logo's own background
// colour, then written as PNG and ICO sizes. Run with: node scripts/build-favicons.mjs
// Source: assets-source/brand/velora-logo.png (gitignored with the other originals).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const source = path.join(root, "assets-source/brand/velora-logo.png");

if (!fs.existsSync(source)) {
  console.error(
    `Missing ${path.relative(root, source)}. Save the VELORA logo there and run this again.`,
  );
  process.exit(1);
}

const meta = await sharp(source).metadata();
const w = meta.width ?? 0;
const h = meta.height ?? 0;

// The logo's background colour, sampled from the top-left corner.
const corner = await sharp(source)
  .extract({ left: 2, top: 2, width: 1, height: 1 })
  .raw()
  .toBuffer();
const bg = { r: corner[0] ?? 249, g: corner[1] ?? 227, b: corner[2] ?? 222, alpha: 1 };

// Take the top part of the logo (the monogram), then trim the empty background around it.
const top = await sharp(source)
  .extract({ left: 0, top: 0, width: w, height: Math.round(h * 0.6) })
  .toBuffer();
const monogram = await sharp(top).trim({ background: bg, threshold: 24 }).toBuffer();

async function icon(size) {
  const pad = Math.round(size * 0.16);
  const inner = size - pad * 2;
  const mark = await sharp(monogram)
    .resize({ width: inner, height: inner, fit: "contain", background: bg })
    .toBuffer();
  const radius = Math.round(size * 0.22);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`,
  );
  const square = await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
  return sharp(square)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

fs.writeFileSync(path.join(pub, "apple-touch-icon.png"), await icon(180));
fs.writeFileSync(path.join(pub, "favicon-192.png"), await icon(192));
fs.writeFileSync(path.join(pub, "favicon-512.png"), await icon(512));

// A single-image ICO that wraps a 32px PNG.
const png32 = await icon(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([header, png32]));
console.log("favicons written");
