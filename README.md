# Mi Biblia 365

Plataforma web responsive para lectura bíblica anual con enfoque editorial contemplativo.

## Estado actual

- ✅ Brief funcional definido (`brief.md`).
- ✅ Roadmap técnico por fases (`roadmap.md`).
- ✅ Prototipos visuales en HTML (`prototipo/`).
- ✅ Ejecución de Fase 0 documentada en `reports/fase0-resultados.md`.

## Estructura del repositorio

- `brief.md`: visión de producto y decisiones marco.
- `roadmap.md`: hoja de ruta por fases.
- `Instrucciones.md`: checklist manual por fase (incluye deployment de Fase 5).
- `.env.example`: variables de entorno requeridas para producción.
- `prototipo/`: prototipos visuales y sistema de diseño base.
- `json/`: datasets de planes de lectura, versículos diarios y catálogos.
- `scripts/fase0/`: validaciones técnicas iniciales (APIs y JSON).
- `reports/`: evidencias y conclusiones de validaciones.
- `src/` y `public/`: estructura inicial para Astro.

## Validaciones de Fase 0

```bash
node scripts/fase0/validate-apis.mjs > reports/fase0-api-validation.json  # Free Use Bible API
node scripts/fase0/validate-json.mjs > reports/fase0-json-validation.json
```

## Próximo paso sugerido

Ejecutar tareas manuales de Fase 5 en Vercel/GoDaddy para publicar en dominio propio (`www.mibiblia365.com`).
