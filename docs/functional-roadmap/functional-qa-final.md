# QA funcional final por modulo

Fecha: 2026-05-18

## Resumen

La maduracion funcional de Fase 20 agrego validaciones dinamicas para administracion, juegos y mapa, y amplio las pruebas existentes de oracion y foros. Todas las pruebas se ejecutaron contra Supabase usando usuarios QA confirmados y claves publicables, sin `service_role` en frontend.

## Resultados

| Area | Comando | Resultado | Evidencia | Pendiente |
| --- | --- | --- | --- | --- |
| Lint | `npm run lint` | OK | ESLint sin errores | Ninguno |
| Build | `npm run build` | OK | TypeScript y Vite build exitosos | Ninguno |
| Smoke build | `npm run smoke:build` | `SMOKE_BUILD_OK` | `dist` contiene `index.html`, manifest, SW y assets; sin secretos detectados | Ninguno |
| Auth | `npm run qa:auth` | `QA_AUTH_OK` | Login A/B, sesion, lectura de perfil/devocionales/posts/oraciones y logout | Ninguno |
| RLS | `npm run qa:rls` | `QA_RLS_OK` | Escritura propia permitida y escritura sobre datos ajenos denegada | Ninguno |
| Rutas | `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas/privadas responden segun autenticacion y rol | Ninguno |
| Oracion | `npm run qa:prayer` | `QA_PRAYER_OK` | Crear peticion, categoria, anonimato, soporte, respuesta y restricciones propias | Ninguno |
| Foros | `npm run qa:forums` | `QA_FORUMS_OK` | Crear/editar post, comentar/editar comentario, reaccionar, reportar y restricciones propias | Ninguno |
| Admin | `npm run qa:admin` | `QA_ADMIN_OK` | Rol admin, no-admin bloqueado, moderacion de reporte y escritura admin de devocional | Ninguno |
| Juegos | `npm run qa:games` | `QA_GAMES_OK` | Guardar puntaje propio, leer historial propio y bloquear escritura ajena | Ninguno |
| Mapa | `npm run qa:map` | `QA_MAP_OK` | Leer grupos, sugerir comunidad y moderar sugerencia como admin | Ninguno |

## Scripts nuevos

- `scripts/qa-admin-module.mjs`
- `scripts/qa-games-module.mjs`
- `scripts/qa-map-module.mjs`

## Scripts ampliados

- `scripts/qa-prayer-module.mjs`
- `scripts/qa-forums-module.mjs`

## Notas de seguridad

- Las pruebas usan variables locales ignoradas por Git.
- No se escriben passwords, service role ni connection strings privadas en archivos versionables.
- La prueba admin usa el usuario administrador disponible en el entorno QA local.
