# Release pilot-v1.3.1

## Dictamen

MODULO CONSTRUIR REMOVIDO CORRECTAMENTE.

## Base anterior

- `pilot-v1.3.0`

## URL staging

https://red-de-jovenes.vercel.app

## Cambio principal

Se removió completamente el módulo visible Construir la Red de la experiencia del piloto:

- Menú Más.
- Navegación visible.
- Home.
- Guía rápida.
- Ruta activa.
- Página y servicio.
- QA dedicado.
- Documentación activa del hotfix.

## Comportamiento de ruta antigua

`/app/construir` queda como redirección controlada a `/app`. No abre el módulo antiguo ni deja enlaces muertos visibles.

## Datos preservados

No se eliminaron tablas, migraciones ni datos remotos. `feedback_suggestions` queda preservada como historial/sugerencias generales.

## QA local

OK:

- `npm run lint`
- `npm run build`
- `npm run smoke:build`
- `npm run qa:functional`
- `npm run qa:auth`
- `npm run qa:rls`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:community`
- `npm run qa:forums`
- `npm run qa:prayer`
- `npm run qa:games`
- `npm run qa:map`
- `npm run qa:events`
- `npm run qa:discipleship`
- `npm run qa:messages`
- `npm run qa:search`
- `npm run qa:notifications`
- `npm run qa:pilot-feedback`
- `npm run qa:pilot-incidents`
- `npm run qa:mobile-scroll`

## QA staging

OK contra `https://red-de-jovenes.vercel.app`:

- `npm run qa:functional`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:mobile-scroll`

## Pendientes humanos

- Confirmar en teléfono real que Construir la Red no aparece en el menú Más.
- Confirmar con usuarios piloto que la experiencia simplificada resulta clara.

## Recomendación

Continuar el piloto cerrado usando `pilot-v1.3.1` como release vigente.
