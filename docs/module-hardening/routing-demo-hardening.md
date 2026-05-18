# Endurecimiento de routing, landing y demo

## Rutas revisadas

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/actualizar-contrasena`
- `/app/*`

## Auditoria

| Punto | Estado |
| --- | --- |
| `/` sin sesion | Redirige a `/entrar` |
| `/` con sesion | Redirige a `/app` |
| `/landing` | Publica y conserva concepto Lovable |
| `/demo` | Publica y no exige login |
| `/app` | Protegida por sesion |
| Rutas privadas | Protegidas por `ProtectedRoute` |
| Ruta desconocida | Redirige a `/` |
| Shell publico/privado | Separado por layout y `AppShell` |
| SPA fallback | Documentado para hosting |

## Correcciones relacionadas

- Se agrego `/actualizar-contrasena` como parte real del flujo de recuperacion.

## QA

- `npm run qa:functional` valida rutas principales contra servidor local.
- `npm run smoke:build` valida build y archivos PWA.

## Estado

**Funcional para staging/piloto.**

Pendiente deploy: configurar fallback SPA en hosting para que refresh de rutas internas sirva `index.html`.
