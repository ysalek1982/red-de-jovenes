# Completitud de perfil

Fecha: 2026-05-21

## Campos evaluados

| Campo | Motivo |
| --- | --- |
| Nombre | Identidad visible dentro de la Red. |
| Ciudad | Ayuda a conectar por cercania. |
| Pais | Contexto global de comunidad. |
| Iglesia o comunidad | Sentido de pertenencia. |
| Bio | Presentacion breve y humana. |
| Avatar | Hace la experiencia mas social. |

## Cambios

- `AppHome` usa el porcentaje de completitud del servicio de onboarding para mostrar una tarjeta de perfil incompleto.
- `AppProfile` muestra progreso visual, conteo de campos y lista de datos faltantes.
- El perfil incompleto no bloquea el uso de la app.
- No se agregaron migraciones ni reglas nuevas.

## Validacion

- El calculo es local a partir del perfil existente.
- Si faltan datos, se muestra CTA claro.
- Si el perfil esta completo, se muestra confirmacion pastoral y no tecnica.
