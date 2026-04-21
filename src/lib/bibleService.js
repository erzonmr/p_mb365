/**
 * bibleService.js
 * Abstracción de APIs bíblicas con caché en memoria, timeout y fallback automático.
 *
 * API Principal:  docs-bible-api.netlify.app (5 versiones en español)
 * API Fallback:   api.scripture.api.bible/v1 (NTV, NBLA, LBLA)
 */

const PRIMARY_BASE = 'https://docs-bible-api.netlify.app/.netlify/functions/api';
const FALLBACK_BASE = 'https://api.scripture.api.bible/v1';
const API_BIBLE_KEY = 'lKDNAnTqVMi4Mc32rwonP';

/** IDs de versiones en la API.Bible (fallback) */
const FALLBACK_BIBLE_IDS = {
  '826f63861180e056-01': 'NTV',
  'ce11b813f9a27e20-01': 'NBLA',
  'e3f420b9665abaeb-01': 'LBLA',
};

/** Versiones que usa la API principal */
const PRIMARY_VERSIONS = new Set(['rv1960', 'rv1995', 'nvi', 'dhh', 'pdt']);

/** Caché en memoria (Map). Clave: "version|reference" */
const sessionCache = new Map();

/**
 * Hace un fetch con timeout configurable.
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} timeoutMs
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Consulta la API principal para un capítulo bíblico.
 * @param {string} reference  Ej: "Génesis 1" | "Juan 3"
 * @param {string} version    Ej: "rv1960"
 * @returns {Promise<{verses: Array, reference: string, version: string}>}
 */
async function fetchFromPrimary(reference, version) {
  const url = `${PRIMARY_BASE}/chapter?reference=${encodeURIComponent(reference)}&version=${encodeURIComponent(version)}`;
  const response = await fetchWithTimeout(url, {}, 3000);

  if (!response.ok) {
    throw new Error(`API principal: HTTP ${response.status} para "${reference}" (${version})`);
  }

  const data = await response.json();

  // La API devuelve un array de versículos o un objeto con la data
  if (Array.isArray(data)) {
    return { verses: data, reference, version };
  }
  if (data.verses) {
    return { verses: data.verses, reference, version };
  }
  if (data.text) {
    // Formato alternativo: texto plano
    return { verses: [{ number: 1, text: data.text }], reference, version };
  }

  throw new Error(`API principal: formato de respuesta inesperado para "${reference}"`);
}

/**
 * Consulta la API.Bible (fallback) para un capítulo bíblico.
 * @param {string} reference  Ej: "Juan 3"
 * @param {string} bibleId    ID de la Biblia en API.Bible
 * @returns {Promise<{verses: Array, reference: string, version: string}>}
 */
async function fetchFromFallback(reference, bibleId) {
  // La API.Bible requiere un chapterId con formato "JHN.3"
  // Intentamos resolver la referencia a un chapterId
  const chapterId = resolveChapterId(reference);
  if (!chapterId) {
    throw new Error(`No se pudo resolver el ID de capítulo para: "${reference}"`);
  }

  const url = `${FALLBACK_BASE}/bibles/${bibleId}/chapters/${chapterId}/verses?content-type=text&include-notes=false&include-titles=false`;
  const response = await fetchWithTimeout(
    url,
    { headers: { 'api-key': API_BIBLE_KEY } },
    3000,
  );

  if (!response.ok) {
    throw new Error(`API fallback: HTTP ${response.status} para "${reference}"`);
  }

  const data = await response.json();
  const verseLabel = FALLBACK_BIBLE_IDS[bibleId] || bibleId;

  const verses = (data.data || []).map((v) => ({
    number: parseInt(v.reference?.split('.').pop() || '0', 10),
    text: v.content?.replace(/<[^>]*>/g, '').trim() || '',
    id: v.id,
  }));

  return { verses, reference, version: verseLabel };
}

/**
 * Convierte referencias en español a IDs de la API.Bible.
 * Ej: "Juan 3" → "JHN.3", "Génesis 1" → "GEN.1"
 * Cobertura básica para los libros más comunes.
 * @param {string} reference
 * @returns {string|null}
 */
function resolveChapterId(reference) {
  const bookMap = {
    'Génesis': 'GEN', 'Genesis': 'GEN',
    'Éxodo': 'EXO', 'Exodo': 'EXO',
    'Levítico': 'LEV', 'Levitico': 'LEV',
    'Números': 'NUM', 'Numeros': 'NUM',
    'Deuteronomio': 'DEU',
    'Josué': 'JOS', 'Josue': 'JOS',
    'Jueces': 'JDG',
    'Rut': 'RUT',
    '1 Samuel': '1SA',
    '2 Samuel': '2SA',
    '1 Reyes': '1KI',
    '2 Reyes': '2KI',
    '1 Crónicas': '1CH', '1 Cronicas': '1CH',
    '2 Crónicas': '2CH', '2 Cronicas': '2CH',
    'Esdras': 'EZR',
    'Nehemías': 'NEH', 'Nehemias': 'NEH',
    'Ester': 'EST',
    'Job': 'JOB',
    'Salmos': 'PSA', 'Salmo': 'PSA',
    'Proverbios': 'PRO',
    'Eclesiastés': 'ECC', 'Eclesiastes': 'ECC',
    'Cantares': 'SNG',
    'Isaías': 'ISA', 'Isaias': 'ISA',
    'Jeremías': 'JER', 'Jeremias': 'JER',
    'Lamentaciones': 'LAM',
    'Ezequiel': 'EZK',
    'Daniel': 'DAN',
    'Oseas': 'HOS',
    'Joel': 'JOL',
    'Amós': 'AMO', 'Amos': 'AMO',
    'Abdías': 'OBA', 'Abdias': 'OBA',
    'Jonás': 'JON', 'Jonas': 'JON',
    'Miqueas': 'MIC',
    'Nahúm': 'NAM', 'Nahum': 'NAM',
    'Habacuc': 'HAB',
    'Sofonías': 'ZEP', 'Sofonias': 'ZEP',
    'Hageo': 'HAG',
    'Zacarías': 'ZEC', 'Zacarias': 'ZEC',
    'Malaquías': 'MAL', 'Malaquias': 'MAL',
    'Mateo': 'MAT',
    'Marcos': 'MRK',
    'Lucas': 'LUK',
    'Juan': 'JHN',
    'Hechos': 'ACT',
    'Romanos': 'ROM',
    '1 Corintios': '1CO',
    '2 Corintios': '2CO',
    'Gálatas': 'GAL', 'Galatas': 'GAL',
    'Efesios': 'EPH',
    'Filipenses': 'PHP',
    'Colosenses': 'COL',
    '1 Tesalonicenses': '1TH',
    '2 Tesalonicenses': '2TH',
    '1 Timoteo': '1TI',
    '2 Timoteo': '2TI',
    'Tito': 'TIT',
    'Filemón': 'PHM', 'Filemon': 'PHM',
    'Hebreos': 'HEB',
    'Santiago': 'JAS',
    '1 Pedro': '1PE',
    '2 Pedro': '2PE',
    '1 Juan': '1JN',
    '2 Juan': '2JN',
    '3 Juan': '3JN',
    'Judas': 'JUD',
    'Apocalipsis': 'REV',
  };

  // Buscar patrón: "Nombre Capítulo" o "N Nombre Capítulo"
  const match = reference.match(/^(.+?)\s+(\d+)(?::\d+(?:-\d+)?)?$/);
  if (!match) return null;

  const [, bookName, chapter] = match;
  const bookCode = bookMap[bookName.trim()];
  if (!bookCode) return null;

  return `${bookCode}.${chapter}`;
}

/**
 * Obtiene el texto de un capítulo bíblico.
 * Intenta la API principal primero; si falla, usa el fallback.
 *
 * @param {string} reference   Ej: "Juan 3", "Génesis 1"
 * @param {string} versionId   ID de la versión (ej: "rv1960", "826f63861180e056-01")
 * @returns {Promise<{verses: Array<{number: number, text: string}>, reference: string, version: string}>}
 */
export async function getChapter(reference, versionId = 'rv1960') {
  const cacheKey = `${versionId}|${reference}`;

  if (sessionCache.has(cacheKey)) {
    return sessionCache.get(cacheKey);
  }

  let result;

  if (PRIMARY_VERSIONS.has(versionId)) {
    try {
      result = await fetchFromPrimary(reference, versionId);
    } catch (primaryError) {
      // Fallback: usar NTV como versión alternativa
      try {
        result = await fetchFromFallback(reference, '826f63861180e056-01');
      } catch {
        throw new Error(`No se pudo obtener el capítulo "${reference}". ${primaryError.message}`);
      }
    }
  } else {
    // Es una versión del fallback (API.Bible)
    try {
      result = await fetchFromFallback(reference, versionId);
    } catch (fallbackError) {
      // Si el fallback falla, intenta la API principal con rv1960
      try {
        result = await fetchFromPrimary(reference, 'rv1960');
      } catch {
        throw new Error(`No se pudo obtener el capítulo "${reference}". ${fallbackError.message}`);
      }
    }
  }

  sessionCache.set(cacheKey, result);
  return result;
}

/**
 * Limpia la caché de sesión (útil para testing).
 */
export function clearCache() {
  sessionCache.clear();
}

/**
 * Convierte un versículo individual (referencia "Libro C:V").
 * @param {string} reference  Ej: "Juan 3:16"
 * @param {string} versionId
 * @returns {Promise<string>} El texto del versículo
 */
export async function getVerse(reference, versionId = 'rv1960') {
  // Extraer capítulo de la referencia
  const match = reference.match(/^(.+\s+\d+):\d+/);
  if (!match) {
    throw new Error(`Referencia de versículo inválida: "${reference}"`);
  }

  const chapterRef = match[1];
  const verseNum = parseInt(reference.split(':')[1], 10);

  const chapter = await getChapter(chapterRef, versionId);
  const verse = chapter.verses.find((v) => v.number === verseNum);

  return verse?.text || '';
}
