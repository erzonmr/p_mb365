# ARCHITECTURE.md

## Decisiones técnicas validadas (Fase 0)

Fecha de validación: 2026-04-21.

### 1) Stack base
- **Framework:** Astro 6 (`output: 'hybrid'`) para combinar páginas estáticas y rutas SSR.
- **Estilos:** TailwindCSS v4 con tokens alineados al sistema "Santuario Editorial".
- **Interactividad por defecto:** Vanilla JS / Alpine.js.
- **Islands avanzadas:** React 19 solo para componentes con estado complejo (calendario visual, editor de notas enriquecido, gráficos).

### 2) Decisión sobre framework de interactividad

**Resultado:** Alpine.js cubre gran parte del MVP (toggle tema, selectores, favoritos, controles de lectura, UI de notas básicas).  
**Excepción:** Para componentes con alta densidad de estado y render complejo (calendario de plan anual y analytics visual), **React 19 en islands** reduce costo de mantenimiento.

**Decisión final:** enfoque mixto.
- Vanilla/Alpine para la mayoría de interacciones.
- React únicamente en módulos de alta complejidad.

### 3) Capa de datos bíblicos

Se adopta una capa `bibleService.js` con:
- Proveedor principal: `docs-bible-api.netlify.app`.
- Proveedor respaldo: `api.scripture.api.bible`.
- Timeout de 3s + reintento con proveedor alterno.
- Caché en tres capas:
  1. RAM (Map en sesión).
  2. CDN (headers SSR en Vercel Edge).
  3. localStorage (última lectura y estado de usuario MVP).

### 4) JSON estáticos

- Los datasets en `json/` se tratarán como fuente versionada estable, alojados en el mismo repositorio.
- Los catálogos iniciales para runtime se exponen a través de APIs internas de Astro (ej. `/api/versions.json`, `/api/plans/[plan].json`).
- Distribución final directa desde Vercel (endpoints pre-renderizados o SSR caché).

### 5) Tipografía y fuentes

- Newsreader + Manrope vía Google Fonts con `display=swap`.
- `preconnect` para `fonts.googleapis.com` y `fonts.gstatic.com`.
- Se deja evaluación de self-hosting para Fase 4 (CSP más estricta).

### 6) Estructura base de carpetas

```text
mibiblia365/
├── prototipo/
├── json/
├── src/
├── public/
├── scripts/
└── reports/
```

### 7) Estado de validaciones técnicas

Ver reportes:
- `reports/fase0-api-validation.json`
- `reports/fase0-json-validation.json`
- `reports/fase0-resultados.md`
