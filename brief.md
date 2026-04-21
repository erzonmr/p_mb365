# Brief del Proyecto
## Mi Biblia 365
### Plataforma web responsive para lectura bíblica anual

---

## 1. Identidad del proyecto

### Nombre
**Mi Biblia 365**

### Slogan
**Un Año con La Palabra.**

### Versículo guía del proyecto
> "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." — Salmos 119:105 (RV60)

---

## 2. Resumen ejecutivo

Plataforma web responsive construida con **Astro 6 + TailwindCSS v4**, diseñada como un **espacio de lectura bíblica editorial**, no como una aplicación móvil ni un blog tradicional.

### Lo que hace
- Permite leer la Biblia diariamente siguiendo planes estructurados.
- Ofrece varias versiones en español (RV60, RV95, NVI, DHH, PDT) y versiones extendidas vía API de respaldo (NTV, NBLA, LBLA).
- Gestiona progreso personal, favoritos y notas en el navegador.
- Entrega un versículo diario independiente del plan, con línea temática anual.
- Ofrece un espacio personal (Mi espacio) como eje central del recorrido espiritual del usuario.
- Cada capítulo genera su propio HTML semántico (SSR) con meta-tags estables para compartir y posicionar en buscadores.

### Lo que NO hace
- No requiere registro ni login en su primera fase.
- No almacena la Biblia completa localmente (el texto se obtiene por API).
- No es una PWA ni busca parecer una app nativa.
- No usa navegación inferior tipo app ni prompts de instalación.
- No es un blog con feed cronológico.

---

## 3. Objetivo principal

Diseñar una plataforma moderna, clara y espiritual que permita al usuario:

- Leer la Biblia de forma ordenada y perseverante.
- Seguir uno o varios planes de lectura.
- Cambiar entre varias versiones bíblicas en español.
- Hacer seguimiento de su progreso personal.
- Guardar favoritos y tomar notas.
- Continuar fácilmente donde quedó.
- Usar la web como herramienta devocional diaria desde cualquier dispositivo.

---

## 4. Enfoque del producto

### Tipo de producto
**Web de lectura bíblica responsive**, tipo editorial digital. Hospedada en Vercel.

### Debe parecer
- Biblioteca bíblica digital personal.
- Espacio de lectura serio y tranquilo (tipo Medium o Readwise).
- Herramienta de acompañamiento espiritual.
- Sitio web que respeta las convenciones del navegador.

### NO debe parecer
- Aplicación móvil nativa.
- Blog de noticias o portal con feed cronológico.
- PWA con navegación inferior y prompts de instalación.

### Principio rector
> La web vive en el navegador. El contenido bíblico viene de la API, los planes y configuración desde JSON externos, y la experiencia personal se guarda localmente. Cada capítulo es una URL compartible con meta-tags estables generados desde nuestros datos, no dependiendo de la disponibilidad de la API de texto.

---

## 5. Público objetivo

### Principal
- Cristianos evangélicos de habla hispana que desean leer la Biblia en un año.
- Creyentes que buscan disciplina devocional.
- Usuarios que quieren seguir un plan de lectura estructurado.
- Usuarios móviles que desean una experiencia sencilla y rápida sin instalar nada.

### Secundario
- Nuevos creyentes que empiezan a leer la Biblia.
- Usuarios que desean leer por temas, cronología o secciones.
- Lectores que desean guardar notas y favoritos para estudio personal.

---

## 6. Decisiones técnicas clave

| Decisión | Estado | Justificación |
|---|---|---|
| Framework | **Astro 6** (Q2 2026) | Content-site por excelencia. Zero JS by default, SSR híbrido, View Transitions, CSP automático. 2-3x más rápido que Next.js para contenido. |
| Estilos | TailwindCSS v4 | Sistema de diseño utility-first, sin CSS runtime. |
| Interactividad | **Vanilla JS / Alpine.js** por defecto | Para selectores, notas, búsqueda y toggle de tema no se necesita React. Menos JS enviado al cliente. |
| Interactividad compleja | React 19 (islands) | Solo para componentes que lo requieran: calendario de plan completo, editor de notas rico. |
| Hosting | Vercel | Edge Network, SSR nativo, cache-control headers, analytics integrado. |
| API bíblica externa (principal + respaldo) | Confirmado | docs-bible-api.netlify.app + API.Bible fallback. |
| Datos JSON externos en GitHub + jsDelivr | Confirmado | Planes, versiones, versículos diarios. Inmutables, cacheados por CDN. |
| Solo versiones en español | Confirmado | |
| Almacenamiento local: localStorage (MVP) | Confirmado | Para MVP es suficiente. El volumen estimado de notas de 365 días no supera 1-2 MB. |
| Respaldo en backend real (Supabase) | Fase posterior | Sincronización multi-dispositivo y persistencia en la nube. |
| PWA | **Descartada explícitamente** | No manifest, no SW, no prompts. Uso directo en navegador. |
| "Instalación tipo app" | **Descartada** | Solo FAQ breve sobre acceso directo. |
| Lógica de año bisiesto | Manejada en JS | JSON siempre 365 días. |
| SEO por capítulo | SSR híbrido + CDN cache | Meta-tags estables desde JSON propios. Texto vía SSR con fallback cliente. |

### Responsabilidades por capa
| Capa | Función |
|---|---|
| **Astro 6 (SSG/SSR)** | Layout global, rutas, meta-tags estables por página, SSR de capítulos con cache CDN, sitemap, CSP automático |
| **Vanilla JS / Alpine.js** | Selectores, búsqueda, toggle tema, formularios ligeros, progreso local |
| **React 19 (islands)** | Calendario interactivo, editor de notas, gráficos de progreso (solo donde sea necesario) |
| **TailwindCSS v4** | Sistema de diseño editorial, paleta de color, tipografía, responsive |
| **JSON externos (jsDelivr)** | Versiones, planes, versículos diarios, configuración general |
| **localStorage (MVP)** | Configuración ligera (tema, versión, plan activo), progreso, favoritos, notas |
| **API bíblica** | Texto bíblico dinámico por referencia (principal + respaldo) |

---

## 7. APIs bíblicas del proyecto

### 7.1 API principal
**docs-bible-api.netlify.app**

#### Endpoints a utilizar
- `/api/versions` — versiones bíblicas disponibles
- `/api/books` — libros
- `/api/chapter` — capítulos
- `/api/verses` — versículos
- `/api/search` — búsqueda
- `/api/examples` — referencia de uso

#### Versiones disponibles (español)
- Reina Valera 1960 (RV60) — **versión predeterminada**
- Reina Valera 1995 (RV95)
- Nueva Versión Internacional (NVI)
- Dios Habla Hoy (DHH)
- Palabra de Dios para Todos (PDT)

### 7.2 API de respaldo
**API.Bible** — https://rest.api.bible

#### Propósito
- Respaldo operativo si la API principal falla.
- Fuente adicional de versiones no disponibles en la API principal.

#### Clave API
`lKDNAnTqVMi4Mc32rwonP`

#### Versiones adicionales disponibles vía respaldo
| Versión | Bible ID |
|---|---|
| Nueva Traducción Viviente (NTV) | `826f63861180e056-01` |
| Nueva Biblia de las Américas (NBLA) | `ce11b813f9a27e20-01` |
| La Biblia de las Américas (LBLA) | `e3f420b9665abaeb-01` |

### 7.3 Arquitectura del servicio API en JS
El código debe exponer una capa de abstracción (`bibleService.js`) que permita:

- Seleccionar el proveedor (principal o respaldo) por versión.
- Mapear internamente cada versión a su API correspondiente.
- **Cachear respuestas en tres capas**:
  1. **Memoria de sesión** (Map en RAM): para navegación instantánea entre capítulos.
  2. **Cache CDN** (Vercel Edge): headers `Cache-Control: s-maxage=3600, stale-while-revalidate` en rutas SSR.
  3. **localStorage**: última lectura abierta para acceso offline mínimo.
- Reintentar con la API alterna en caso de error de red (máximo 2 intentos).
- Timeout de 3 segundos por request.

Esto permite cambiar de proveedor en el futuro editando un solo archivo.

---

## 8. Estrategia de datos JSON externos

### 8.1 Ubicación
- **Repositorio público en GitHub** (propiedad del proyecto).
- **Servidos vía jsDelivr CDN** para rendimiento global y caché inmutable.

### 8.2 Regla clave
Los JSON deben considerarse **estables antes de publicarse**, porque jsDelivr cachea los archivos por versión/hash. Para forzar actualización se puede:
- Usar versión específica del commit (`@main`, `@sha`, o tag).
- Cambiar el nombre del archivo cuando haya cambios estructurales.

### 8.3 Archivos JSON del proyecto
| Archivo | Propósito | Tamaño estimado |
|---|---|---|
| `versions.json` | Catálogo de versiones bíblicas habilitadas | ~2 KB |
| `plans.json` | Catálogo general de planes disponibles | ~5 KB |
| `plan-biblia-anual.json` | Detalle día por día del plan anual (365 días) | ~150 KB |
| `plan-cronologico.json` | Detalle del plan cronológico | ~120 KB |
| `plan-nt.json` | Nuevo Testamento en un año | ~80 KB |
| `plan-salmos-proverbios.json` | Salmos y Proverbios | ~40 KB |
| `plan-nuevos-creyentes.json` | Plan para nuevos creyentes | ~60 KB |
| `plan-90-dias.json` | Plan de 90 días | ~50 KB |
| `versiculos-diarios.json` | Versículo diario con línea temática anual (366 entradas) | ~30 KB |
| `config.json` | Configuración general del sitio | ~1 KB |

**Nota:** El peso total de JSON (~540 KB) es asumible para carga inicial diferida (se cargan bajo demanda, no todos al inicio).

---

## 9. Manejo del año bisiesto

### 9.1 El problema
- Los planes anuales se definen con **365 días** en sus JSON.
- Un año bisiesto tiene **366 días**.
- El 29 de febrero debe tener un manejo explícito.

### 9.2 Decisión del proyecto
**Los archivos JSON siempre tendrán 365 días.** La lógica de año bisiesto se maneja **exclusivamente en JavaScript**, no en los datos.

### 9.3 Comportamiento al 29 de febrero

Se implementarán dos modos, configurables desde `config.json`:

**Modo 1 — Día de gracia (por defecto):**
- El 29 de febrero se muestra un **devocional especial de reflexión** (sin lectura obligatoria).
- Contenido sugerido: versículo breve + reflexión corta ("Día de gracia y meditación").
- No rompe la racha.
- El plan continúa normalmente el 1 de marzo.

**Modo 2 — Repetir día anterior:**
- Se muestra la lectura del 28 de febrero nuevamente.
- Útil para quien quiere reforzar o ponerse al día.

### 9.4 Función utilitaria sugerida en JS
```javascript
function esBisiesto(año) {
  return (año % 4 === 0 && año % 100 !== 0) || (año % 400 === 0);
}

function obtenerDiaDelPlan(fechaInicio, fechaHoy) {
  const dias = Math.floor((fechaHoy - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
  return dias; // JS calcula diferencia real, ya considera bisiestos
}
```

### 9.5 Para el versículo diario
El `versiculos-diarios.json` define 366 entradas (1 al 366), permitiendo usar el `dayOfYear` directamente sin ajustes. En años no bisiestos, la entrada 366 simplemente no se usa ese año.

---

## 10. Sistema de Versículo Diario

### 10.1 Concepto
Sistema **independiente** del plan de lectura, orientado a inspiración devocional breve. Disponible aun cuando el usuario no haya iniciado ningún plan.

### 10.2 Fuente
Archivo: `versiculos-diarios.json` (366 entradas).

### 10.3 Estructura por entrada
```json
{
  "dayOfYear": 1,
  "month": 1,
  "theme": "proposito",
  "subtheme": "inicio_de_ano",
  "reference": "Jeremías 29:11",
  "label": "Inicio de año",
  "highlight": "Dios tiene propósito para tu vida"
}
```

### 10.4 Línea temática anual

| Mes | Tema central |
|---|---|
| Enero | Propósito, dirección, nuevos comienzos |
| Febrero | Amor de Dios, comunión |
| Marzo | Crecimiento espiritual |
| Abril | Sacrificio de Cristo, cruz, resurrección |
| Mayo | Paz, descanso |
| Junio | Fortaleza, ánimo |
| Julio | Sabiduría, guía |
| Agosto | Oración |
| Septiembre | Evangelismo, salvación |
| Octubre | Fe, confianza |
| Noviembre | Gratitud |
| Diciembre | Navidad, encarnación, gozo |

### 10.5 Dónde se muestra el versículo diario
- **Inicio** — destacado en bloque principal.
- **Mi espacio** — en el resumen del usuario.
- **Leer hoy** — opcional, como cierre devocional.

---

## 11. Estructura de páginas

### 11.1 Mapa general
| Ruta | Página | Renderizado | Función |
|---|---|---|---|
| `/` | Inicio | **SSG** (estática) | Portada con acceso rápido, versículo diario, plan activo |
| `/leer-hoy` | Leer hoy | **SSR + CDN cache** | Lectura diaria del plan. Meta-tags estables desde JSON. |
| `/planes` | Planes de lectura | **SSG** (estática) | Catálogo y selección de planes |
| `/plan-completo` | Plan completo | **SSR** | Calendario y navegación del plan |
| `/biblia/[libro]/[capitulo]` | Biblia | **SSR + CDN cache** | Lectura libre por libro/capítulo. URL compartible. |
| `/buscar` | Buscar | **SSR** | Búsqueda de palabras/frases |
| `/mi-espacio` | Mi espacio | **SSG** (estática, hidratada) | Panel personal del usuario |
| `/acerca` | Acerca del proyecto | **SSG** (estática) | Información y visión |
| `/preguntas-frecuentes` | Preguntas frecuentes | **SSG** (estática) | FAQ |

### 11.2 Estrategia de renderizado
- **SSG (Static Site Generation)**: Páginas cuyo contenido no cambia entre usuarios ni requiere datos de API en tiempo real: Inicio, Planes, Acerca, FAQ, Mi espacio (shell).
- **SSR (Server-Side Rendering)**: Páginas que dependen de la fecha actual o de parámetros dinámicos: Leer hoy, Plan completo, Biblia, Buscar.
- **CDN Cache en SSR**: Todas las rutas SSR usan `Cache-Control: s-maxage=1800, stale-while-revalidate=86400` (30 minutos de vida, 24 horas de revalidación en background). Esto reduce drásticamente las llamadas a la API bíblica desde el servidor.

### 11.3 Inicio (`/`)

**Función:** portada principal con enfoque en lectura, progreso y acceso rápido.

**Contenido:**
- Nombre del proyecto y subtítulo.
- Llamada principal: botón **Leer hoy**.
- Tarjeta resumen del progreso actual (si hay plan activo).
- Versículo destacado del día.
- Botón **Continuar donde quedé**.
- Acceso a planes de lectura.
- Acceso a Mi espacio.
- Selector de versión bíblica.

### 11.4 Leer hoy (`/leer-hoy`)

**Función:** página principal de lectura diaria.

**Lógica:**
- Detectar plan activo desde localStorage.
- Calcular día del plan según fecha de inicio y fecha actual.
- Manejar 29 de febrero según `config.json`.
- Consultar la API con la referencia bíblica.
- Renderizar el texto en la versión seleccionada.

**Secciones:**
- Fecha actual.
- Nombre del plan y día del plan.
- Selector de versión.
- Referencias bíblicas del día.
- Texto bíblico renderizado.
- Navegación anterior / siguiente día.
- Botón **Marcar como leído**.
- Botón **Añadir favorito**.
- Botón **Añadir nota**.
- Indicador de progreso del plan.
- Devocional o reflexión opcional.

### 11.5 Planes de lectura (`/planes`)

**Función:** mostrar y permitir elegir uno o varios planes.

**Secciones:**
- Introducción.
- Tarjetas de planes con duración, dificultad, descripción.
- Botones por plan: **Iniciar**, **Continuar**, **Reiniciar**, **Archivar**.

**Planes sugeridos:**
- Biblia en un año (clásico por secciones)
- Plan cronológico
- Nuevo Testamento en un año
- Salmos y Proverbios (31 días, recurrente)
- Plan para nuevos creyentes
- Plan de 90 días
- Plan temático

### 11.6 Plan completo (`/plan-completo`)

**Función:** vista tipo calendario de todo el plan.

**Secciones:**
- Selector de plan.
- Selector de mes.
- Grilla de días con estados visuales:
  - No iniciado
  - Iniciado
  - Completado
  - Con nota
  - Favorito
- Click en día → lleva a Leer hoy con ese día cargado.

### 11.7 Biblia (`/biblia/[libro]/[capitulo]`)

**Función:** lectura libre, independiente del plan.

**Secciones:**
- Selector de versión.
- Selector de testamento.
- Lista de libros.
- Lista de capítulos.
- Visor de lectura.
- Navegación capítulo anterior / siguiente.
- Botón favorito.
- Botón añadir nota.

### 11.8 Buscar (`/buscar`)

**Función:** búsqueda de palabras o frases en el texto bíblico.

**Secciones:**
- Campo de búsqueda.
- Selector de versión.
- Filtros por testamento / libro.
- Lista de resultados paginada.
- Acceso directo a lectura del pasaje.
- Guardar favorito desde resultados.

### 11.9 Mi espacio (`/mi-espacio`) — **página central del proyecto**

**Función:** panel personal del usuario. Es el eje del valor del sitio.

#### Pestañas internas

**Resumen**
- Plan activo y progreso.
- Racha actual.
- Versión preferida.
- Cantidad de favoritos y notas.
- Versículo diario.
- Botón **Continuar donde quedé**.

**Planes**
- Lista de planes activos y archivados.
- Fecha de inicio, progreso, última lectura.
- Acciones: Continuar / Reiniciar / Archivar / Cambiar plan activo.

**Favoritos**
- Pasajes guardados con referencia.
- Acceso rápido a cada uno.
- Filtro por libro/testamento.

**Notas**
- Listado con fecha y referencia.
- Editar / eliminar.
- Filtrar por plan o libro.

**Historial**
- Últimas lecturas abiertas.
- Últimas búsquedas.
- Últimos capítulos visitados.

**Configuración**
- Versión bíblica preferida.
- Modo claro/oscuro.
- Tamaño de texto.
- Plan por defecto.
- Modo del 29 de febrero (gracia / repetir).
- Visualización de versículos (por línea / corrido).

**Respaldo**
- Exportar datos (descarga JSON).
- Importar datos (subir JSON).
- **Recordatorio de respaldo** (banner que aparece cada N días sugiriendo exportar).
- Próximamente: sincronización en la nube.

### 11.10 Acerca del proyecto (`/acerca`)

- Propósito de la web.
- Cómo funciona.
- Cómo se guarda el progreso.
- Limitaciones del sistema local.
- Visión espiritual.

### 11.11 Preguntas frecuentes (`/preguntas-frecuentes`)

- ¿Necesito registrarme?
- ¿Dónde se guarda mi progreso?
- ¿Qué pasa si borro los datos del navegador?
- ¿Puedo usar varios planes?
- ¿Puedo cambiar de versión?
- ¿Qué hago si me atraso?
- ¿Mis notas se sincronizan entre dispositivos?
- ¿Cómo respaldo mi información?

---

## 12. Navegación

### 12.1 Menú principal (todos los dispositivos)
Navegación horizontal en **header sticky** superior. En móvil, colapsa en menú hamburguesa.

- Inicio
- Leer hoy
- Planes
- Biblia
- Buscar
- Mi espacio
- Acerca

### 12.2 Principio de navegación
- **No hay barra inferior.** La web se navega como un sitio web, no como una app nativa.
- El header es minimalista, con fondo transparente o sólido según scroll.
- El foco táctil se mantiene generoso (mínimo 44×44 px) sin imitar patrones nativos.

---

## 13. Flujos principales del usuario

### Flujo 1 — Usuario nuevo
1. Entra a Inicio.
2. Entiende rápidamente de qué trata la web.
3. Va a Planes.
4. Elige un plan.
5. Selecciona versión bíblica.
6. Inicia el plan → es llevado a Leer hoy.
7. Lee, marca como leído, guarda nota/favorito.
8. Empieza a usar Mi espacio.

### Flujo 2 — Usuario recurrente
1. Entra al sitio.
2. Ve resumen de avance en Inicio.
3. Pulsa **Continuar donde quedé**.
4. Lee contenido del día.
5. Marca como leído.
6. Su progreso se actualiza.

### Flujo 3 — Usuario explorador
1. Entra a Biblia o Buscar.
2. Consulta un pasaje libre.
3. Lo guarda en favoritos.
4. Añade una nota.
5. Lo revisa luego desde Mi espacio.

### Flujo 4 — Usuario con varios planes
1. Entra a Mi espacio → Planes.
2. Ve sus planes iniciados.
3. Cambia el plan activo.
4. Continúa en el día correspondiente.

### Flujo 5 — Usuario atrasado
1. Entra a Leer hoy.
2. El sistema detecta X días de atraso.
3. Se ofrecen dos opciones:
   - **Ponerme al día** (lee lecturas acumuladas).
   - **Saltar al día de hoy** (continúa desde hoy).
4. La racha se ajusta según la elección.

### Flujo 6 — Racha con gracia
- El sistema permite perder hasta **1 día por semana** sin romper la racha.
- Esto reduce la frustración y favorece la perseverancia.

---

## 14. Lógica del sistema

### 14.1 Responsabilidades de Astro
- Layout global y rutas por sistema de archivos (`src/pages/`).
- Meta-tags, Open Graph y SEO por página.
- **SSG** para páginas estáticas (Inicio, Planes, Acerca, FAQ).
- **SSR** para páginas dinámicas (Leer hoy, Biblia, Buscar, Plan completo).
- **CDN Cache headers** en rutas SSR para minimizar llamadas a API externa.
- Generación de sitemap y robots.txt.
- CSP automático (Astro 6).

### 14.2 Responsabilidades de JavaScript (cliente)
- Gestión del estado global (plan activo, progreso, preferencias) vía vanilla JS o Alpine.js.
- Consultas a API con fallback y triple capa de cache (memoria → CDN → localStorage).
- Renderizado de lecturas y versículos en cliente (solo cuando SSR no es posible por fallo de API).
- Carga de planes desde JSON.
- Manejo de progreso, favoritos y notas.
- Cálculo de día del plan (incluyendo bisiestos).
- Persistencia en localStorage.
- Exportar/importar respaldo JSON.

### 14.3 Enrutamiento
Astro maneja el enrutamiento por archivos en `src/pages/`:

| Ruta | Archivo | Renderizado |
|---|---|---|
| `/` | `src/pages/index.astro` | SSG |
| `/leer-hoy` | `src/pages/leer-hoy.astro` | SSR + Cache |
| `/planes` | `src/pages/planes.astro` | SSG |
| `/plan-completo` | `src/pages/plan-completo.astro` | SSR |
| `/biblia/[libro]/[capitulo]` | `src/pages/biblia/[libro]/[capitulo].astro` | SSR + Cache |
| `/buscar` | `src/pages/buscar.astro` | SSR |
| `/mi-espacio` | `src/pages/mi-espacio.astro` | SSG + islands |
| `/acerca` | `src/pages/acerca.astro` | SSG |
| `/preguntas-frecuentes` | `src/pages/preguntas-frecuentes.astro` | SSG |

---

## 15. Modelo de datos

### 15.1 Versiones (`versions.json`)
```json
{
  "versions": [
    { "id": "rv1960", "name": "Reina Valera 1960", "api": "principal", "active": true, "default": true },
    { "id": "rv1995", "name": "Reina Valera 1995", "api": "principal", "active": true },
    { "id": "nvi", "name": "Nueva Versión Internacional", "api": "principal", "active": true },
    { "id": "dhh", "name": "Dios Habla Hoy", "api": "principal", "active": true },
    { "id": "pdt", "name": "Palabra de Dios para Todos", "api": "principal", "active": true },
    { "id": "ntv", "name": "Nueva Traducción Viviente", "api": "apibible", "bibleId": "826f63861180e056-01", "active": true },
    { "id": "nbla", "name": "Nueva Biblia de las Américas", "api": "apibible", "bibleId": "ce11b813f9a27e20-01", "active": true },
    { "id": "lbla", "name": "La Biblia de las Américas", "api": "apibible", "bibleId": "e3f420b9665abaeb-01", "active": true }
  ]
}
```

### 15.2 Catálogo de planes (`plans.json`)
```json
{
  "plans": [
    {
      "id": "biblia-anual",
      "name": "Biblia en un año",
      "description": "Lectura completa de la Biblia en 365 días.",
      "duration": 365,
      "category": "completo",
      "readingsPerDay": 3,
      "active": true,
      "file": "plan-biblia-anual.json"
    }
  ]
}
```

### 15.3 Plan detallado (ejemplo día)
```json
{
  "id": "biblia-anual",
  "name": "Biblia en un año",
  "duration": 365,
  "days": [
    {
      "day": 1,
      "title": "El principio",
      "readings": ["Génesis 1", "Salmos 1", "Mateo 1"],
      "devotional": "En el principio creó Dios los cielos y la tierra...",
      "reflection": "¿Qué significa que Dios sea el principio de todo?",
      "prayer": "Señor, que hoy reconozca tu señorío sobre mi vida."
    }
  ]
}
```

### 15.4 Datos del usuario (localStorage)
```json
{
  "version": "1.0",
  "lastSync": "2026-04-20",
  "config": {
    "preferredVersion": "rv1960",
    "darkMode": false,
    "fontSize": "medium",
    "activePlanId": "biblia-anual",
    "leapYearMode": "gracia"
  },
  "plans": [
    {
      "planId": "biblia-anual",
      "startDate": "2026-01-01",
      "lastOpenedDay": 110,
      "completedDays": [1, 2, 3, 4, 5],
      "favorites": [110],
      "notes": [1, 5, 42],
      "status": "active",
      "streak": 5,
      "lastReadDate": "2026-04-19"
    }
  ],
  "favorites": [
    {
      "id": "fav-001",
      "reference": "Jeremías 29:11",
      "version": "rv1960",
      "savedAt": "2026-04-19",
      "type": "verse",
      "note": ""
    }
  ],
  "notes": [
    {
      "id": "note-001",
      "planId": "biblia-anual",
      "day": 5,
      "reference": "Génesis 5",
      "content": "Texto de mi reflexión...",
      "createdAt": "2026-04-15",
      "updatedAt": "2026-04-15"
    }
  ],
  "history": {
    "readings": ["Génesis 1", "Salmos 1", "Mateo 1"],
    "searches": ["amor", "fe", "esperanza"],
    "chapters": ["Génesis 1", "Salmos 23"]
  }
}
```

---

## 16. Sistema de almacenamiento

### 16.1 Fase 1 — localStorage (MVP)
**Ventajas:**
- Implementación simple, sin librerías externas.
- No requiere backend.
- Respuesta instantánea.
- Para el volumen esperado (config + progreso + notas de 365 días + ~50 favoritos), el tamaño estimado es < 2 MB, bien dentro del límite de 5 MB de localStorage.

**Limitaciones:**
- No sincroniza entre dispositivos.
- Se pierde si el usuario borra datos del navegador.
- Depende del mismo navegador en el mismo dispositivo.

### 16.2 Mitigaciones en Fase 1
- **Exportar/Importar JSON** muy visible desde Mi espacio.
- **Recordatorio automático** de respaldo cada 30 días.
- **Aviso claro** en la primera visita sobre el funcionamiento del almacenamiento.
- **Validación** del JSON al importar (evitar corrupción de datos).

### 16.3 Fase 2 — Migración a IndexedDB (si es necesario)
Si en uso real se superan los 3 MB de datos (usuarios con múltiples planes, miles de notas), evaluar migración a IndexedDB. No es necesario para el MVP.

### 16.4 Fase 3 — Respaldo en backend (roadmap)
Migrar a un backend real para:
- Sincronizar entre dispositivos.
- Cuentas de usuario.
- Respaldo automático en la nube.

**Opción recomendada:** **Supabase** — PostgreSQL, Auth listo, Row Level Security, free tier generoso.

### 16.5 Estrategia de migración
Cuando se active el backend, el localStorage se conservará como caché offline. El flujo será:
1. Al iniciar sesión, se descarga el estado del backend.
2. Los cambios locales se sincronizan al backend en segundo plano.
3. Si no hay sesión, funciona como hoy (solo localStorage).

---

## 17. Funciones clave del producto

### Funciones principales (Fase 1-4)
- Leer la lectura del día con API.
- Iniciar, continuar, reiniciar y archivar planes.
- Marcar día como leído.
- Cambiar versión bíblica.
- Navegar libre por la Biblia.
- Buscar texto bíblico.
- Guardar favoritos.
- Crear, editar y eliminar notas.
- Gestionar múltiples planes.
- Ver progreso y racha.
- Ver versículo diario.
- Ver historial.
- Exportar e importar datos.
- Manejo automático de año bisiesto.
- Manejo de atrasos.

### Funciones futuras (Fase 5+)
- Sincronización en la nube (Supabase).
- Cuentas de usuario reales.
- Compartir progreso.
- Estadísticas avanzadas.
- Recordatorios por correo.
- Audio bíblico.
- Lectura dramatizada.
- Metas semanales.
- Modo estudio con comentarios bíblicos.

---

## 18. Diseño y experiencia de usuario

### 18.1 Estilo visual
- Limpio, moderno, sobrio.
- Espiritual pero no cursi.
- Legible, enfocado en lectura.
- Tipografía sans-serif de alta legibilidad (Inter, Nunito, Poppins).
- Espaciado generoso.
- Paleta editorial sobria con acentos cálidos (verde oliva profundo `#4b6026`, pergamino `#fcf9f4`, carbón suave `#1c1c19` para modo oscuro).

### 18.2 Debe evitar
- Apariencia de blog tradicional.
- Apariencia de app móvil nativa (sin bottom nav, sin prompts de instalación).
- Exceso de cajas o widgets.
- Saturación visual.
- Colores llamativos sin propósito.
- Look de revista o portal de noticias.

### 18.3 Mobile first (como web, no como app)
La mayoría del uso será móvil. Prioridades:
- Header sticky compacto, no barra inferior fija.
- Botón grande de "Leer hoy" en portada.
- Texto bíblico con tipografía cómoda y línea de lectura amplia.
- Controles táctiles generosos (mínimo 44×44 px).
- Modo oscuro disponible.
- La URL siempre visible para compartir fácilmente.

### 18.4 Elementos visuales recomendados
- Tarjetas para planes.
- Barra de progreso clara.
- Indicador del día actual en calendario.
- Estados visuales por día (completado, nota, favorito).
- Botones de acción primaria destacados.
- Iconos consistentes (sugerido: Lucide o similar).
- Transiciones suaves entre páginas (View Transitions de Astro, opcional y sutiles).

### 18.5 Principios de experiencia
- Acceso rápido a la lectura del día en 1 tap.
- Facilidad para continuar donde quedó.
- Claridad sobre cuál es el plan activo.
- Progreso siempre visible.
- Facilidad para guardar notas y favoritos.
- Sensación de acompañamiento, no de obligación.
- Compartir un pasaje debe ser tan simple como copiar la URL del navegador.

---

## 19. Enfoque espiritual

El proyecto debe transmitir que la lectura bíblica no es una tarea mecánica, sino una forma de:

- Conocer a Dios más íntimamente.
- Crecer espiritualmente cada día.
- Perseverar en la Palabra.
- Desarrollar disciplina devocional sana.
- Meditar y obedecer la Escritura.

### Tono de los microtextos
- Cercanía y guía (no legalismo).
- Reverencia sin rigidez.
- Claridad pastoral.
- Motivación sana (sin manipulación emocional).
- Esperanza constante.

### Ejemplos de microtextos
- En lugar de "Has fallado 3 días" → "Retomemos juntos desde hoy".
- En lugar de "Racha rota" → "Nuevo comienzo".
- En lugar de "Lectura completada" → "¡Bien! Un día más en Su Palabra".
- Al iniciar un plan: "Que el Señor te guíe y te sostenga en este recorrido."
- Al completar un plan: "Has completado un año en Su Palabra. Gloria a Dios."

### Versículo de bienvenida sugerido
> "Y estas palabras que yo te mando hoy, estarán sobre tu corazón." — Deuteronomio 6:6 (RV60)

---

## 20. Criterios de éxito

El proyecto será exitoso si:

- Un usuario nuevo puede iniciar un plan en menos de 60 segundos.
- Un usuario recurrente puede retomar su lectura en 1 tap.
- El progreso se conserva confiablemente entre sesiones.
- Cada capítulo leído tiene una URL limpia que se puede compartir por WhatsApp/Telegram y se ve bien en preview (OpenGraph con título del capítulo, no dependiendo de la API de texto).
- La experiencia móvil se siente fluida como web de lectura, no como app forzada.
- El usuario percibe acompañamiento espiritual, no solo una herramienta técnica.
- Lighthouse Performance ≥ 95 en todas las páginas SSG.

---

## 21. Definición final del proyecto

> **Mi Biblia 365** es una plataforma web responsive construida con Astro 6, que permite a los cristianos leer la Biblia mediante múltiples planes y versiones en español, apoyándose en una API bíblica externa con respaldo, datos JSON servidos por CDN, y un espacio personal completo para gestionar progreso, favoritos y notas. El proyecto no requiere registro en su primera fase, funciona directamente en el navegador sin pretender ser una app nativa, y está diseñado con el propósito pastoral de acompañar al creyente en su perseverancia devocional.

---

## 22. Próximos pasos recomendados

1. **Validar API principal** con una prueba mínima (1 página Astro que consuma RV60 y renderice Juan 3:16 vía SSR, midiendo tiempo de respuesta).
2. **Crear el repositorio GitHub** con estructura de carpetas Astro 6 definida.
3. **Subir primer JSON de versiones** (`versions.json`) y probar acceso vía jsDelivr.
4. **Definir paleta de colores y tipografía** del proyecto (basado en sistema editorial verde oliva).
5. **Crear layout base Astro** con meta-tags, header sticky y sistema de tema claro/oscuro.
6. **Construir `plan-biblia-anual.json`** con los 365 días.
7. **Construir `versiculos-diarios.json`** con 366 entradas siguiendo línea temática mensual.

---

*Documento de producto. Versión 2.0 — Web Responsive. Abril 2026.*
