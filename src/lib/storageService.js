/**
 * storageService.js
 * Helpers para gestión de datos del usuario en localStorage.
 * Gestiona: configuración, plan activo, progreso, favoritos, notas, logros.
 *
 * Nota: Solo debe ejecutarse en el cliente (browser).
 */

const KEYS = {
  CONFIG: 'mb365_config',
  ACTIVE_PLAN: 'mb365_active_plan',
  PROGRESS: 'mb365_progress',
  FAVORITES: 'mb365_favorites',
  NOTES: 'mb365_notes',
  ACHIEVEMENTS: 'mb365_achievements',
  LAST_BACKUP: 'mb365_last_backup',
};

/** Estructura de configuración por defecto */
const DEFAULT_CONFIG = {
  theme: 'system',        // 'light' | 'dark' | 'system'
  fontSize: 'md',         // 'sm' | 'md' | 'lg' | 'xl'
  preferredVersion: 'rv1960',
  feb29Mode: 'grace',     // 'grace' | 'skip'
};

// ─── Helpers internos ────────────────────────────────────────────────────────

function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ─── Configuración ───────────────────────────────────────────────────────────

export function getConfig() {
  return { ...DEFAULT_CONFIG, ...safeGet(KEYS.CONFIG, {}) };
}

export function setConfig(updates) {
  const current = getConfig();
  return safeSet(KEYS.CONFIG, { ...current, ...updates });
}

export function getPreferredVersion() {
  return getConfig().preferredVersion;
}

export function setPreferredVersion(versionId) {
  return setConfig({ preferredVersion: versionId });
}

// ─── Plan Activo ─────────────────────────────────────────────────────────────

/**
 * Obtiene el plan activo del usuario.
 * @returns {{ planId: string, startDate: string, currentDay: number, completedDays: number[] } | null}
 */
export function getActivePlan() {
  return safeGet(KEYS.ACTIVE_PLAN, null);
}

/**
 * Inicia un nuevo plan de lectura.
 * @param {string} planId    ID del plan (ej: "plan_anual")
 * @param {string} startDate Fecha de inicio en formato ISO (YYYY-MM-DD)
 */
export function startPlan(planId, startDate = null) {
  const start = startDate || new Date().toISOString().split('T')[0];
  const plan = {
    planId,
    startDate: start,
    currentDay: 1,
    completedDays: [],
    startedAt: new Date().toISOString(),
  };
  safeSet(KEYS.ACTIVE_PLAN, plan);
  return plan;
}

/**
 * Calcula el día del plan basado en la fecha de inicio y la fecha actual.
 * Tiene regla de gracia: máximo 1 día de atraso por semana sin romper racha.
 * @returns {number} Día del plan (1-365)
 */
export function calculateCurrentDay() {
  const plan = getActivePlan();
  if (!plan) return 1;

  const start = new Date(plan.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(1, Math.min(diffDays + 1, plan.totalDays || 365));
}

/**
 * Marca un día del plan como leído.
 * @param {number} day Número de día (1-365)
 */
export function markDayAsRead(day) {
  const plan = getActivePlan();
  if (!plan) return false;

  if (!plan.completedDays.includes(day)) {
    plan.completedDays.push(day);
    plan.completedDays.sort((a, b) => a - b);
  }
  plan.currentDay = Math.max(plan.currentDay, day + 1);
  plan.lastReadAt = new Date().toISOString();

  return safeSet(KEYS.ACTIVE_PLAN, plan);
}

/**
 * Calcula la racha actual de días consecutivos leídos.
 * @returns {{ current: number, max: number, hasGraceToday: boolean }}
 */
export function getStreak() {
  const plan = getActivePlan();
  if (!plan || !plan.completedDays.length) {
    return { current: 0, max: 0, hasGraceToday: false };
  }

  const days = [...new Set(plan.completedDays)].sort((a, b) => a - b);
  let current = 0;
  let max = 0;
  let streak = 1;

  for (let i = 1; i < days.length; i++) {
    const gap = days[i] - days[i - 1];
    if (gap === 1) {
      streak++;
    } else if (gap === 2) {
      // Día de gracia: se cuenta como racha continua
      streak++;
    } else {
      max = Math.max(max, streak);
      streak = 1;
    }
  }
  current = streak;
  max = Math.max(max, current);

  const today = calculateCurrentDay();
  const hasGraceToday = days.includes(today - 1) && !days.includes(today);

  return { current, max, hasGraceToday };
}

/**
 * Calcula el progreso del plan actual.
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export function getProgress() {
  const plan = getActivePlan();
  if (!plan) return { completed: 0, total: 365, percentage: 0 };

  const total = plan.totalDays || 365;
  const completed = plan.completedDays.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

// ─── Favoritos ───────────────────────────────────────────────────────────────

/**
 * @returns {Array<{id: string, reference: string, version: string, text: string, savedAt: string}>}
 */
export function getFavorites() {
  return safeGet(KEYS.FAVORITES, []);
}

/**
 * @param {string} reference  Ej: "Juan 3:16"
 * @param {string} version
 * @param {string} text       Fragmento del texto
 */
export function addFavorite(reference, version, text = '') {
  const favorites = getFavorites();
  const id = `fav_${Date.now()}`;

  if (favorites.some((f) => f.reference === reference && f.version === version)) {
    return false; // Ya existe
  }

  favorites.unshift({ id, reference, version, text: text.slice(0, 200), savedAt: new Date().toISOString() });
  return safeSet(KEYS.FAVORITES, favorites);
}

export function removeFavorite(id) {
  const favorites = getFavorites().filter((f) => f.id !== id);
  return safeSet(KEYS.FAVORITES, favorites);
}

export function isFavorite(reference, version) {
  return getFavorites().some((f) => f.reference === reference && f.version === version);
}

// ─── Notas ───────────────────────────────────────────────────────────────────

/**
 * @returns {Array<{id: string, reference: string, text: string, day: number, createdAt: string, updatedAt: string}>}
 */
export function getNotes() {
  return safeGet(KEYS.NOTES, []);
}

export function saveNote(reference, text, day = null) {
  const notes = getNotes();
  const existing = notes.find((n) => n.reference === reference);
  const now = new Date().toISOString();

  if (existing) {
    existing.text = text;
    existing.updatedAt = now;
  } else {
    notes.unshift({
      id: `note_${Date.now()}`,
      reference,
      text,
      day,
      createdAt: now,
      updatedAt: now,
    });
  }

  return safeSet(KEYS.NOTES, notes);
}

export function deleteNote(id) {
  const notes = getNotes().filter((n) => n.id !== id);
  return safeSet(KEYS.NOTES, notes);
}

export function getNoteForReference(reference) {
  return getNotes().find((n) => n.reference === reference) || null;
}

// ─── Exportar / Importar ─────────────────────────────────────────────────────

/**
 * Exporta todos los datos del usuario como objeto JSON.
 */
export function exportData() {
  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    config: getConfig(),
    activePlan: getActivePlan(),
    favorites: getFavorites(),
    notes: getNotes(),
    achievements: safeGet(KEYS.ACHIEVEMENTS, []),
  };
}

/**
 * Importa datos previamente exportados.
 * Merge inteligente: el timestamp más reciente gana.
 * @param {object} data Objeto exportado por exportData()
 * @returns {{ success: boolean, message: string }}
 */
export function importData(data) {
  if (!data?.version || !data?.exportedAt) {
    return { success: false, message: 'Formato de respaldo inválido.' };
  }

  try {
    if (data.config) setConfig(data.config);

    if (data.activePlan) {
      const current = getActivePlan();
      if (!current || new Date(data.activePlan.startedAt) > new Date(current.startedAt || 0)) {
        safeSet(KEYS.ACTIVE_PLAN, data.activePlan);
      }
    }

    if (data.favorites) {
      const current = getFavorites();
      const merged = [...current];
      for (const fav of data.favorites) {
        if (!merged.some((f) => f.reference === fav.reference && f.version === fav.version)) {
          merged.push(fav);
        }
      }
      safeSet(KEYS.FAVORITES, merged);
    }

    if (data.notes) {
      const current = getNotes();
      const merged = [...current];
      for (const note of data.notes) {
        const existing = merged.find((n) => n.reference === note.reference);
        if (!existing || new Date(note.updatedAt) > new Date(existing.updatedAt)) {
          const idx = merged.findIndex((n) => n.reference === note.reference);
          if (idx >= 0) merged[idx] = note;
          else merged.push(note);
        }
      }
      safeSet(KEYS.NOTES, merged);
    }

    safeSet(KEYS.LAST_BACKUP, new Date().toISOString());
    return { success: true, message: 'Datos importados correctamente.' };
  } catch (err) {
    return { success: false, message: `Error al importar: ${err.message}` };
  }
}

/**
 * Comprueba si han pasado más de 30 días desde el último respaldo.
 * @returns {boolean}
 */
export function shouldShowBackupReminder() {
  const lastBackup = safeGet(KEYS.LAST_BACKUP, null);
  if (!lastBackup) return true;

  const daysSince = (Date.now() - new Date(lastBackup)) / (1000 * 60 * 60 * 24);
  return daysSince > 30;
}
