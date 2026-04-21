/**
 * versiculoDiario.js
 * Utilidad para obtener el versículo diario correspondiente a la fecha actual.
 * Los datos están en json/versiculos-diarios.json (366 entradas, incluye 29-feb).
 */

import versiculosData from '../../json/versiculos-diarios.json';

const { dailyVerses } = versiculosData;

/**
 * Calcula el día del año para una fecha dada.
 * El 29 de febrero (día bisiesto) devuelve el día 60.
 * @param {Date} date
 * @returns {number} 1–366
 */
export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Devuelve el versículo diario para la fecha indicada.
 * @param {Date} date
 * @returns {{ dayOfYear: number, reference: string, label: string, highlight: string, theme: string, subtheme: string }}
 */
export function getVersiculoDelDia(date = new Date()) {
  const dayOfYear = getDayOfYear(date);

  // Buscar exactamente por dayOfYear
  const entry = dailyVerses.find((v) => v.dayOfYear === dayOfYear);

  // Fallback al día 1 si no se encuentra (no debería ocurrir)
  return entry || dailyVerses[0];
}

/**
 * Devuelve el versículo diario para hoy.
 * @returns {{ dayOfYear: number, reference: string, label: string, highlight: string, theme: string }}
 */
export function getVersiculoHoy() {
  return getVersiculoDelDia(new Date());
}

/**
 * Devuelve los metadatos del tema mensual.
 * @param {number} month 1-12
 * @returns {{ name: string, description: string }}
 */
export function getTemaDelMes(month) {
  const temas = {
    1: { name: 'Propósito', description: 'Nuevo comienzo y llamado divino' },
    2: { name: 'Amor', description: 'El amor de Dios y el amor al prójimo' },
    3: { name: 'Fe', description: 'Confianza y certeza en Dios' },
    4: { name: 'Resurrección', description: 'Vida nueva en Cristo' },
    5: { name: 'Esperanza', description: 'Expectativa en las promesas de Dios' },
    6: { name: 'Sabiduría', description: 'Discernimiento y guía divina' },
    7: { name: 'Identidad', description: 'Quiénes somos en Cristo' },
    8: { name: 'Servicio', description: 'Vivir para los demás' },
    9: { name: 'Perseverancia', description: 'Firmeza en la carrera de fe' },
    10: { name: 'Gratitud', description: 'Acción de gracias en todo tiempo' },
    11: { name: 'Comunidad', description: 'El cuerpo de Cristo y la iglesia' },
    12: { name: 'Encarnación', description: 'El misterio de la Navidad' },
  };
  return temas[month] || temas[1];
}
