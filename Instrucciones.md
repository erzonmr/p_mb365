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

### 2) Verificar conectividad de Free Use Bible API
La app usa exclusivamente [Free Use Bible API](https://bible.helloao.org/docs/).
Si hay fallos de lectura:
1. Validar disponibilidad de `https://bible.helloao.org/api/available_translations.json`
2. Ejecutar `npm run validate:apis` para revisar estado y latencia
3. Confirmar que la red/entorno permita salida HTTPS a `bible.helloao.org`

---

## Fase 5 (Deployment — tareas manuales)

### 4) Conectar repo a Vercel
1. Ir a [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Seleccionar repositorio `erzonmr/p_mb365`
3. Framework preset: **Astro**
4. En **Environment Variables**, agregar:
   - `PUBLIC_APP_URL=https://www.mibiblia365.com`
5. Confirmar que el proyecto compila con Astro 6 sin `output: "hybrid"` (deprecado) y con adapter de Vercel activo para SSR en rutas dinámicas.

### 5) Configurar dominio en GoDaddy
Después de conectar en Vercel:
1. En Vercel: Settings → Domains → Add `mibiblia365.com` y `www.mibiblia365.com`
2. En GoDaddy DNS:
   - Registro `A`: `@` → IP de Vercel (aparece en el panel)
   - Registro `CNAME`: `www` → `cname.vercel-dns.com`
3. Verificar que la redirección canónica quede `mibiblia365.com` → `www.mibiblia365.com`.
4. Esperar propagación DNS y comprobar SSL activo en Vercel (estado “Valid Configuration”).

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
