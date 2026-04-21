// Endpoint dinámico que sirve los archivos de planes de lectura.
// Ruta: /api/plans/{planId}.json
// Cached 24h en CDN para minimizar reads de disco.

import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

const VALID_PLANS = new Set([
  'plan_anual',
  'plan_cronologico',
  'plan_canonico',
  'plan_combinado',
  'plan_trimestral',
  'plan_180_NT_Salmos',
]);

export async function GET({ params }) {
  const planId = params.plan;

  if (!VALID_PLANS.has(planId)) {
    return new Response(JSON.stringify({ error: 'Plan no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const filePath = path.join(process.cwd(), 'json', `${planId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al cargar el plan' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
