import type { APIRoute } from 'astro';
import products from '../tenant/data/products.json';
import categories from '../tenant/data/categories.json';
import zones from '../tenant/data/zones.json';
import segments from '../tenant/data/segments.json';

const SITE = 'https://aguaspachacamac.pe';

export const GET: APIRoute = () => {
  const urls: string[] = [
    '/',
    '/productos',
    '/categorias',
    '/zonas',
    '/negocios',
    '/cotizar',
    '/carrito',
    '/nosotros',
    '/contacto',
  ];

  // Product pages
  for (const p of products as any[]) {
    urls.push(`/producto/${p.slug}`);
  }

  // Category pages
  for (const c of categories as any[]) {
    if (!c.parentId) urls.push(`/productos/${c.slug}`);
  }

  // Zone pages
  for (const z of zones as any[]) {
    urls.push(`/zonas/${z.slug}`);
  }

  // Segment pages
  for (const s of segments as any[]) {
    urls.push(`/negocios/${s.slug}`);
  }

  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
