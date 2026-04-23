export const BIBLE_BOOKS = [
  { slug: 'genesis', name: 'Génesis', testament: 'at', chapters: 50, apiId: 'GEN' },
  { slug: 'exodo', name: 'Éxodo', testament: 'at', chapters: 40, apiId: 'EXO' },
  { slug: 'levitico', name: 'Levítico', testament: 'at', chapters: 27, apiId: 'LEV' },
  { slug: 'numeros', name: 'Números', testament: 'at', chapters: 36, apiId: 'NUM' },
  { slug: 'deuteronomio', name: 'Deuteronomio', testament: 'at', chapters: 34, apiId: 'DEU' },
  { slug: 'josue', name: 'Josué', testament: 'at', chapters: 24, apiId: 'JOS' },
  { slug: 'jueces', name: 'Jueces', testament: 'at', chapters: 21, apiId: 'JDG' },
  { slug: 'rut', name: 'Rut', testament: 'at', chapters: 4, apiId: 'RUT' },
  { slug: '1-samuel', name: '1 Samuel', testament: 'at', chapters: 31, apiId: '1SA' },
  { slug: '2-samuel', name: '2 Samuel', testament: 'at', chapters: 24, apiId: '2SA' },
  { slug: '1-reyes', name: '1 Reyes', testament: 'at', chapters: 22, apiId: '1KI' },
  { slug: '2-reyes', name: '2 Reyes', testament: 'at', chapters: 25, apiId: '2KI' },
  { slug: '1-cronicas', name: '1 Crónicas', testament: 'at', chapters: 29, apiId: '1CH' },
  { slug: '2-cronicas', name: '2 Crónicas', testament: 'at', chapters: 36, apiId: '2CH' },
  { slug: 'esdras', name: 'Esdras', testament: 'at', chapters: 10, apiId: 'EZR' },
  { slug: 'nehemias', name: 'Nehemías', testament: 'at', chapters: 13, apiId: 'NEH' },
  { slug: 'ester', name: 'Ester', testament: 'at', chapters: 10, apiId: 'EST' },
  { slug: 'job', name: 'Job', testament: 'at', chapters: 42, apiId: 'JOB' },
  { slug: 'salmos', name: 'Salmos', testament: 'at', chapters: 150, apiId: 'PSA' },
  { slug: 'proverbios', name: 'Proverbios', testament: 'at', chapters: 31, apiId: 'PRO' },
  { slug: 'eclesiastes', name: 'Eclesiastés', testament: 'at', chapters: 12, apiId: 'ECC' },
  { slug: 'cantares', name: 'Cantares', testament: 'at', chapters: 8, apiId: 'SNG' },
  { slug: 'isaias', name: 'Isaías', testament: 'at', chapters: 66, apiId: 'ISA' },
  { slug: 'jeremias', name: 'Jeremías', testament: 'at', chapters: 52, apiId: 'JER' },
  { slug: 'lamentaciones', name: 'Lamentaciones', testament: 'at', chapters: 5, apiId: 'LAM' },
  { slug: 'ezequiel', name: 'Ezequiel', testament: 'at', chapters: 48, apiId: 'EZK' },
  { slug: 'daniel', name: 'Daniel', testament: 'at', chapters: 12, apiId: 'DAN' },
  { slug: 'oseas', name: 'Oseas', testament: 'at', chapters: 14, apiId: 'HOS' },
  { slug: 'joel', name: 'Joel', testament: 'at', chapters: 3, apiId: 'JOL' },
  { slug: 'amos', name: 'Amós', testament: 'at', chapters: 9, apiId: 'AMO' },
  { slug: 'abdias', name: 'Abdías', testament: 'at', chapters: 1, apiId: 'OBA' },
  { slug: 'jonas', name: 'Jonás', testament: 'at', chapters: 4, apiId: 'JON' },
  { slug: 'miqueas', name: 'Miqueas', testament: 'at', chapters: 7, apiId: 'MIC' },
  { slug: 'nahum', name: 'Nahúm', testament: 'at', chapters: 3, apiId: 'NAM' },
  { slug: 'habacuc', name: 'Habacuc', testament: 'at', chapters: 3, apiId: 'HAB' },
  { slug: 'sofonias', name: 'Sofonías', testament: 'at', chapters: 3, apiId: 'ZEP' },
  { slug: 'hageo', name: 'Hageo', testament: 'at', chapters: 2, apiId: 'HAG' },
  { slug: 'zacarias', name: 'Zacarías', testament: 'at', chapters: 14, apiId: 'ZEC' },
  { slug: 'malaquias', name: 'Malaquías', testament: 'at', chapters: 4, apiId: 'MAL' },
  { slug: 'mateo', name: 'Mateo', testament: 'nt', chapters: 28, apiId: 'MAT' },
  { slug: 'marcos', name: 'Marcos', testament: 'nt', chapters: 16, apiId: 'MRK' },
  { slug: 'lucas', name: 'Lucas', testament: 'nt', chapters: 24, apiId: 'LUK' },
  { slug: 'juan', name: 'Juan', testament: 'nt', chapters: 21, apiId: 'JHN' },
  { slug: 'hechos', name: 'Hechos', testament: 'nt', chapters: 28, apiId: 'ACT' },
  { slug: 'romanos', name: 'Romanos', testament: 'nt', chapters: 16, apiId: 'ROM' },
  { slug: '1-corintios', name: '1 Corintios', testament: 'nt', chapters: 16, apiId: '1CO' },
  { slug: '2-corintios', name: '2 Corintios', testament: 'nt', chapters: 13, apiId: '2CO' },
  { slug: 'galatas', name: 'Gálatas', testament: 'nt', chapters: 6, apiId: 'GAL' },
  { slug: 'efesios', name: 'Efesios', testament: 'nt', chapters: 6, apiId: 'EPH' },
  { slug: 'filipenses', name: 'Filipenses', testament: 'nt', chapters: 4, apiId: 'PHP' },
  { slug: 'colosenses', name: 'Colosenses', testament: 'nt', chapters: 4, apiId: 'COL' },
  { slug: '1-tesalonicenses', name: '1 Tesalonicenses', testament: 'nt', chapters: 5, apiId: '1TH' },
  { slug: '2-tesalonicenses', name: '2 Tesalonicenses', testament: 'nt', chapters: 3, apiId: '2TH' },
  { slug: '1-timoteo', name: '1 Timoteo', testament: 'nt', chapters: 6, apiId: '1TI' },
  { slug: '2-timoteo', name: '2 Timoteo', testament: 'nt', chapters: 4, apiId: '2TI' },
  { slug: 'tito', name: 'Tito', testament: 'nt', chapters: 3, apiId: 'TIT' },
  { slug: 'filemon', name: 'Filemón', testament: 'nt', chapters: 1, apiId: 'PHM' },
  { slug: 'hebreos', name: 'Hebreos', testament: 'nt', chapters: 13, apiId: 'HEB' },
  { slug: 'santiago', name: 'Santiago', testament: 'nt', chapters: 5, apiId: 'JAS' },
  { slug: '1-pedro', name: '1 Pedro', testament: 'nt', chapters: 5, apiId: '1PE' },
  { slug: '2-pedro', name: '2 Pedro', testament: 'nt', chapters: 3, apiId: '2PE' },
  { slug: '1-juan', name: '1 Juan', testament: 'nt', chapters: 5, apiId: '1JN' },
  { slug: '2-juan', name: '2 Juan', testament: 'nt', chapters: 1, apiId: '2JN' },
  { slug: '3-juan', name: '3 Juan', testament: 'nt', chapters: 1, apiId: '3JN' },
  { slug: 'judas', name: 'Judas', testament: 'nt', chapters: 1, apiId: 'JUD' },
  { slug: 'apocalipsis', name: 'Apocalipsis', testament: 'nt', chapters: 22, apiId: 'REV' },
];

export const BOOKS_BY_SLUG = Object.fromEntries(BIBLE_BOOKS.map((book) => [book.slug, book]));
export const BOOKS_BY_API_ID = Object.fromEntries(BIBLE_BOOKS.map((book) => [book.apiId, book]));

export function getBookBySlug(slug) {
  return BOOKS_BY_SLUG[slug] || null;
}

export function chapterReference(slug, chapter) {
  const book = getBookBySlug(slug);
  if (!book) return null;
  return `${book.name} ${chapter}`;
}

export function parseReference(reference) {
  const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;

  const [, bookName, chapterRaw, verseStartRaw, verseEndRaw] = match;
  const normalizedName = bookName.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  const book = BIBLE_BOOKS.find((item) => {
    const n = item.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    return n === normalizedName;
  });

  if (!book) return null;

  return {
    book,
    chapter: Number.parseInt(chapterRaw, 10),
    verseStart: verseStartRaw ? Number.parseInt(verseStartRaw, 10) : null,
    verseEnd: verseEndRaw ? Number.parseInt(verseEndRaw, 10) : null,
  };
}
