# Optimización de build y carga de rutas

## Resumen

La Fase 15.6 revisó el warning de chunk grande de Vite antes del Release Candidate.

Se optimizó `src/routes/AppRoutes.tsx` para cargar también las rutas públicas con `React.lazy` y `Suspense`, manteniendo el mismo patrón que ya usaban las rutas privadas.

## Cambio aplicado

- `/landing`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`

Estas rutas ahora se cargan bajo demanda.

Las rutas privadas, el demo, juegos, mapa, devocional, foros y administración ya estaban separadas en chunks propios.

## Resultado

`npm run build` finalizó correctamente sin warning de chunk grande.

El bundle principal quedó en aproximadamente `470 kB`, por debajo del umbral de advertencia de Vite.

## Validaciones

- `npm run lint`: OK
- `npm run build`: OK

## Observaciones

No se agregaron dependencias nuevas.
No se cambió el concepto visual ni la navegación funcional de la aplicación.
