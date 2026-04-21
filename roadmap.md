# Hoja de Ruta: Mi Biblia 365 (Web Responsive)
**Estado:** Nuevo proyecto | **Objetivo:** Producción en mibiblia365.com
**Stack:** Astro 6, TailwindCSS v4, Vanilla JS / Alpine.js, React 19 (islands selectivas), Vercel Edge.

---

## 🔬 FASE 0: Validación Técnica y Setup Inicial
*Antes de escribir código de producto, validar que las piezas fundamentales funcionan y decidir arquitectura definitiva.*

- [ ] **Validar API principal:** Crear script de prueba que consulte `docs-bible-api.netlify.app` con 5 versiones diferentes, 5 libros diferentes, durante 3 días consecutivos. Medir: tiempo de respuesta p95, tasa de error, estabilidad de CORS.
- [ ] **Validar API de respaldo:** Probar `API.Bible` con las 3 versiones adicionales (NTV, NBLA, LBLA). Verificar que la clave `lKDNAnTqVMi4Mc32rwonP` siga activa y sin rate limiting agresivo.
- [ ] **Prototipo de SSR con Astro 6:** Crear proyecto Astro 6 mínimo, desplegar en Vercel, probar `output: 'hybrid'` con una ruta SSR que haga fetch a la API y mida cold-start time.
- [ ] **Decisión de interactivity framework:** Evaluar si Alpine.js cubre todos los casos de uso (selectores, búsqueda, toggle tema, notas) o si React es inevitable para algún componente. Documentar decisión en `ARCHITECTURE.md`.
- [ ] **Definir sistema de diseño:** Paleta definitiva (verde oliva `#4b6026`, pergamino `#fcf9f4`, carbón `#1c1c19`), tipografía (Inter para UI, Newsreader o Merriweather para texto bíblico), escala de espaciado.
- [ ] **Estrategia de fuentes:** Decidir entre Google Fonts (con `display=swap`) o fuentes self-hosted (mejor para CSP y performance). Para una web de lectura, las fuentes son críticas.
- [ ] **Generar activos de marca:** Favicon SVG (`#4b6026`), Apple touch icon, Open Graph image genérica (1200×630).

**Entregable de Fase 0:** Repositorio con `README.md`, `astro.config.mjs` configurado, y documento `ARCHITECTURE.md` con decisiones técnicas validadas.

---

## 🏗️ FASE 1: Núcleo del Sitio y Lectura Diaria
*Construir la base del sitio: layout, navegación, sistema de tema, y la página de lectura diaria funcional.*

- [ ] **Layout base Astro:** `src/layouts/Layout.astro` con header sticky, menú responsive (hamburguesa en móvil), footer minimalista, soporte dark mode vía `class` strategy de Tailwind v4.
- [ ] **Sistema de tema claro/oscuro:** Script inline en `<head>` que lee `localStorage` antes del primer render (evita FOUC). Toggle flotante en esquina superior derecha. Paleta nocturna: fondo `#1c1c19`, texto `#f0ede8`, acentos `#a8c878`.
- [ ] **Navegación principal:** Header sticky con links: Inicio, Leer hoy, Planes, Biblia, Buscar, Mi espacio, Acerca. En móvil: menú hamburguesa deslizable desde la derecha. **Sin barra inferior.**
- [ ] **Página Inicio (`/`):** SSG. Portada con versículo diario, resumen de progreso (si hay plan), botón "Leer hoy", acceso rápido a planes y Mi espacio.
- [ ] **Página Leer hoy (`/leer-hoy`):** SSR. Detecta plan activo desde localStorage, calcula día del plan, consulta API con la referencia del día. Renderiza texto bíblico, navegación anterior/siguiente, botones de acción (marcar leído, favorito, nota). **Cache CDN:** `s-maxage=600` (10 minutos) ya que la lectura del día cambia solo una vez al día.
- [ ] **Servicio de API (`bibleService.js`):** Capa de abstracción con proveedor principal + respaldo. Cache en memoria de sesión. Timeout 3s. Reintento 1 vez con API alterna.
- [ ] **Manejo de errores de API:** Componente `ApiError.astro` con diseño Santuario (parchment, tipografía serif, acento oliva). Botón "Intentar de nuevo" y enlace al inicio.
- [ ] **Selector de versión bíblica:** Dropdown/selector que lee `versions.json` desde jsDelivr. Guarda preferencia en localStorage.
- [ ] **Meta-tags base:** Título, descripción, Open Graph y Twitter Cards en todas las páginas. Favicon, tema color, apple-touch-icon.

**Entregable de Fase 1:** Sitio navegable con Inicio y Leer hoy funcionales. El usuario puede seleccionar un plan (hardcoded inicialmente) y leer la lectura del día.

---

## 📊 FASE 2: Planes, Progreso y Datos Personales
*Implementar la lógica completa de planes, seguimiento de progreso, rachas, favoritos y notas.*

- [ ] **Carga de planes desde JSON:** `planService.js` que consume `plans.json` y los archivos individuales (`plan-biblia-anual.json`, etc.) vía jsDelivr. Parseo y normalización de datos.
- [ ] **Página Planes (`/planes`):** SSG. Catálogo de planes con tarjetas (duración, dificultad, descripción). Botones: Iniciar, Continuar, Reiniciar, Archivar.
- [ ] **Página Plan completo (`/plan-completo`):** SSR. Calendario interactivo del plan activo. Grilla de días con estados visuales (no iniciado, completado, con nota, favorito). Navegación por meses. Click en día → carga ese día en Leer hoy.
- [ ] **Lógica de progreso (`storageService.js`):** Guardar en localStorage: plan activo, fecha de inicio, días completados, última lectura. Funciones: `markDayAsRead()`, `getProgress()`, `getStreak()`.
- [ ] **Sistema de rachas:** Cálculo de racha actual y racha máxima. Regla de gracia: 1 día por semana sin romper. Manejo de atrasos (ponerse al día vs saltar al día actual).
- [ ] **Favoritos:** Guardar pasaje con referencia, versión, fecha. Listado en Mi espacio. Filtro por libro/testamento.
- [ ] **Notas:** Crear, editar, eliminar notas asociadas a un día o referencia. Editor simple (textarea con formato mínimo). Listado en Mi espacio con fecha y referencia.
- [ ] **Página Mi espacio (`/mi-espacio`):** SSG shell + islands interactivas. Pestañas: Resumen, Planes, Favoritos, Notas, Historial, Configuración, Respaldo.
- [ ] **Exportar/Importar JSON:** Botón visible en Mi espacio → descarga `mibiblia365-backup-YYYY-MM-DD.json`. Importar con validación de schema y merge inteligente (no sobrescribir todo, fusionar datos).
- [ ] **Recordatorio de respaldo:** Banner automático cada 30 días sugiriendo exportar datos.

**Entregable de Fase 2:** Usuario puede iniciar un plan, seguir su progreso, guardar favoritos y notas, y respaldar sus datos.

---

## 📖 FASE 3: Biblia Libre, Buscador y SEO Avanzado
*Habilitar la lectura fuera de planes, la búsqueda bíblica, y optimizar el posicionamiento de cada capítulo.*

- [ ] **Página Biblia (`/biblia/[libro]/[capitulo]`):** SSR + CDN cache. Selector de testamento → lista de libros → lista de capítulos → visor de lectura. Navegación capítulo anterior/siguiente. URL limpia y compartible.
- [ ] **SEO por capítulo (SSR realista):** Las meta-tags (título, descripción, Open Graph) se generan desde **nuestros datos JSON** (nombre del libro, capítulo, versículo de referencia), no desde la API de texto. Esto garantiza que si la API falla, los meta-tags siguen siendo correctos para compartir. El texto bíblico se renderiza vía SSR si la API responde, o vía hidratación en cliente si falla.
- [ ] **Sitemap dinámico:** `sitemap.xml` generado en build con rutas estáticas. Para rutas dinámicas de Biblia, incluir al menos los 66 libros × 1 capítulo inicial (ej: `/biblia/genesis/1`) para que Google descubra la estructura.
- [ ] **Página Buscar (`/buscar`):** SSR. Campo de búsqueda con debounce. Selector de versión. Filtros por testamento/libro. Resultados paginados. Acceso directo al pasaje.
- [ ] **Buscador minimalista:** Diseño editorial — input sin caja de contención, underline sutil `outline-variant` (`#c8c7ba`) que cambia a verde oliva al enfocar. Sin bordes 1px explícitos.
- [ ] **Página Acerca (`/acerca`) y FAQ (`/preguntas-frecuentes`):** SSG. Contenido estático con buena estructura semántica para SEO.
- [ ] **View Transitions sutiles:** Integrar `<ViewTransitions />` de Astro para transiciones `fade` entre páginas. Deben ser imperceptibles en términos de performance (no bloquear la navegación).

**Entregable de Fase 3:** Usuario puede leer cualquier capítulo de la Biblia, buscar palabras, y compartir URLs con preview rica en redes sociales.

---

## ⚡ FASE 4: Performance, Seguridad y Pulido
*Optimizar para que la web sea rápida, segura y accesible en cualquier dispositivo.*

- [ ] **Core Web Vitals objetivo:**
  - LCP (Largest Contentful Paint) < 1.2s en móvil.
  - CLS (Cumulative Layout Shift) < 0.1.
  - INP (Interaction to Next Paint) < 200ms.
  - Lighthouse Performance ≥ 95 en todas las páginas SSG.
- [ ] **Optimización de fuentes:** Si se usan Google Fonts, cargar con `&display=swap` y preconnect a `fonts.googleapis.com` y `fonts.gstatic.com`. Considerar self-hosting de Inter para eliminar dependencia externa y mejorar CSP.
- [ ] **Optimización de imágenes:** Usar componente `<Image />` de Astro para portadas de planes y Open Graph images. Formato WebP/AVIF automático, lazy loading, tamaños responsivos.
- [ ] **Preconnect y DNS-prefetch:** `docs-bible-api.netlify.app` y `cdn.jsdelivr.net` en el `<head>` global.
- [ ] **CSP automático (Astro 6):** Activar `csp: true` en `astro.config.mjs`. Astro 6 genera hashes automáticos para inline scripts y styles. Revisar que no bloquee scripts de tema o localStorage.
- [ ] **Headers de seguridad en Vercel:** Configurar `vercel.json` con:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] **Accesibilidad (a11y):** Auditar con axe-core. Asegurar contraste de color WCAG AA en ambos temas. Botones con aria-labels. Navegación por teclado funcional.
- [ ] **Responsive final:** Revisar en dispositivos reales (iPhone SE, Android medio, iPad, desktop 1440px). Ajustar tipografía y márgenes según viewport.
- [ ] **Modo lectura nocturna refinado:** Ajustes finos de paleta oscura. Transición suave entre temas (300ms). Respetar `prefers-color-scheme` en primera visita.

**Entregable de Fase 4:** Lighthouse ≥ 95 en todas las páginas. Sitio seguro, accesible y fluido en todos los dispositivos.

---

## 🚀 FASE 5: Deployment y Dominio
*Poner la aplicación en producción con dominio propio.*

- [ ] **Conexión de Repositorio:** Vincular el repo de GitHub a Vercel. Configurar deploy automático en push a `main`.
- [ ] **Variables de Entorno:** Configurar en Vercel: `API_BIBLE_KEY` (para la API de respaldo), `PUBLIC_APP_URL`.
- [ ] **SSR en Vercel:** Asegurar que `@astrojs/vercel` adapter esté configurado para `output: 'hybrid'` (SSG por defecto, SSR explícito en rutas dinámicas).
- [ ] **Cache en Vercel Edge:** Verificar que los headers `Cache-Control` de las rutas SSR funcionan correctamente en Vercel Edge Network. Monitorear hit rate en dashboard.
- [ ] **Configuración de DNS (GoDaddy):**
  - En Vercel: Añadir dominios `mibiblia365.com` y `www.mibiblia365.com`.
  - En GoDaddy: Registros `A` apuntando a Vercel + `CNAME` para `www`.
- [ ] **Redirección www ↔ apex:** Configurar redirección de `mibiblia365.com` → `www.mibiblia365.com` (o viceversa) para SEO.
- [ ] **Certificado SSL:** Verificar generación automática de certificado HTTPS por Vercel.

**Entregable de Fase 5:** Sitio accesible en `https://www.mibiblia365.com` con deploy continuo.

---

## 📈 FASE 6: Lanzamiento, Analítica y Feedback
*Entender cómo se usa la app y recopilar mejoras sin invadir la privacidad.*

- [ ] **Vercel Analytics:** Activar la analítica básica de Vercel (vistas de página, países, dispositivos). No requiere cookie banner (datos agregados, no personales).
- [ ] **Vercel Speed Insights:** Monitorear Core Web Vitals reales de usuarios (RUM - Real User Monitoring).
- [ ] **Feedback loop:** Botón de "Sugerencias" en Mi espacio que abra `mailto:` pre-configurado.
- [ ] **Verificación SEO Social:** Probar compartir `/biblia/juan/3` y `/leer-hoy` en WhatsApp, Telegram, Twitter/X. Verificar que el preview muestre título del capítulo y descripción correcta.
- [ ] **Pruebas con usuarios reales:** 5-10 usuarios objetivo usando el sitio durante una semana. Recopilar fricciones en el flujo "nuevo plan → leer día 1".
- [ ] **Documentación de lanzamiento:** Post en redes explicando el propósito del proyecto. Énfasis en: no requiere registro, funciona en cualquier navegador, respeta la privacidad.

**Entregable de Fase 6:** Métricas de uso iniciales, feedback de usuarios, y plan de iteración para Fase 7.

---

## 🔮 FASE 7: Backend y Sincronización (Post-MVP)
*Cuando el producto tenga tracción, habilitar persistencia en la nube.*

- [ ] **Evaluación de Supabase:** Crear proyecto, definir schema de tablas (users, plans_progress, favorites, notes), probar autenticación OTP por email.
- [ ] **Migración de localStorage a Supabase:** Flujo de sincronización bidireccional. Conflictos resueltos por timestamp (último cambio gana).
- [ ] **Cuentas de usuario:** Registro opcional. Si el usuario no quiere cuenta, sigue funcionando todo en localStorage.
- [ ] **Backup automático en la nube:** Cada vez que el usuario marca un día como leído, se sincroniza silenciosamente en background.
- [ ] **Estadísticas avanzadas:** Gráficos de progreso semanal/mensual. Comparativa visual de avance.

---

### 📝 Notas Técnicas Importantes

1. **Zero JS by Default:** Astro 6 envía 0KB de JavaScript al cliente en páginas puramente estáticas (Inicio, Acerca, FAQ). Solo las islands interactivas (selector de versiones, calendario, notas) cargan JS. Esto es crítico para la velocidad de lectura.

2. **SEO Realista:** No podemos garantizar que Google indexe el texto bíblico completo de cada capítulo porque viene de API externa. Sin embargo, sí garantizamos que cada URL (`/biblia/juan/3`) tenga meta-tags estables (título, descripción, OG image) generados desde nuestros JSON de planes/libros. El texto bíblico se carga vía SSR cuando la API responde, o vía cliente si falla. Para mejorar indexación, el sitemap incluye al menos la primera entrada de cada libro.

3. **Cache de tres capas:**
   - **Memoria de sesión (RAM):** Capítulos visitados en la misma sesión no vuelven a llamar la API.
   - **CDN Edge (Vercel):** Rutas SSR cacheadas 10-30 minutos. Reduce llamadas a API externa y mejora TTFB.
   - **localStorage:** Última lectura abierta disponible offline (solo texto, no requiere conexión para re-leer el último capítulo).

4. **No PWA:** No hay Service Worker, manifest.json, ni prompts de instalación. La web funciona como sitio web responsive puro. La única concesión offline es la última lectura en localStorage.

5. **localStorage es suficiente para MVP:** El volumen estimado de datos (config + progreso de 365 días + ~50 notas + ~30 favoritos) es < 2 MB. No introducir complejidad de IndexedDB hasta que métricas reales indiquen que se superan los 3 MB.

6. **Seguridad con Astro 6:** El CSP automático hashea inline scripts. Asegurar que el script de inicialización de tema (en `<head>`) sea compatible o moverlo a un archivo externo `.js` para evitar problemas de hash.

7. **Compartir es el comportamiento #1:** Al compartir un pasaje, el usuario copia la URL del navegador. Las URLs deben ser limpias, legibles y estables (`/biblia/rv1960/juan/3` en lugar de query strings). El preview en redes sociales depende de los meta-tags, no del texto renderizado.

---

*Hoja de ruta técnica. Versión 2.0 — Web Responsive. Abril 2026.*
