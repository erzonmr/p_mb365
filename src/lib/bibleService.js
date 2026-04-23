/**
 * bibleService.js
 * Adaptador de Free Use Bible API (https://bible.helloao.org/).
 */

import { parseReference } from './bibleCatalog.js';

const API_BASE = 'https://bible.helloao.org/api';
const SPANISH_LANG_CODES = new Set(['spa', 'es', 'spanish']);

const sessionCache = new Map();
let spanishTranslationsCache = null;

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function isSpanishTranslation(translation) {
  const raw = [translation.language, translation.languageName, translation.languageEnglishName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if ([translation.language, translation.languageName, translation.languageEnglishName]
    .some((value) => SPANISH_LANG_CODES.has(String(value).toLowerCase()))) {
    return true;
  }

  return raw.includes('spanish') || raw.includes('español') || raw.includes('espanol');
}

function mapTranslationToVersion(translation, index = 0) {
  const shortLabel = translation.englishName || translation.name || translation.id;
  return {
    id: translation.id,
    label: translation.name || shortLabel,
    shortLabel: shortLabel.slice(0, 16),
    language: translation.language || 'spa',
    provider: 'free-use-bible-api',
    default: index === 0,
  };
}

async function fetchSpanishTranslations() {
  if (spanishTranslationsCache) return spanishTranslationsCache;

  const response = await fetchWithTimeout(`${API_BASE}/available_translations.json`, {}, 5000);
  if (!response.ok) {
    throw new Error(`No se pudo consultar traducciones (HTTP ${response.status}).`);
  }

  const data = await response.json();
  const translations = Array.isArray(data?.translations) ? data.translations : [];
  const spanish = translations.filter(isSpanishTranslation);

  spanishTranslationsCache = spanish.map(mapTranslationToVersion);
  return spanishTranslationsCache;
}

async function resolveVersionId(versionId) {
  const versions = await fetchSpanishTranslations();
  if (!versions.length) throw new Error('No hay traducciones en español disponibles en la API.');
  if (versionId && versions.some((v) => v.id === versionId)) return versionId;
  return versions[0].id;
}

function extractVerseText(rawVerse) {
  if (typeof rawVerse === 'string') return rawVerse;
  if (!rawVerse || typeof rawVerse !== 'object') return '';

  if (typeof rawVerse.text === 'string') return rawVerse.text;
  if (typeof rawVerse.content === 'string') return rawVerse.content;
  if (Array.isArray(rawVerse.content)) {
    return rawVerse.content
      .map((part) => (typeof part === 'string' ? part : part?.text || part?.content || ''))
      .join(' ')
      .trim();
  }

  return '';
}

function normalizeChapterResponse(payload, parsedReference, requestedReference, resolvedVersionId) {
  const chapterNode = payload?.chapter || payload;
  const content = Array.isArray(chapterNode?.content)
    ? chapterNode.content
    : Array.isArray(payload?.content)
      ? payload.content
      : [];

  const verses = content
    .map((item, idx) => {
      const number = Number.parseInt(item?.number || item?.verse || `${idx + 1}`, 10);
      const text = extractVerseText(item).replace(/\s+/g, ' ').trim();
      return Number.isNaN(number) || !text ? null : { number, text };
    })
    .filter(Boolean);

  return {
    verses,
    reference: requestedReference,
    version: resolvedVersionId,
    bookName: parsedReference.book.name,
  };
}

export async function getVersions() {
  return fetchSpanishTranslations();
}

export async function getChapter(reference, versionId = '') {
  const parsedReference = parseReference(reference);
  if (!parsedReference) {
    throw new Error(`Referencia inválida: "${reference}".`);
  }

  const resolvedVersionId = await resolveVersionId(versionId);
  const cacheKey = `${resolvedVersionId}|${parsedReference.book.apiId}|${parsedReference.chapter}`;

  if (sessionCache.has(cacheKey)) return sessionCache.get(cacheKey);

  const url = `${API_BASE}/${encodeURIComponent(resolvedVersionId)}/${parsedReference.book.apiId}/${parsedReference.chapter}.json`;
  const response = await fetchWithTimeout(url, {}, 5000);

  if (!response.ok) {
    throw new Error(`No se pudo obtener ${reference} en ${resolvedVersionId} (HTTP ${response.status}).`);
  }

  const payload = await response.json();
  const result = normalizeChapterResponse(payload, parsedReference, reference, resolvedVersionId);

  if (!result.verses.length) {
    throw new Error(`La respuesta de la API no incluyó versículos para ${reference}.`);
  }

  sessionCache.set(cacheKey, result);
  return result;
}

export function clearCache() {
  sessionCache.clear();
}

export async function getVerse(reference, versionId = '') {
  const parsedReference = parseReference(reference);
  if (!parsedReference || !parsedReference.verseStart) {
    throw new Error(`Referencia de versículo inválida: "${reference}".`);
  }

  const chapter = await getChapter(`${parsedReference.book.name} ${parsedReference.chapter}`, versionId);
  const verse = chapter.verses.find((v) => v.number === parsedReference.verseStart);
  return verse?.text || '';
}
