const QUOTES = [
  {
    author: "San Agustín",
    text: "Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti."
  },
  {
    author: "Juan Crisóstomo",
    text: "La lectura de las Escrituras es una gran salvaguarda contra el pecado."
  },
  {
    author: "San Jerónimo",
    text: "Desconocer las Escrituras es desconocer a Cristo."
  },
  {
    author: "Tomás de Kempis",
    text: "Si quieres aprovechar de la lectura, lee con humildad, con sencillez y con fe."
  }
];

export function getContemplacionSemanal() {
  // Calculamos la semana del año de forma determinista para rotar las citas.
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek);

  return QUOTES[weekNumber % QUOTES.length];
}
