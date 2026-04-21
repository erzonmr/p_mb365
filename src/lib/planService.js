/**
 * planService.js
 * Carga y gestiona datos de planes de lectura.
 * Los planes se obtienen desde el endpoint /api/plans/{id}.json
 * con caché en sesión para evitar fetches repetidos.
 */

/** Caché de planes en sesión (Map: planId → Array de días) */
const planCache = new Map();

/** Metadatos de planes disponibles (sin cargar el JSON completo) */
export const PLAN_META = {
  plan_anual: { nombre: 'Biblia Anual', dias: 365, categoria: 'anual' },
  plan_cronologico: { nombre: 'Plan Cronológico', dias: 365, categoria: 'anual' },
  plan_canonico: { nombre: 'Plan Canónico', dias: 365, categoria: 'anual' },
  plan_combinado: { nombre: 'Plan Combinado', dias: 365, categoria: 'anual' },
  plan_trimestral: { nombre: 'NT en 90 días', dias: 90, categoria: 'parcial' },
  plan_180_NT_Salmos: { nombre: 'NT + Salmos 180 días', dias: 180, categoria: 'parcial' },
};

/**
 * Carga un plan de lectura desde el endpoint API.
 * @param {string} planId  ID del plan (ej: "plan_anual")
 * @returns {Promise<Array<{dia: number, porciones: string[]}>>}
 */
export async function loadPlan(planId) {
  if (planCache.has(planId)) {
    return planCache.get(planId);
  }

  const response = await fetch(`/api/plans/${planId}.json`);
  if (!response.ok) {
    throw new Error(`No se pudo cargar el plan "${planId}": HTTP ${response.status}`);
  }

  const data = await response.json();
  planCache.set(planId, data);
  return data;
}

/**
 * Obtiene las porciones de lectura para un día específico.
 * @param {string} planId  ID del plan
 * @param {number} day     Número de día (1-365)
 * @returns {Promise<string[]>}  Array de referencias (ej: ["Génesis 1", "Salmos 1"])
 */
export async function getReadingsForDay(planId, day) {
  const plan = await loadPlan(planId);
  const entry = plan.find((d) => d.dia === day);
  return entry?.porciones || [];
}

/**
 * Devuelve el nombre legible de un plan.
 * @param {string} planId
 * @returns {string}
 */
export function getPlanName(planId) {
  return PLAN_META[planId]?.nombre || planId;
}

/**
 * Devuelve el número total de días de un plan.
 * @param {string} planId
 * @returns {number}
 */
export function getPlanDays(planId) {
  return PLAN_META[planId]?.dias || 365;
}
