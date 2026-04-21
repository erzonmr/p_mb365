// Endpoint dinámico que sirve los archivos de planes de lectura.
// Ruta: /api/plans/{planId}.json
// Usamos SSG (prerender = true) para evitar leer de disco en runtime.

import plan_anual from '../../../../json/plan_anual.json';
import plan_cronologico from '../../../../json/plan_cronologico.json';
import plan_canonico from '../../../../json/plan_canonico.json';
import plan_combinado from '../../../../json/plan_combinado.json';
import plan_trimestral from '../../../../json/plan_trimestral.json';
import plan_180_NT_Salmos from '../../../../json/plan_180_NT_Salmos.json';

export const prerender = true;

const PLANS_DATA = {
  plan_anual,
  plan_cronologico,
  plan_canonico,
  plan_combinado,
  plan_trimestral,
  plan_180_NT_Salmos,
};

export function getStaticPaths() {
  return [
    { params: { plan: 'plan_anual' } },
    { params: { plan: 'plan_cronologico' } },
    { params: { plan: 'plan_canonico' } },
    { params: { plan: 'plan_combinado' } },
    { params: { plan: 'plan_trimestral' } },
    { params: { plan: 'plan_180_NT_Salmos' } },
  ];
}

export async function GET({ params }) {
  const planId = params.plan;
  const data = PLANS_DATA[planId];

  if (!data) {
    return new Response(JSON.stringify({ error: 'Plan no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}
