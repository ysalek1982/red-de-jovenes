# QA integral por modulos

Fecha: 2026-05-18

## Comandos ejecutados

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

## Tabla por modulo

| Modulo | QA ejecutado | Resultado | Evidencia | Pendiente |
| --- | --- | --- | --- | --- |
| Auth/Login | `qa:auth` | OK | Login QA A/B, sesiones y lecturas base | Probar email recovery real en staging |
| Registro/Onboarding | `qa:auth`, checklist manual | OK con observacion | Auth y trigger perfil validados por usuarios QA | Probar registro nuevo en URL staging |
| Recuperacion | Build + ruta | OK con observacion | Ruta `/actualizar-contrasena` creada | Validar email real y redirects Supabase |
| Perfil | `qa:functional`, `qa:rls` | OK | Upsert perfil y bloqueo ajeno | Revisar avatar manual en UI |
| Inicio privado | `qa:functional` | OK | `/app` responde y carga con sesion | QA visual mobile en staging |
| Sala de oracion | `qa:prayer`, `qa:rls` | OK | Crear, apoyar, duplicado denegado, update ajeno denegado | Ninguno critico |
| Foros con la Palabra | `qa:forums`, `qa:rls` | OK | Post, comentario, Amen, reporte comentario, bloqueo ajeno | Ninguno critico |
| Devocional diario | `qa:functional`, `qa:rls` | OK | Lectura, favorito y escritura normal denegada | Cargar mas devocionales para piloto |
| Juegos de fe | Build + checklist manual | OK base | Flujo frontend funcional | Persistencia de puntaje futura |
| Mapa mundial | `qa:functional` | OK | Grupos y sugerencias | Mapa geografico real futuro |
| Espacio seguro/reportes | `qa:functional`, `qa:forums` | OK | Reporte general y reporte comentario | Proceso humano diario |
| Preferencias/notificaciones | `qa:functional` | OK | Upsert preferencias | Push real futuro |
| Panel admin | `qa:functional`, `qa:rls` | OK | Admin OK, no admin bloqueado | QA visual tablet/staging |
| PWA/offline/install | `smoke:build` | OK base | Manifest, SW, offline y assets | Instalar en dispositivo real |
| Landing/demo/routing | `qa:functional` | OK | Rutas publicas/privadas principales | SPA fallback en hosting |
| Supabase/RLS | `qa:rls`, migration list previo | OK | Usuarios A/B y aislamiento de datos | Mantener pruebas por deploy |

## Scripts nuevos

- `npm run qa:functional`
- `npm run qa:prayer`
- `npm run qa:forums`

## Resultado

Los modulos principales quedan cubiertos por QA automatizado o checklist manual explicito para piloto.
