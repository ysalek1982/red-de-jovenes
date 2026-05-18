# Devocionales base para piloto

Fecha: 2026-05-18

## Objetivo

Evitar que el modulo de devocional diario dependa de un unico registro o de carga manual durante el piloto cerrado.

## Semilla creada

Migracion:

- `20260518240000_seed_pilot_devotionals.sql`

Devocionales activos:

| Fecha | Titulo | Referencia |
| --- | --- | --- |
| 2026-05-18 | Comienza con confianza | Proverbios 3:5 |
| 2026-05-19 | Luz donde estas | Mateo 5:14 |
| 2026-05-20 | Fuerza para seguir | Filipenses 4:13 |
| 2026-05-21 | Paz en medio del ruido | Juan 14:27 |
| 2026-05-22 | Amar de verdad | Juan 13:35 |
| 2026-05-23 | Una fe que da fruto | Santiago 2:17 |
| 2026-05-24 | Juntos en oracion | Mateo 18:20 |

## Criterios editoriales

- Se usaron referencias biblicas y parafrasis breves para evitar textos extensos con licencia incierta.
- Las reflexiones y oraciones son contenido original.
- El tono es juvenil, pastoral y no polemico.

## Validacion esperada

- Usuario autenticado ve devocional del dia.
- Si no hay devocional para una fecha futura, el servicio conserva fallback al ultimo activo disponible.
- Usuario puede marcar leido y guardar favorito.
- Admin puede editar desde el panel existente.

## Pendiente pastoral

Antes del piloto amplio, un lider o equipo de contenido debe revisar estilo, enfoque y calendario final.
