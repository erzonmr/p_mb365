# Instrucciones para tareas manuales del usuario

---

## Fase 0 (completadas)

### ~~1) Inicialización Astro real~~ ✅ (Completado en Fase 1)
Astro 6.1.8 ya está instalado y configurado. No es necesario ejecutar `npm create astro@latest`.

---

## Fase 1 (Pendientes manuales)

### ~~1) Activos de marca (REQUERIDO antes del deploy)~~ ✅ (Completado)
Crear y agregar en `public/`:

- **`favicon.svg`** — SVG con forma de libro abierto o cruz, color principal `#4b6026` (oliva).
- **`apple-touch-icon.png`** — PNG 180×180px, fondo `#4b6026`, símbolo blanco.
- **`og-default.png`** — PNG 1200×630px con la estética editorial del prototipo:
  - Fondo parchment `#fcf9f4`
  - Logo/texto "Mi Biblia 365" en Newsreader italic
  - Tagline en Manrope uppercase
  - Acento oliva

Hasta que estén disponibles, el build compila sin error pero el favicon y OG image no se mostrarán correctamente.

### 2) Verificar/renovar clave de API.Bible
La clave actual es `lKDNAnTqVMi4Mc32rwonP`. Si deja de responder:
1. Registrarse en [scripture.api.bible](https://scripture.api.bible)
2. Generar nueva clave API
3. Actualizar en `src/lib/bibleService.js` (línea con `API_BIBLE_KEY`)
4. En producción Vercel: agregar variable de entorno `API_BIBLE_KEY`

### 3) Publicación de JSON en CDN (Fase futura)
Cuando hagas el primer release de producción:
- Crear tag `v1.0.0` en GitHub
- Los JSON en `json/` quedarán disponibles en jsDelivr:
  ```
  https://cdn.jsdelivr.net/gh/erzonmr/p_mb365@v1.0.0/json/plan_anual.json
  ```
- Actualizar `src/lib/planService.js` para usar CDN en lugar de `/api/plans/`

---

## Fase 5 (Deployment — tareas futuras)

### 4) Conectar repo a Vercel
1. Ir a [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Seleccionar repositorio `erzonmr/p_mb365`
3. Framework preset: **Astro**
4. Agregar variable de entorno: `API_BIBLE_KEY=lKDNAnTqVMi4Mc32rwonP`

### 5) Configurar dominio en GoDaddy
Después de conectar en Vercel:
1. En Vercel: Settings → Domains → Add `mibiblia365.com` y `www.mibiblia365.com`
2. En GoDaddy DNS:
   - Registro `A`: `@` → IP de Vercel (aparece en el panel)
   - Registro `CNAME`: `www` → `cname.vercel-dns.com`

---

## Scripts disponibles
```bash
npm run dev        # Servidor de desarrollo en localhost:4321
npm run build      # Build de producción
npm run preview    # Previsualizar build localmente
npm run check      # TypeScript/Astro type checking
npm run validate:apis   # Validar disponibilidad de APIs bíblicas
npm run validate:json   # Validar estructura de archivos JSON
```
