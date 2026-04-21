# Instrucciones para tareas manuales del usuario

## Fase 0

### 1) Activos de marca (manual)
Crear y agregar en `public/`:
- `favicon.svg` (color principal `#4b6026`).
- `apple-touch-icon.png` (180x180).
- `og-default.png` (1200x630) con estética editorial del prototipo.

### 2) Validación de clave de API.Bible
Si la clave pública deja de responder, generar una nueva en API.Bible y actualizar variable de entorno:
- `API_BIBLE_KEY`

### 3) Inicialización Astro real
Actualmente este repositorio quedó listo con scaffold y documentación de arquitectura.  
Siguiente acción manual sugerida:

```bash
npm create astro@latest
```

Luego aplicar:
- `output: 'hybrid'`
- adapter Vercel
- Tailwind v4

### 4) Publicación de JSON en CDN
Cuando definas release:
- usar tag o SHA en jsDelivr.
- no usar URLs sin versionado para archivos críticos.
