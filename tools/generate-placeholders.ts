/**
 * Genera imágenes placeholder SVG para productos, categorías y zonas.
 * Se ejecutan antes de astro build para tener imágenes reales sin depender de archivos externos.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const imgDir = resolve(root, 'public/img/placeholder');
mkdirSync(imgDir, { recursive: true });

function svg(text: string, bg: string, color = '#ffffff') {
  const lines = text.split(' ').slice(0, 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bg}"/>
    <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="20" fill="${color}" text-anchor="middle" dominant-baseline="middle">${lines.join(' ')}</text>
  </svg>`;
}

const products = JSON.parse(readFileSync(resolve(root, 'src/tenant/data/products.json'), 'utf-8')) as any[];
const categories = JSON.parse(readFileSync(resolve(root, 'src/tenant/data/categories.json'), 'utf-8')) as any[];
const zones = JSON.parse(readFileSync(resolve(root, 'src/tenant/data/zones.json'), 'utf-8')) as any[];

let count = 0;
for (const p of products) {
  const slug = p.slug || p.id;
  writeFileSync(resolve(imgDir, `product-${slug}.svg`), svg(p.name, '#e2e8f0'));
  count++;
}
for (const c of categories) {
  if (!c.parentId) {
    writeFileSync(resolve(imgDir, `category-${c.slug}.svg`), svg(c.name, '#cbd5e1'));
    count++;
  }
}
for (const z of zones) {
  writeFileSync(resolve(imgDir, `zone-${z.slug}.svg`), svg(z.name, '#bbf7d0'));
  count++;
}

console.log(`✓ ${count} placeholders SVG generados en public/img/placeholder/`);
