import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Laura Avatar SVG
const lauraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="lauraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8e8e93"/>
      <stop offset="100%" stop-color="#636366"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="50" fill="url(#lauraGrad)"/>
  <text x="50" y="63" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="44" font-weight="600" fill="#ffffff" text-anchor="middle">L</text>
</svg>`;
fs.writeFileSync(path.join(assetsDir, 'avatar-laura.svg'), lauraSvg);
fs.writeFileSync(path.join(assetsDir, 'avatar-laura.png'), lauraSvg); // Web browser can load SVG even if referenced as .png or .svg

// 2. FBI Meme / Image SVG
const fbiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" rx="16" fill="#182234"/>
  <rect x="15" y="15" width="370" height="270" rx="12" fill="#0d1420" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="200" cy="110" r="50" fill="#f59e0b" fill-opacity="0.1" stroke="#f59e0b" stroke-width="4"/>
  <polygon points="200,75 212,100 240,103 218,122 225,148 200,133 175,148 182,122 160,103 188,100" fill="#f59e0b"/>
  <text x="200" y="195" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">FBI WARNING</text>
  <text x="200" y="230" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="16" font-weight="500" fill="#94a3b8" text-anchor="middle">FEDERAL BUREAU OF INVESTIGATION</text>
  <text x="200" y="255" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="14" font-weight="600" fill="#ef4444" text-anchor="middle">OFFICIAL NOTICE</text>
</svg>`;
fs.writeFileSync(path.join(assetsDir, 'fbi.svg'), fbiSvg);
fs.writeFileSync(path.join(assetsDir, 'fbi.png'), fbiSvg);

console.log('Successfully generated public/assets/avatar-laura.svg and fbi.svg');
