import { getChapter } from '../../lib/bibleService.js';
import { BIBLE_BOOKS, getBookBySlug } from '../../lib/bibleCatalog.js';

export const prerender = false;

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET({ url }) {
  const q = (url.searchParams.get('q') || '').trim();
  const version = (url.searchParams.get('version') || '').trim();
  const testament = (url.searchParams.get('testament') || '').trim();
  const bookSlug = (url.searchParams.get('book') || '').trim();
  const page = Math.max(Number.parseInt(url.searchParams.get('page') || '1', 10), 1);
  const limit = 10;

  if (q.length < 3) {
    return Response.json({ results: [], page, total: 0, totalPages: 0 });
  }

  const queryRegex = new RegExp(escapeRegex(q), 'i');

  let books = BIBLE_BOOKS;
  if (testament === 'at' || testament === 'nt') {
    books = books.filter((book) => book.testament === testament);
  }
  if (bookSlug) {
    const book = getBookBySlug(bookSlug);
    books = book ? [book] : [];
  }

  const selectedBooks = books.slice(0, 2);
  const maxChaptersPerBook = 5;
  const candidates = [];

  try {
    for (const book of selectedBooks) {
      for (let chapter = 1; chapter <= Math.min(book.chapters, maxChaptersPerBook); chapter++) {
        const reference = `${book.name} ${chapter}`;
        const chapterData = await getChapter(reference, version);

        for (const verse of chapterData.verses) {
          if (!verse?.text || !queryRegex.test(verse.text)) continue;
          candidates.push({
            id: `${book.slug}-${chapter}-${verse.number}`,
            reference: `${book.name} ${chapter}:${verse.number}`,
            text: verse.text,
            url: `/biblia/${book.slug}/${chapter}`,
            version: chapterData.version,
          });
        }
      }
    }

    const total = candidates.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const start = (page - 1) * limit;
    const results = candidates.slice(start, start + limit);

    return Response.json({
      page,
      total,
      totalPages,
      results,
      notice: 'Búsqueda MVP: explora los primeros capítulos de los libros filtrados.',
    });
  } catch (error) {
    return Response.json(
      {
        page,
        total: 0,
        totalPages: 0,
        results: [],
        error: error?.message || 'No se pudo ejecutar la búsqueda.',
      },
      { status: 500 },
    );
  }
}
