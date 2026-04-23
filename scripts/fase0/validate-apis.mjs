/**
 * Validación simple de Free Use Bible API.
 */

const API_BASE = 'https://bible.helloao.org/api';
const references = [
  { book: 'GEN', chapter: 1 },
  { book: 'PSA', chapter: 23 },
  { book: 'JHN', chapter: 3 },
];

async function check(url, options = {}) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, options);
    return {
      ok: response.ok,
      status: response.status,
      elapsedMs: Date.now() - startedAt,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      elapsedMs: Date.now() - startedAt,
      error: error.message,
    };
  }
}

async function main() {
  const output = {
    testedAt: new Date().toISOString(),
    baseUrl: API_BASE,
    translations: null,
    chapterChecks: [],
  };

  const translationsRes = await check(`${API_BASE}/available_translations.json`);
  output.translations = translationsRes;

  if (translationsRes.ok) {
    const data = await fetch(`${API_BASE}/available_translations.json`).then((r) => r.json());
    const spanish = (data.translations || []).filter((t) => {
      const lang = String(t.language || '').toLowerCase();
      const names = `${t.languageName || ''} ${t.languageEnglishName || ''}`.toLowerCase();
      return lang === 'spa' || lang === 'es' || names.includes('spanish') || names.includes('español');
    });

    output.spanishTranslationCount = spanish.length;
    output.sampleTranslation = spanish[0]?.id || null;

    if (spanish[0]?.id) {
      for (const ref of references) {
        const url = `${API_BASE}/${spanish[0].id}/${ref.book}/${ref.chapter}.json`;
        const result = await check(url);
        output.chapterChecks.push({ translation: spanish[0].id, ...ref, ...result });
      }
    }
  }

  console.log(JSON.stringify(output, null, 2));
}

main();
