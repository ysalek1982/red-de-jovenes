# Endurecimiento PWA

## Archivos revisados

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `src/components/pwa/InstallPrompt.tsx`
- `index.html`

## Auditoria

| Punto | Estado |
| --- | --- |
| Manifest | Configurado |
| `start_url` | `/` |
| `scope` | `/` |
| Display | `standalone` |
| Offline fallback | `offline.html` |
| Service worker | Cachea shell y assets propios |
| Supabase | No cachea respuestas externas por origen |
| Install prompt | Disponible |
| Smoke build | `SMOKE_BUILD_OK` |

## Riesgo

La instalacion real depende de navegador/dispositivo. Debe validarse despues del despliegue staging en:

- Chrome Android;
- Edge o Chrome Desktop.

## QA

- `npm run build`
- `npm run smoke:build`
- checklist manual: `docs/pilot/checklist-pwa-dispositivo-real.md`

## Estado

**Funcional base para piloto.**
