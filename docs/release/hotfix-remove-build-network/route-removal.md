# Remocion de ruta y pagina Construir

Fecha: 2026-05-21

## Cambios

| Elemento | Cambio |
| --- | --- |
| `src/routes/AppRoutes.tsx` | Se removio el lazy import de `BuildNetworkPage`. |
| `/app/construir` | Ahora redirige a `/app` con `Navigate replace`. |
| `src/pages/BuildNetworkPage.tsx` | Archivo eliminado porque ya no hay ruta activa. |
| `src/features/buildNetwork/buildNetworkService.ts` | Archivo eliminado porque era exclusivo del modulo. |

## Datos

- No se eliminaron tablas remotas.
- No se crearon migraciones destructivas.
- `feedback_suggestions` se conserva por historial y compatibilidad.

## Resultado esperado

- Entrar manualmente a `/app/construir` no abre el modulo antiguo.
- El bundle ya no debe generar chunk de `BuildNetworkPage`.
