# Formularios Publicos de Cuenta - Pulido Visual

## Objetivo

Normalizar las pantallas de acceso, registro y recuperacion sin cambiar Auth ni redirecciones.

## Rutas revisadas

| Ruta | Ajuste |
| --- | --- |
| `/entrar` | Card unificada, alerta suave y texto de error corregido. |
| `/crear-cuenta` | Card unificada, selector y aceptacion de normas con estilos consistentes. |
| `/recuperar` | Card unificada y mensajes de exito/error alineados al sistema visual. |
| `/actualizar-contrasena` | Card unificada y mensajes de estado mas consistentes. |

## Limites

- No se modificaron servicios de Auth.
- No se cambio la recuperacion de contrasena ni `redirectTo`.
- No se tocaron variables ni Supabase.
- No se agregaron flujos nuevos.

## Estado

LISTO PARA QA
