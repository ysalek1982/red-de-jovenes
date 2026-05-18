# Reporte final de contenido base para piloto

Fecha: 2026-05-18

## Dictamen

**CONTENIDO Y ESCENARIOS LISTOS PARA STAGING**

## Resumen ejecutivo

La Fase 24 preparo contenido inicial, datos semilla y escenarios end-to-end para que Red de Jovenes llegue a staging con una experiencia mas completa para usuarios reales. No se trabajo Vercel ni staging. No se agregaron modulos nuevos. No se versionaron secretos.

## Devocionales base

Se agregaron 7 devocionales activos para la semana inicial del piloto:

- Comienza con confianza.
- Luz donde estas.
- Fuerza para seguir.
- Paz en medio del ruido.
- Amar de verdad.
- Una fe que da fruto.
- Juntos en oracion.

Migracion:

- `20260518240000_seed_pilot_devotionals.sql`

## Comunidades base

El Mapa Mundial ahora cuenta con comunidades iniciales editables:

- Bolivia / Santa Cruz de la Sierra.
- Bolivia / La Paz.
- Bolivia / Cochabamba.
- Argentina / Buenos Aires.
- Colombia / Bogota.
- Mexico / Ciudad de Mexico.

Estas comunidades son contenido base para piloto, sin contactos personales ni enlaces inventados.

Migracion:

- `20260518241000_seed_pilot_groups.sql`

## Juegos

Se amplio el banco de preguntas:

- Versiculo Rapido: 15 preguntas.
- Trivia Biblica: 15 preguntas.

Archivo:

- `src/data/faithGamesData.ts`

## Normas de comunidad

Se reforzo Espacio seguro con reglas pastorales sobre:

- respeto y conversaciones sanas;
- privacidad;
- cuidado de menores;
- reportes como herramienta de cuidado;
- moderacion con acompanamiento.

Archivo:

- `src/pages/SafetyPage.tsx`

## Onboarding

El inicio privado ahora guia al usuario con primeros pasos:

- completar perfil;
- orar por alguien;
- participar en Foros con la Palabra.

Tambien se mejoraron empty states de oracion y foros.

Archivo:

- `src/pages/AppHome.tsx`

## Escenarios reales

Se documentaron y automatizaron recorridos para:

- joven nuevo;
- joven participante;
- admin/lider;
- seguridad y reportes.

Script:

- `npm run qa:journeys`

Resultado:

- `QA_JOURNEYS_OK`

## Migraciones aplicadas

- `20260518240000_seed_pilot_devotionals.sql`
- `20260518241000_seed_pilot_groups.sql`
- `20260518242000_allow_idempotent_devotional_progress.sql`

La tercera migracion corrige un hallazgo real: progreso devocional idempotente con `upsert`.

## QA ejecutado

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## Riesgos

- Las comunidades base son editables y requieren curaduria humana antes de produccion.
- Los devocionales deben ser revisados por liderazgo pastoral antes de piloto amplio.
- Las preguntas de juegos deben revisarse editorialmente si se amplian categorias.
- Recuperacion de contrasena y PWA instalada dependen de staging/HTTPS.

## Pendientes

- Confirmar comunidades reales y contactos oficiales.
- Revisar contenido con equipo pastoral.
- Probar registro con usuarios reales de piloto.
- Repetir QA con URL staging cuando exista.

## Recomendacion

Avanzar a staging real. El contenido base y los escenarios ya estan listos para una primera prueba cerrada con jovenes, moderadores y administrador.
