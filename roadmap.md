# Hoja de Ruta: Mi Biblia 365 (Web Responsive)
**Estado:** Prototipo funcional | **Objetivo:** Producción en mibiblia365.com
**Stack:** Astro, React, TailwindCSS, Vite, Node.js (SSR).

---

## 🏗️ FASE 1: Robustez del Núcleo y Datos (Backend-Lite)
*El objetivo es que la app gestione el estado del usuario de forma confiable y que cada capítulo tenga su propio HTML para SEO.*

- [x] **Persistencia Local Avanzada:** `src/lib/storage.js` — `saveLastRead()` guarda historial diario en `mibiblia365_history` (Array en `localStorage`). `getStats()` calcula racha, capítulos leídos y progreso total. Considerar migración progresiva a IndexedDB (Dexie.js) para notas y favoritos sin límite de 5 MB.
- [x] **Lógica de Planes de Lectura:** `src/data/planes.json` creado con las secuencias completas (biblia anual 365 días / cronológico / NT 182 días / sabiduría 112 días / 90 días / nuevos creyentes). Función `getLecturaDelDia(planId, fechaInicio)` en `plans-engine.js`; el Dashboard muestra el capítulo del día y el enlace directo "Leer hoy".
- [x] **Manejo de Errores de API:** Componente `src/components/ApiError.astro` con diseño Santuario (parchment, Newsreader, acento oliva). La página de lectura lo usa cuando la API no responde, con botón "Intentar de nuevo" y enlace al inicio.
- [ ] **SSR para Lectura Bíblica:** Configurar rutas dinámicas en Astro (`src/pages/leer/[version]/[libro]/[capitulo].astro`) para que cada capítulo genere HTML estático con meta-tags OpenGraph propios (título del libro, capítulo, versículo inicial). Esto permite compartir pasajes por WhatsApp/Telegram con preview rica.
- [ ] **Sitemap y Robots:** Generar `sitemap.xml` y `robots.txt` en build para indexación de rutas principales.

## 📱 FASE 2: Optimización Web y Performance
*Convertir la web en una experiencia de lectura rápida, responsive y bien posicionada, sin pretender ser una app nativa.*

- [x] **Configuración de Cache en Cliente:** Implementar cache en memoria (Map/Session) para respuestas de `docs-bible-api.netlify.app` durante la sesión activa. No se usa Service Worker ni PWA; el offline se limita a la última lectura guardada en localStorage.
- [x] **Activos de Marca:** Generar favicon estándar (`favicon.svg`, `apple-touch-icon.png`) usando la paleta `#4b6026`. No se generan iconos PWA de 192/512 ni manifest standalone.
- [x] **Responsive Design:** Sistema de diseño mobile-first con Tailwind v4. Header sticky superior con menú hamburguesa en móvil. No hay navegación inferior tipo app. Breakpoints: `sm`, `md`, `lg` con tipografía y márgenes adaptativos.
- [ ] **Optimización de Imágenes:** Usar el componente `<Image />` de Astro para que las portadas de los planes se sirvan en formato WebP/AVIF automáticamente desde el CDN de Vercel.
- [ ] **Core Web Vitals:** Auditar LCP (largest contentful paint) en la página de lectura. El texto bíblico debe ser el primer contenido pintado. Preconectar DNS a `docs-bible-api.netlify.app`.

## 🎨 FASE 3: Pulido de UI/UX (Detalles Editoriales)
*Refinar los detalles que hacen que la app se sienta como un "Santuario" de lectura.*

- [x] **Transiciones de Página (Opcional):** Implementar `View Transitions` de Astro para que al cambiar de capítulo el texto haga un "fade" suave, imitando el pasar de una hoja. Debe ser sutil y no bloquear la navegación.
- [x] **Buscador Minimalista:**
    - Crear la ruta `/buscar`.
    - Implementar el diseño de "Línea única" sin cajas de texto, usando el `outline-variant` del sistema de diseño.
- [x] **Modo Lectura Nocturna:** Configurar el soporte para `dark mode` usando los colores del sistema de diseño (fondo carbón suave `#1c1c19`, texto crema `#f0ede8`, acentos `#a8c878`). Toggle flotante en esquina superior derecha con iconos `dark_mode` / `light_mode`. Script inline en `<head>` inicializa el tema antes del primer render (evita FOUC).
- [ ] **Header Editorial Sticky:** Navegación superior minimalista que se contrae al hacer scroll. En desktop muestra links completos; en móvil, menú hamburguesa deslizable desde la derecha.
- [ ] **Tipografía de Lectura:** Configurar `font-feature-settings` para números de versículos (oldstyle-nums) y espaciado de línea `1.8` en el visor bíblico. Máximo ancho de línea `65ch` para lectura óptima.

## 🚀 FASE 4: Deployment en Vercel
*Poner la aplicación en la infraestructura de producción.*

- [x] **Conexión de Repositorio:** Vincular el repo de GitHub a Vercel.
- [x] **Variables de Entorno:** Configurar cualquier API Key necesaria en el panel de Vercel.
- [ ] **SSR en Vercel:** Asegurar que el adapter de Astro para Vercel (`@astrojs/vercel`) esté configurado para SSR híbrido (páginas estáticas por defecto, SSR solo para rutas dinámicas de lectura si es necesario).
- [ ] **Headers de Seguridad:** Configurar `vercel.json` con headers de seguridad básicos (CSP, X-Frame-Options, Referrer-Policy).

## 🌐 FASE 5: Configuración de Dominio (GoDaddy)
*Vincular mibiblia365.com con la app en Vercel.*

- [ ] **Configuración de DNS:**
    - En Vercel: Añadir el dominio `www.mibiblia365.com`.
    - En GoDaddy: Cambiar los registros `A` (apuntando a la IP de Vercel) y el `CNAME` para el subdominio `www`.
- [ ] **Certificado SSL:** Verificar que Vercel genere el certificado HTTPS (es automático una vez propagadas las DNS).
- [ ] **Redirección www ↔ apex:** Configurar redirección de `mibiblia365.com` a `www.mibiblia365.com` (o viceversa) para evitar contenido duplicado en SEO.

## 📈 FASE 6: Lanzamiento y Analítica
*Saber cómo se usa la app sin invadir la privacidad.*

- [ ] **Vercel Analytics:** Activar la analítica básica de Vercel para ver cuántas personas entran y desde qué países.
- [ ] **Feedback Loop:** Añadir un pequeño botón de "Sugerencias" en la página de progreso que abra un mail pre-configurado hacia el equipo.
- [ ] **SEO Social:** Verificar que al compartir `/leer/rv1960/juan/3` por WhatsApp se muestre el título del capítulo y un versículo de preview en OpenGraph.

---

### 📝 Notas Técnicas Importantes
1. **Rendimiento:** Astro por defecto enviará 0KB de JS al cliente en la página de lectura, a menos que uses el componente de React para el selector de versiones. Mantén este enfoque para que la lectura sea instantánea.
2. **SEO:** Cada ruta dinámica (`/leer/rv1960/juan/3`) debe generar sus propias Meta Tags (OpenGraph) para que al compartir un versículo por WhatsApp se vea el título del libro y capítulo. Esto es posible gracias al SSR de Astro.
3. **No PWA:** No se implementa Service Worker, manifest.json, ni prompt de instalación. La web funciona como sitio web responsive puro. El único offline disponible es la última lectura cacheada en localStorage.
4. **Compartir:** El comportamiento principal de compartir es copiar la URL del navegador. Asegurar que las URLs sean limpias, legibles y estables.
5. **localStorage vs IndexedDB:** Evaluar en Fase 1 si el volumen de notas supera 5 MB. Si es así, migrar favoritos y notas a IndexedDB vía Dexie.js, dejando localStorage solo para configuración ligera.

---

*Hoja de ruta técnica. Versión 1.0 — Web Responsive. Abril 2026.*
