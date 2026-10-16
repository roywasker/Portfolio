import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = new URL('image/posters/my-passwords/', root);
const output = new URL('public/images/projects/', root);
// Repository screenshots rendered with synthetic accounts by the app's tests.
// Compose a new poster as SVG, preserving the screenshots without retouching.
const screens = await Promise.all(['welcome', 'passwords', 'add-password'].map(async name =>
  `data:image/png;base64,${(await readFile(new URL(`${name}.png`, source))).toString('base64')}`));
const phone = (screen, x, y, width, height, id) => `
  <defs><clipPath id="screen-${id}"><rect x="${x + 8}" y="${y + 12}" width="${width - 16}" height="${height - 24}" rx="22"/></clipPath></defs>
  <rect x="${x + 7}" y="${y + 12}" width="${width}" height="${height}" rx="31" fill="#020910" opacity=".45"/>
  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="31" fill="#020910" stroke="#79999e" stroke-width="2"/>
  <image href="${screen}" x="${x + 8}" y="${y + 12}" width="${width - 16}" height="${height - 24}" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen-${id})"/>
  <rect x="${x + width / 2 - 28}" y="${y + 4}" width="56" height="5" rx="2.5" fill="#25343b"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#102c40"/><stop offset="1" stop-color="#050f1b"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="#77d8cc" stop-opacity=".12"/><stop offset="1" stop-color="#77d8cc" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <ellipse cx="940" cy="370" rx="460" ry="420" fill="url(#glow)"/>
  <path d="M0 40h1280M0 760h1280" stroke="#77d8cc" stroke-opacity=".05"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="86" y="224" fill="#abc5cf" font-size="16" letter-spacing="4">ANDROID · LOCAL PASSWORD VAULT</text>
    <text x="78" y="358" fill="#f0f5ff" font-size="112" letter-spacing="-5">My</text>
    <text x="78" y="472" fill="#77d8cc" font-size="96" font-weight="700" letter-spacing="-5">Passwords</text>
    <text x="86" y="534" fill="#b2c6d8" font-size="23">Biometric access. Encrypted storage.</text>
    <rect x="86" y="582" width="177" height="39" rx="19.5" fill="#153941" stroke="#77d8cc" stroke-opacity=".2"/>
    <text x="174.5" y="607" text-anchor="middle" fill="#77d8cc" font-size="14" letter-spacing="1">KOTLIN + COMPOSE</text>
  </g>
  ${phone(screens[0], 775, 108, 270, 585, 'welcome')}
  ${phone(screens[2], 636, 326, 190, 412, 'add')}
  ${phone(screens[1], 1000, 258, 206, 446, 'passwords')}
</svg>`;
await writeFile(new URL('poster.svg', source), svg);
const image = sharp(Buffer.from(svg));
await image.clone().avif({ quality: 65, effort: 6 }).toFile(fileURLToPath(new URL('my-passwords.avif', output)));
await image.clone().resize(640, 400).avif({ quality: 60, effort: 6 }).toFile(fileURLToPath(new URL('my-passwords-320.avif', output)));
console.log('Created MyPasswords poster: 1280×800 and 640×400 AVIF.');
