/**
 * Genera el índice estático de búsqueda para el buscador instantáneo.
 * Lee los datos del tenant (productos y categorías) y escribe public/search-index.json.
 * Se ejecuta antes de astro build.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const productsPath = resolve(root, 'src/tenant/data/products.json');
const categoriesPath = resolve(root, 'src/tenant/data/categories.json');
const outPath = resolve(root, 'public/search-index.json');

const products = JSON.parse(readFileSync(productsPath, 'utf-8')) as any[];
const categories = JSON.parse(readFileSync(categoriesPath, 'utf-8')) as any[];

const categoryById = new Map(categories.map((c: any) => [c.id, c]));

const index = products.map((p: any) => {
  const category = categoryById.get(p.categoryId);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: category?.name ?? p.categoryId,
    price: p.presentations?.[0]?.retailPrices?.priceFor?.(1)?.amount ?? 0,
    available: p.available ?? true,
    featured: p.featured ?? false,
  };
});

writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(`✓ search-index generado con ${index.length} productos en public/search-index.json`);
