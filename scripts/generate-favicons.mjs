import { readFile, writeFile, mkdir } from 'node:fs/promises';
import ts from 'typescript';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// Reuse the website palette. White-backed icons use the darker light-mode colors.
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('src/lib/accent-themes.ts', root), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { accentThemes } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const svg = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" fill="white"/><text x="31" y="46" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" letter-spacing="-2" fill="hsl(${color})">Me</text></svg>`;

await mkdir(new URL('public/favicons/', root), { recursive: true });
for (const theme of accentThemes) {
  await writeFile(new URL(`public/favicons/${theme.id}.svg`, root), svg(theme.light));
  await sharp(Buffer.from(svg(theme.light))).resize(64, 64).png().toFile(fileURLToPath(new URL(`public/favicons/${theme.id}.png`, root)));
}

const defaultSVG = Buffer.from(svg(accentThemes[0].light));
await sharp(defaultSVG).resize(512, 512).png().toFile(fileURLToPath(new URL('public/favicon.png', root)));

// ICO directory with PNG frames for both small browser tabs and high-DPI displays.
const sizes = [16, 24, 32, 48, 64, 128, 256];
const frames = await Promise.all(sizes.map(size => sharp(defaultSVG).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i] === 256 ? 0 : sizes[i];
  header[entry + 1] = header[entry];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(new URL('public/favicon.ico', root), Buffer.concat([header, ...frames]));
console.log('Generated 5 theme SVGs and PNGs, default PNG and 7-size ICO.');
