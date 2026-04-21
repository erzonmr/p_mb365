# Documento de Sistema de Diseño: El Santuario Editorial

## 1. Visión general y norte creativo
**Norte creativo: El Scriptorium Moderno**
Este sistema de diseño rechaza la saturación visual “tipo app” de muchos productos digitales modernos. Es un framework con enfoque editorial pensado para la contemplación profunda. No estamos construyendo una utilidad; estamos construyendo un santuario.

El sistema va más allá de la cuadrícula rígida y rectangular de las apps web estándar. Mediante asimetría intencional, espacio negativo expansivo y capas tonales, buscamos una experiencia editorial de alto nivel. El objetivo es que la persona usuaria sienta que interactúa con un volumen físico cuidadosamente compuesto, trasladado a un medio digital fluido. La interfaz debe “respirar”, retirándose cuando comienza la lectura y apareciendo solo como un susurro cuando se necesita navegar.

---

## 2. Color y profundidad tonal
La paleta nace de lo orgánico: base de pergamino suave y carbón profundo para sostener la lectura, con acentos oliva y dorado para guiar la mirada.

### Regla de “sin líneas”
**Instrucción explícita:** se prohíbe usar bordes sólidos de 1px para seccionar o contener.
Los límites deben definirse mediante:
- **Cambios de color de fondo:** una sección `surface-container-low` (`#f6f3ee`) sobre un fondo `surface` (`#fcf9f4`).
- **Espacio negativo:** usar la escala de espaciado para crear límites mentales sin líneas físicas.

### Jerarquía y anidación de superficies
Trata la UI como una serie de capas físicas: hojas de papel fino apiladas.
- **Nivel 1 (Base):** `surface` (`#fcf9f4`) para el lienzo principal de lectura.
- **Nivel 2 (Navegación/Contexto):** `surface-container` (`#f0ede8`) para sidebars o controles secundarios.
- **Nivel 3 (Elementos interactivos):** `surface-container-high` (`#ebe8e3`) para tarjetas activas o modales.

### Regla de “vidrio y gradiente”
Para dar “alma” a la interfaz digital, usa glassmorphism en UI flotante (como barra inferior de reproducción o encabezado de búsqueda flotante).
- **Efecto:** usar `surface-container-lowest` con 80% de opacidad y desenfoque de fondo de `24px`.
- **CTAs:** para acciones primarias, usar un gradiente lineal sutil de `primary` (`#4b6026`) a `primary-container` (`#63793c`) a 135°. Así se evita que el verde oliva se vea plano.

---

## 3. Tipografía
El alma tipográfica de este sistema vive en la tensión entre la utilidad moderna de **Manrope** y la elegancia literaria de **Newsreader**.

- **La Voz (Escritura):** usar **Newsreader** para todo texto bíblico (`body-lg`, `body-md`). Los titulares de alto contraste (`display-lg`) también deben usar Newsreader para evocar una portada.
- **La Estructura (UI):** usar **Manrope** para navegación, etiquetas y metadatos. Aporta contraste limpio y neutral frente al contenido serif, dejando claro qué es “la palabra” y qué es “la interfaz”.
- **Ajuste óptico:** para títulos `display-lg`, reducir el espaciado entre letras a `-0.02em` para un look editorial más premium.

---

## 4. Elevación y profundidad
Las sombras tradicionales son demasiado “digitales”. La profundidad se logra mediante **capas tonales**.

- **Principio de capas:** colocar una tarjeta `surface-container-lowest` (`#ffffff`) sobre fondo `surface-container-low` (`#f6f3ee`) para una elevación suave y natural.
- **Sombras ambientales:** si un elemento flotante (como menú contextual) requiere sombra, debe ser extra difusa.
  - *Especificación:* `0px 12px 32px rgba(28, 28, 25, 0.06)`. El color de sombra es una versión tintada de `on-surface`, nunca negro puro.
- **“Borde fantasma” como respaldo:** si por accesibilidad se requiere un límite, usar `outline-variant` (`#c8c7ba`) al **15% de opacidad**. Debe sentirse, no verse.

---

## 5. Componentes

### Botones
- **Primario:** relleno con gradiente (`primary` a `primary-container`), texto blanco, radio de esquina `md` (`0.375rem`). Deben sentirse sustanciales, sin verse pesados.
- **Secundario:** sin relleno. Usar `label-md` en color `primary` con “Borde fantasma”.
- **Terciario:** solo texto. Usar `label-md` en `secondary` (`#725a38`) como acento dorado suave.

### Tarjetas interactivas de Escritura
- **Divisores prohibidos:** no usar líneas horizontales para separar versículos o capítulos. Usar `1.5rem` de espacio vertical o cambiar a `surface-container-lowest`.
- **Radio de esquina:** usar `lg` (`0.5rem`) para una sensación suave y cercana.

### Progreso y resaltados
- **Progreso de lectura:** barra delgada de 2px en `secondary` (`#725a38`) en la parte superior del viewport.
- **Resaltado de Escritura:** en lugar del estilo “marcador” agresivo, usar fondo `primary-fixed` (`#d2eca2`) con radio `0.125rem` (sm) alrededor del texto.

### Inputs y búsqueda
- **Búsqueda minimalista:** una sola línea de texto en `headline-sm` (Manrope). Sin caja contenedora. Usar `outline-variant` como subrayado sutil que se expande desde el centro al enfocar.

---

## 6. Qué hacer y qué evitar

### Haz:
- **Abraza la asimetría:** colocar un título de capítulo (`display-md`) fuera del centro para lograr una apariencia editorial, no de plantilla.
- **Prioriza el espacio negativo:** si crees que ya hay suficiente padding, agrega 25% más.
- **Usa transiciones tonales:** pasar de una sección a otra con cambios de fondo, no con líneas.

### Evita:
- **No uses negro al 100%:** usa siempre `on-surface` (`#1c1c19`) para mantener contraste suave tipo pergamino.
- **No uses sombras estándar:** evitar sombras por defecto estilo Material Design. Preferir capas tonales o sombras ambientales.
- **No sobreanimes:** transiciones lentas de “desvanecer y deslizar” (300ms–500ms), simulando pasar página. Sin easing “rebotado” ni demasiado “snappy”.

---

## 7. Accesibilidad
- **Contraste:** asegurar que todo texto `on-surface-variant` cumpla WCAG AA sobre fondos `surface`.
- **Áreas táctiles:** tamaño mínimo de objetivo táctil para iconos interactivos (guardar, compartir, etc.) de `44x44px`, aunque el icono visual sea menor.
- **Legibilidad:** mantener `line-height` de `1.6` en texto de cuerpo Newsreader para evitar fatiga visual en lectura contemplativa.
