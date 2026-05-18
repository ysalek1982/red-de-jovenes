# Configuracion PWA

Fecha: 2026-05-17

## Estado

- Manifest disponible en `public/manifest.webmanifest`.
- Service worker manual disponible en `public/sw.js`.
- Fallback offline disponible en `public/offline.html`.
- Registro del service worker activo solo en builds de produccion.

## Configuracion

- `name`: Red de Jovenes.
- `short_name`: Red Jovenes.
- `display`: standalone.
- `start_url`: `/`.
- `scope`: `/`.
- `theme_color`: `#020617`.
- `background_color`: `#020617`.
- Icono temporal: `public/favicon.svg`.

## Cache

El service worker cachea la shell basica, el manifest, el favicon y los assets visuales principales de la landing. Las navegaciones sin red caen en `offline.html`.

## Decision tecnica

No se instalo `vite-plugin-pwa` en esta fase. La base PWA requerida queda cubierta con manifest, metadata, service worker y fallback offline sin agregar dependencia nueva.

## Pendiente antes de produccion

- Reemplazar o confirmar licencias de assets visuales.
- Agregar iconos PNG dedicados de 192x192 y 512x512 si se requiere compatibilidad mas amplia con tiendas o instalacion Android.
- Evaluar estrategias avanzadas de cache cuando existan mas datos dinamicos.
