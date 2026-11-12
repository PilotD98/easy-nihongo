#!/usr/bin/env node
/* Generates the PWA icons in assets/icons without any dependencies.
   The mark is three "stepping stones" rising left to right on an indigo tile.
   Outputs: icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'icons');
fs.mkdirSync(OUT, { recursive: true });

const BG = [0x3b, 0x5b, 0xdb];
const STONES = [ // in a 64-unit box: x, y, r, alpha
  [18, 46, 6, 0.70],
  [32, 32, 8, 0.85],
  [47, 17, 10, 1.00]
];

/* ---------- PNG encoder ---------- */
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---------- Rasteriser (signed-distance anti-aliasing) ---------- */
function roundedRectAlpha(px, py, size, radius) {
  const hx = size / 2, hy = size / 2;
  const qx = Math.abs(px - hx) - (hx - radius), qy = Math.abs(py - hy) - (hy - radius);
  const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
  return clamp(0.5 - d, 0, 1);
}
function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

function render(size, { maskable = false, opaque = false, scale = 1, offset = 0 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const radius = maskable || opaque ? 0 : size * 0.22;
  const unit = (size * scale) / 64;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5;
      const bgA = radius ? roundedRectAlpha(px, py, size, radius) : 1;
      let r = BG[0], g = BG[1], b = BG[2];
      for (const [sx, sy, sr, sa] of STONES) {
        const cx = sx * unit + offset, cy = sy * unit + offset;
        const d = Math.hypot(px - cx, py - cy) - sr * unit;
        const a = clamp(0.5 - d, 0, 1) * sa;
        r = r + (255 - r) * a; g = g + (255 - g) * a; b = b + (255 - b) * a;
      }
      const i = (y * size + x) * 4;
      buf[i] = Math.round(r); buf[i + 1] = Math.round(g); buf[i + 2] = Math.round(b); buf[i + 3] = Math.round(bgA * 255);
    }
  }
  return encodePNG(size, size, buf);
}

fs.writeFileSync(path.join(OUT, 'icon-192.png'), render(192));
fs.writeFileSync(path.join(OUT, 'icon-512.png'), render(512));
// Maskable: full-bleed background, artwork inside the central 80% safe zone.
fs.writeFileSync(path.join(OUT, 'icon-maskable-512.png'), render(512, { maskable: true, scale: 0.8, offset: 512 * 0.1 }));
// Apple touch icon: opaque square, iOS rounds the corners itself.
fs.writeFileSync(path.join(OUT, 'apple-touch-icon.png'), render(180, { opaque: true, scale: 0.9, offset: 180 * 0.05 }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#3b5bdb"/>
  <circle cx="18" cy="46" r="6" fill="#fff" opacity=".7"/>
  <circle cx="32" cy="32" r="8" fill="#fff" opacity=".85"/>
  <circle cx="47" cy="17" r="10" fill="#fff"/>
</svg>
`;
fs.writeFileSync(path.join(OUT, 'icon.svg'), svg);
console.log('Icons written to', OUT);
