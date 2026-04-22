import { BIBLE_BOOKS } from '../lib/bibleCatalog.js';

export async function GET() {
  const base = 'https://www.mibiblia365.com';
  const staticRoutes = [
    '/',
    '/leer-hoy',
    '/planes',
    '/plan-completo',
    '/mi-espacio',
    '/buscar',
    '/acerca',
    '/preguntas-frecuentes',
  ];

  const dynamicSeedRoutes = BIBLE_BOOKS.map((book) => `/biblia/${book.slug}/1`);
  const routes = [...staticRoutes, ...dynamicSeedRoutes];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((route) => `  <url><loc>${base}${route}</loc><lastmod>${now}</lastmod></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
