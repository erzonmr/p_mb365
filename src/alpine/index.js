/**
 * Alpine.js entrypoint: registro central de todos los componentes.
 * Los componentes con init() son inicializados automáticamente por Alpine.
 */

export default (Alpine) => {
  // ─── Toggle de Tema ──────────────────────────────────────────────────────────
  Alpine.data('themeToggle', () => ({
    isDark: false,

    init() {
      this.isDark = document.documentElement.classList.contains('dark');
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const stored = localStorage.getItem('mb365_theme');
        if (!stored || stored === 'system') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    toggle() {
      const next = this.isDark ? 'light' : 'dark';
      localStorage.setItem('mb365_theme', next);
      this.applyTheme(next);
    },

    applyTheme(theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      this.isDark = theme === 'dark';
    },
  }));

  // ─── Versículo del día ───────────────────────────────────────────────────────
  Alpine.data('verseCard', () => ({
    loading: true,
    error: false,
    verseText: '',
    reference: '',

    async init() {
      this.reference = this.$el.dataset.reference || '';
      const fallback = this.$el.dataset.fallback || '';

      if (!this.reference) {
        this.verseText = fallback ? `«${fallback}»` : '';
        this.loading = false;
        return;
      }

      try {
        const { getChapter } = await import('../lib/bibleService.js');
        const { getPreferredVersion } = await import('../lib/storageService.js');
        const version = getPreferredVersion();

        const chapterRef = this.reference.replace(/:\d+.*$/, '').trim();
        const verseNum = parseInt(this.reference.split(':')[1] || '1', 10);

        const data = await getChapter(chapterRef, version);
        const verse = data.verses.find((v) => v.number === verseNum);
        this.verseText = verse?.text ? `«${verse.text}»` : (fallback ? `«${fallback}»` : '');
        this.loading = false;
      } catch {
        this.error = true;
        this.verseText = fallback ? `«${fallback}»` : '';
        this.loading = false;
      }
    },
  }));

  // ─── Bento de Estadísticas ───────────────────────────────────────────────────
  Alpine.data('progressBento', () => ({
    streak: '—',
    percentage: '—',

    init() {
      import('../lib/storageService.js').then(({ getStreak, getProgress }) => {
        this.streak = String(getStreak().current);
        this.percentage = String(getProgress().percentage);
      }).catch(() => {
        this.streak = '0';
        this.percentage = '0';
      });
    },
  }));

  // ─── Tarjeta de Plan Activo ──────────────────────────────────────────────────
  Alpine.data('activePlanCard', () => ({
    loading: true,
    hasPlan: false,
    planName: '',
    planLabel: '',
    currentDay: 1,
    totalDays: 365,
    percentage: 0,

    async init() {
      try {
        const { getActivePlan, getProgress, calculateCurrentDay } = await import('../lib/storageService.js');
        const plan = getActivePlan();

        if (!plan) {
          this.hasPlan = false;
          this.loading = false;
          return;
        }

        const planNames = {
          plan_anual: 'Biblia Anual',
          plan_cronologico: 'Plan Cronológico',
          plan_canonico: 'Plan Canónico',
          plan_combinado: 'Plan Combinado',
          plan_trimestral: 'NT en 90 días',
          plan_180_nt_salmos: 'NT + Salmos 180 días',
        };

        this.hasPlan = true;
        this.planName = planNames[plan.planId] || plan.planId;
        this.planLabel = 'Plan activo';
        this.currentDay = calculateCurrentDay();
        this.totalDays = plan.totalDays || 365;
        this.percentage = getProgress().percentage;
        this.loading = false;
      } catch {
        this.loading = false;
        this.hasPlan = false;
      }
    },
  }));

  // ─── Widget de Favoritos ─────────────────────────────────────────────────────
  Alpine.data('favoritesWidget', () => ({
    favorites: [],

    init() {
      import('../lib/storageService.js').then(({ getFavorites }) => {
        this.favorites = getFavorites();
      }).catch(() => {
        this.favorites = [];
      });
    },
  }));

  // ─── Lectura Diaria (página leer-hoy) ───────────────────────────────────────
  Alpine.data('lecturaHoy', () => ({
    estado: 'cargando',
    mensajeError: '',
    planId: null,
    diaActual: 1,
    porciones: [],
    porcionActiva: 0,
    referenciaActual: '',
    versiculos: [],
    cargandoTexto: false,
    diaCompletado: false,
    versionId: 'rv1960',
    versionLabel: 'RVR60',
    versiones: [],
    fontSize: 'md',
    scrollProgress: 0,
    etiquetaDia: '',
    subtituloCapitulo: '',
    favoritoGuardado: false,
    _markDayAsRead: null,

    get porcionAnterior() {
      return this.porcionActiva > 0 ? this.porciones[this.porcionActiva - 1] : null;
    },
    get porcionSiguiente() {
      return this.porcionActiva < this.porciones.length - 1
        ? this.porciones[this.porcionActiva + 1]
        : null;
    },

    async init() {
      try {
        const versionsRes = await fetch('/api/versions.json');
        this.versiones = versionsRes.ok ? await versionsRes.json() : [];

        const { getConfig, getActivePlan, calculateCurrentDay, markDayAsRead, isFavorite } = await import('../lib/storageService.js');
        const config = getConfig();
        this.versionId = config.preferredVersion || 'rv1960';
        this.fontSize = config.fontSize || 'md';
        this._markDayAsRead = markDayAsRead;
        this.versionLabel = this._getVersionLabel(this.versionId);

        const plan = getActivePlan();
        if (!plan) { this.estado = 'sin-plan'; return; }

        this.planId = plan.planId;

        // Soporte para navegar a un día específico desde /plan-completo
        let targetDay = null;
        try {
          const stored = localStorage.getItem('mb365_target_day');
          if (stored) {
            targetDay = parseInt(stored, 10);
            localStorage.removeItem('mb365_target_day');
          }
        } catch {}

        this.diaActual = targetDay || calculateCurrentDay();
        this.etiquetaDia = `Día ${this.diaActual} de ${plan.totalDays || 365}`;
        this.diaCompletado = plan.completedDays?.includes(this.diaActual) || false;

        const { getReadingsForDay } = await import('../lib/planService.js');
        this.porciones = await getReadingsForDay(this.planId, this.diaActual);

        if (!this.porciones.length) {
          this.estado = 'error';
          this.mensajeError = `No se encontraron lecturas para el día ${this.diaActual}.`;
          return;
        }

        this.estado = 'lectura';
        await this.cargarPorcion(0);
        this._initScrollTracking();
      } catch (err) {
        this.estado = 'error';
        this.mensajeError = err.message || 'Error inesperado al cargar la lectura.';
      }
    },

    async cargarPorcion(idx) {
      this.porcionActiva = idx;
      this.referenciaActual = this.porciones[idx];
      this.subtituloCapitulo = '';
      this.cargandoTexto = true;
      this.versiculos = [];
      this.favoritoGuardado = false;

      try {
        const { getChapter } = await import('../lib/bibleService.js');
        const { isFavorite, addToHistory } = await import('../lib/storageService.js');
        const data = await getChapter(this.referenciaActual, this.versionId);
        this.versiculos = data.verses;
        this.subtituloCapitulo = data.bookName || '';
        this.favoritoGuardado = isFavorite(this.referenciaActual, this.versionId);
        addToHistory(this.diaActual, this.referenciaActual);
        this.cargandoTexto = false;
      } catch {
        this.cargandoTexto = false;
        this.estado = 'error';
        this.mensajeError = `No se pudo cargar "${this.referenciaActual}". Verifica tu conexión.`;
      }
    },

    async seleccionarPorcion(idx) {
      if (idx === this.porcionActiva) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.cargarPorcion(idx);
    },

    async cambiarVersion(newVersionId) {
      this.versionId = newVersionId;
      this.versionLabel = this._getVersionLabel(newVersionId);
      const { setPreferredVersion } = await import('../lib/storageService.js');
      setPreferredVersion(newVersionId);
      await this.cargarPorcion(this.porcionActiva);
    },

    marcarLeido() {
      if (this._markDayAsRead) {
        this._markDayAsRead(this.diaActual);
        import('../lib/storageService.js').then(({ checkAndSaveAchievements }) => {
          checkAndSaveAchievements();
        });
      }
      this.diaCompletado = true;
      setTimeout(() => {
        if (this.porcionActiva < this.porciones.length - 1) {
          this.seleccionarPorcion(this.porcionActiva + 1);
        }
      }, 800);
    },

    async toggleFavorito() {
      const { addFavorite, removeFavorite, getFavorites, isFavorite } = await import('../lib/storageService.js');
      const ref = this.referenciaActual;
      const ver = this.versionId;
      if (isFavorite(ref, ver)) {
        const favs = getFavorites();
        const fav = favs.find((f) => f.reference === ref && f.version === ver);
        if (fav) removeFavorite(fav.id);
        this.favoritoGuardado = false;
      } else {
        const primerVersiculo = this.versiculos[0]?.text?.slice(0, 150) || '';
        addFavorite(ref, ver, primerVersiculo);
        this.favoritoGuardado = true;
      }
    },

    async irAPorcionAnterior() {
      if (this.porcionActiva > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.cargarPorcion(this.porcionActiva - 1);
      }
    },

    async irAPorcionSiguiente() {
      if (this.porcionActiva < this.porciones.length - 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.cargarPorcion(this.porcionActiva + 1);
      }
    },

    abrirScriptorio() {
      try { localStorage.setItem('mb365_note_ref', this.referenciaActual); } catch {}
      window.location.href = '/mi-espacio';
    },

    recargar() {
      this.estado = 'cargando';
      this.init();
    },

    increaseFontSize() {
      const sizes = ['sm', 'md', 'lg', 'xl'];
      const idx = sizes.indexOf(this.fontSize);
      if (idx < sizes.length - 1) {
        this.fontSize = sizes[idx + 1];
        import('../lib/storageService.js').then(({ setConfig }) => setConfig({ fontSize: this.fontSize }));
      }
    },

    decreaseFontSize() {
      const sizes = ['sm', 'md', 'lg', 'xl'];
      const idx = sizes.indexOf(this.fontSize);
      if (idx > 0) {
        this.fontSize = sizes[idx - 1];
        import('../lib/storageService.js').then(({ setConfig }) => setConfig({ fontSize: this.fontSize }));
      }
    },

    _getVersionLabel(id) {
      const labels = {
        'rv1960': 'RVR60', 'rv1995': 'RVR95', 'nvi': 'NVI',
        'dhh': 'DHH', 'pdt': 'PDT',
        '826f63861180e056-01': 'NTV',
        'ce11b813f9a27e20-01': 'NBLA',
        'e3f420b9665abaeb-01': 'LBLA',
      };
      return labels[id] || id.toUpperCase().slice(0, 6);
    },

    _initScrollTracking() {
      window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
      }, { passive: true });
    },
  }));

  // ─── Página de Planes ────────────────────────────────────────────────────────
  Alpine.data('planesPage', () => ({
    initialized: false,
    activePlanId: null,
    searchQuery: '',
    confirmRestart: null,

    async init() {
      try {
        const { getActivePlan } = await import('../lib/storageService.js');
        const plan = getActivePlan();
        this.activePlanId = plan?.planId || null;
      } catch {
        this.activePlanId = null;
      }
      this.initialized = true;
    },

    matchSearch(nombre, descripcion, categoria) {
      if (!this.searchQuery.trim()) return true;
      const q = this.searchQuery.toLowerCase().trim();
      return (
        nombre.toLowerCase().includes(q) ||
        descripcion.toLowerCase().includes(q) ||
        categoria.toLowerCase().includes(q)
      );
    },

    async startPlan(planId, totalDays) {
      const { startPlan } = await import('../lib/storageService.js');
      const plan = startPlan(planId);
      plan.totalDays = totalDays;
      try { localStorage.setItem('mb365_active_plan', JSON.stringify(plan)); } catch {}
      this.activePlanId = planId;
      window.location.href = '/leer-hoy';
    },

    async restartPlan(planId, totalDays) {
      const { startPlan } = await import('../lib/storageService.js');
      const plan = startPlan(planId);
      plan.totalDays = totalDays;
      try { localStorage.setItem('mb365_active_plan', JSON.stringify(plan)); } catch {}
      this.activePlanId = planId;
      this.confirmRestart = null;
      window.location.href = '/leer-hoy';
    },
  }));

  // ─── Calendario del Plan (página plan-completo) ──────────────────────────────
  Alpine.data('planCalendar', () => ({
    loading: true,
    hasPlan: false,
    planId: null,
    planName: '',
    startDate: null,
    completedDays: [],
    currentDay: 1,
    totalDays: 365,
    months: [],
    selectedMonthIdx: 0,
    progress: { completed: 0, total: 365, percentage: 0 },

    async init() {
      try {
        const { getActivePlan, calculateCurrentDay, getProgress } = await import('../lib/storageService.js');
        const plan = getActivePlan();

        if (!plan) { this.loading = false; return; }

        this.hasPlan = true;
        this.planId = plan.planId;
        this.completedDays = plan.completedDays || [];
        this.currentDay = calculateCurrentDay();
        this.totalDays = plan.totalDays || 365;
        this.startDate = plan.startDate;
        this.progress = getProgress();

        const planNames = {
          plan_anual: 'Biblia Anual',
          plan_cronologico: 'Plan Cronológico',
          plan_canonico: 'Plan Canónico',
          plan_combinado: 'Plan Combinado',
          plan_trimestral: 'NT en 90 días',
          plan_180_nt_salmos: 'NT + Salmos 180 días',
        };
        this.planName = planNames[this.planId] || this.planId;

        this._buildCalendar();

        const currentMonthIdx = this.months.findIndex((m) =>
          m.days.some((d) => d.planDay === this.currentDay)
        );
        if (currentMonthIdx >= 0) this.selectedMonthIdx = currentMonthIdx;
      } catch {}
      this.loading = false;
    },

    _buildCalendar() {
      const start = new Date(this.startDate + 'T00:00:00');
      const end = new Date(start);
      end.setDate(start.getDate() + this.totalDays - 1);

      const months = [];
      let cursor = new Date(start.getFullYear(), start.getMonth(), 1);

      while (cursor <= end) {
        const monthName = cursor.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        const monthStart = new Date(cursor);
        const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

        const days = [];
        let d = new Date(Math.max(monthStart.getTime(), start.getTime()));
        const lastDay = new Date(Math.min(monthEnd.getTime(), end.getTime()));

        while (d <= lastDay) {
          const planDay = Math.floor((d - start) / 86400000) + 1;
          days.push({ planDay, weekday: (d.getDay() + 6) % 7 }); // 0=Lun, 6=Dom
          d.setDate(d.getDate() + 1);
        }

        if (days.length > 0) {
          months.push({ name: monthName, days, paddingBefore: days[0].weekday });
        }

        cursor.setMonth(cursor.getMonth() + 1);
      }

      this.months = months;
    },

    getDayState(planDay) {
      if (this.completedDays.includes(planDay)) return 'completed';
      if (planDay === this.currentDay) return 'current';
      if (planDay < this.currentDay) return 'missed';
      return 'future';
    },

    goToDay(planDay) {
      try { localStorage.setItem('mb365_target_day', String(planDay)); } catch {}
      window.location.href = '/leer-hoy';
    },

    get currentMonth() {
      return this.months[this.selectedMonthIdx] || null;
    },

    prevMonth() {
      if (this.selectedMonthIdx > 0) this.selectedMonthIdx--;
    },

    nextMonth() {
      if (this.selectedMonthIdx < this.months.length - 1) this.selectedMonthIdx++;
    },
  }));

  // ─── Mi Espacio ──────────────────────────────────────────────────────────────
  Alpine.data('miEspacio', () => ({
    activeTab: 'resumen',

    // Resumen
    streak: 0,
    maxStreak: 0,
    progress: { completed: 0, total: 365, percentage: 0 },
    hasPlan: false,
    planName: '',
    planId: null,

    // Favoritos
    favorites: [],
    favFilter: '',

    // Notas
    notes: [],
    editingNoteId: null,
    editingText: '',
    newNoteRef: '',
    newNoteText: '',

    // Logros
    allAchievements: [],

    // Configuración
    config: { theme: 'system', fontSize: 'md', preferredVersion: 'rv1960', feb29Mode: 'grace' },
    preferredVersion: 'rv1960',

    // Respaldo
    backupStatus: '',
    backupMessage: '',
    showBackupReminder: false,

    async init() {
      const storage = await import('../lib/storageService.js');

      const streakData = storage.getStreak();
      this.streak = streakData.current;
      this.maxStreak = streakData.max;
      this.progress = storage.getProgress();

      const plan = storage.getActivePlan();
      if (plan) {
        this.hasPlan = true;
        this.planId = plan.planId;
        this.planName = this._getPlanName(plan.planId);
      }

      this.favorites = storage.getFavorites();
      this.notes = storage.getNotes();
      this.config = storage.getConfig();
      this.preferredVersion = this.config.preferredVersion || 'rv1960';

      storage.checkAndSaveAchievements();
      const unlockedIds = new Set(storage.getAchievements().map((a) => a.id));
      this.allAchievements = storage.ACHIEVEMENT_DEFS.map((def) => ({
        ...def,
        unlocked: unlockedIds.has(def.id),
      }));

      this.showBackupReminder = storage.shouldShowBackupReminder();

      // Abrir notas si viene desde Scriptorio con referencia pre-llenada
      try {
        const noteRef = localStorage.getItem('mb365_note_ref');
        if (noteRef) {
          localStorage.removeItem('mb365_note_ref');
          this.activeTab = 'notas';
          this.newNoteRef = noteRef;
        }
      } catch {}
    },

    setTab(tab) {
      this.activeTab = tab;
    },

    get filteredFavorites() {
      if (!this.favFilter.trim()) return this.favorites;
      const q = this.favFilter.toLowerCase();
      return this.favorites.filter(
        (f) =>
          f.reference.toLowerCase().includes(q) ||
          (f.text || '').toLowerCase().includes(q)
      );
    },

    async removeFavorite(id) {
      const { removeFavorite } = await import('../lib/storageService.js');
      removeFavorite(id);
      this.favorites = this.favorites.filter((f) => f.id !== id);
    },

    startEdit(note) {
      this.editingNoteId = note.id;
      this.editingText = note.text;
    },

    cancelEdit() {
      this.editingNoteId = null;
      this.editingText = '';
    },

    async saveNote() {
      if (!this.editingNoteId) return;
      const { saveNote } = await import('../lib/storageService.js');
      const note = this.notes.find((n) => n.id === this.editingNoteId);
      if (note) {
        saveNote(note.reference, this.editingText, note.day);
        note.text = this.editingText;
        note.updatedAt = new Date().toISOString();
      }
      this.cancelEdit();
    },

    async createNote() {
      if (!this.newNoteRef.trim() || !this.newNoteText.trim()) return;
      const { saveNote, getNotes } = await import('../lib/storageService.js');
      saveNote(this.newNoteRef.trim(), this.newNoteText.trim());
      this.notes = getNotes();
      this.newNoteRef = '';
      this.newNoteText = '';
    },

    async deleteNote(id) {
      const { deleteNote } = await import('../lib/storageService.js');
      deleteNote(id);
      this.notes = this.notes.filter((n) => n.id !== id);
    },

    async saveConfig(updates) {
      const { setConfig } = await import('../lib/storageService.js');
      setConfig(updates);
      this.config = { ...this.config, ...updates };
    },

    async changeTheme(theme) {
      await this.saveConfig({ theme });
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mb365_theme', 'dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mb365_theme', 'light');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        localStorage.removeItem('mb365_theme');
      }
    },

    async changeFontSize(size) {
      await this.saveConfig({ fontSize: size });
    },

    async changeVersion(version) {
      await this.saveConfig({ preferredVersion: version });
      this.preferredVersion = version;
    },

    exportData() {
      import('../lib/storageService.js').then(({ exportData }) => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mibiblia365-respaldo-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.backupStatus = 'success';
        this.backupMessage = 'Respaldo descargado correctamente.';
        setTimeout(() => { this.backupStatus = ''; this.backupMessage = ''; }, 4000);
      });
    },

    handleImportFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const { importData } = await import('../lib/storageService.js');
          const result = importData(data);
          this.backupStatus = result.success ? 'success' : 'error';
          this.backupMessage = result.message;
          if (result.success) {
            setTimeout(() => window.location.reload(), 1800);
          }
        } catch {
          this.backupStatus = 'error';
          this.backupMessage = 'El archivo no es un respaldo válido de Mi Biblia 365.';
        }
      };
      reader.readAsText(file);
    },

    _getPlanName(planId) {
      const names = {
        plan_anual: 'Biblia Anual',
        plan_cronologico: 'Plan Cronológico',
        plan_canonico: 'Plan Canónico',
        plan_combinado: 'Plan Combinado',
        plan_trimestral: 'NT en 90 días',
        plan_180_nt_salmos: 'NT + Salmos 180 días',
      };
      return names[planId] || planId;
    },
  }));
};
