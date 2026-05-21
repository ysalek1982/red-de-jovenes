# Limpieza de QA sin Construir

## Dictamen

QA ACTIVO LIMPIO SIN CONSTRUIR.

## Cambios

| Archivo | Cambio | Motivo |
| --- | --- | --- |
| `package.json` | Se eliminó `qa:build-network` | El módulo Construir la Red ya no forma parte del piloto |
| `scripts/qa-build-network-module.mjs` | Se eliminó el script dedicado | Evita validar un módulo removido |
| `scripts/qa-functional-routes.mjs` | Se quitó `/app/construir` de rutas privadas esperadas | La ruta ya no debe aparecer como módulo activo |

## Validación esperada

- `npm run qa:functional` ya no espera `/app/construir`.
- `npm run qa:journeys` no depende de Construir.
- La ruta manual `/app/construir` queda controlada por redirección a `/app`, sin abrir el módulo antiguo.

## Dato preservado

No se borran tablas ni datos históricos asociados a sugerencias. Solo se retiró el QA activo del módulo.
