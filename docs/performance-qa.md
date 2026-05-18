# QA Performance y carga

Fecha: 2026-05-17

## Objetivo

Reducir el warning de chunk grande de Vite sin redisenar la aplicacion ni cambiar el concepto visual.

## Cambio aplicado

- Se aplico `React.lazy` y `Suspense` a la experiencia privada:
  - `AppShell`
  - `AppHome`
  - `AppProfile`
  - `PrayerRoomPage`
  - `CommunityFeedPage`
  - `DevotionalPage`

## Resultado esperado

- La landing publica conserva carga directa y paridad visual.
- Las rutas privadas se separan en chunks diferidos.
- El fallback de carga mantiene el estilo oscuro de la app.

## Validacion

- `npm run lint`: OK.
- `npm run build`: OK.
- El warning de chunk mayor a 500 kB desaparecio.
- El chunk principal quedo por debajo del limite advertido y las rutas privadas se generaron como archivos separados.
