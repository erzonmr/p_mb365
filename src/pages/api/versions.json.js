// Endpoint que sirve el catálogo de versiones bíblicas.
// Ruta: /api/versions.json

import versionsData from '../../../json/versions.json';

export const prerender = true; // SSG: el catálogo no cambia

export function GET() {
  return new Response(JSON.stringify(versionsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=604800', // 7 días
    },
  });
}
