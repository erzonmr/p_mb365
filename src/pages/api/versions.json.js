// Endpoint que sirve el catálogo de traducciones disponibles en español.
// Ruta: /api/versions.json

import { getVersions } from '../../lib/bibleService.js';

export const prerender = false;

export async function GET() {
  try {
    const versions = await getVersions();
    return new Response(JSON.stringify(versions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error?.message || 'No fue posible cargar traducciones.',
      versions: [],
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
