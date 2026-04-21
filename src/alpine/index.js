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
  // Uso: <div x-data="verseCard" data-reference="Juan 3:16" data-fallback="...">
  Alpine.data('verseCard', () => ({
    loading: true,
    error: false,
    verseText: '',
    reference: '',

    async init() {
      // Leer referencia del atributo data-reference del elemento padre
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
          plan_180_NT_Salmos: 'NT + Salmos 180 días',
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

        const { getConfig, getActivePlan, calculateCurrentDay, markDayAsRead } = await import('../lib/storageService.js');
        const config = getConfig();
        this.versionId = config.preferredVersion || 'rv1960';
        this.fontSize = config.fontSize || 'md';
        this._markDayAsRead = markDayAsRead;
        this.versionLabel = this._getVersionLabel(this.versionId);

        const plan = getActivePlan();
        if (!plan) { this.estado = 'sin-plan'; return; }

        this.planId = plan.planId;
        this.diaActual = calculateCurrentDay();
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
      this.cargandoTexto = true;
      this.versiculos = [];

      try {
        const { getChapter } = await import('../lib/bibleService.js');
        const data = await getChapter(this.referenciaActual, this.versionId);
        this.versiculos = data.verses;
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
      if (this._markDayAsRead) this._markDayAsRead(this.diaActual);
      this.diaCompletado = true;
      setTimeout(() => {
        if (this.porcionActiva < this.porciones.length - 1) {
          this.seleccionarPorcion(this.porcionActiva + 1);
        }
      }, 800);
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
};
