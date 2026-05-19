# Cierre movil para piloto

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Dictamen

LISTO PARA PILOTO CERRADO CON OBSERVACION HUMANA.

La experiencia movil, los juegos y la PWA base quedaron validados por QA automatizado y revision tecnica. La unica observacion pendiente es una prueba humana en dispositivo real para confirmar instalacion PWA desde el navegador, apertura desde icono, comportamiento del teclado movil y uso tactil prolongado.

## Estado del menu movil

- Bottom nav tipo app activo en movil.
- Accesos principales visibles: Inicio, Oracion, Foros, Juegos, Mapa y Mas.
- El panel Mas contiene Devocional, Perfil, Administracion solo para admin y Cerrar sesion.
- Se ajusto el safe-area inferior para que el menu no tape formularios ni botones en dispositivos con barra de navegacion.
- Desktop conserva la navegacion amplia sin cambios de concepto.

## Estado de juegos

Todos los juegos visibles en `/app/juegos` son jugables:

- Versiculo Rapido.
- Trivia Biblica.
- Adivina la Historia.
- Memory Match.
- Desafio de Fe.

`npm run qa:games` confirmo guardado de puntajes, historial propio, rechazo de puntajes invalidos, rechazo de `game_key` invalido y bloqueo de escritura para otro usuario.

## Estado PWA

- `manifest.webmanifest` responde 200.
- `sw.js` responde 200.
- `offline.html` responde 200.
- `start_url` es `/`.
- `scope` es `/`.
- `display` es `standalone`.
- El service worker cachea solo recursos del mismo origen y no cachea respuestas de Supabase.
- Instalacion real desde Chrome Android o Edge/Chrome Desktop queda como `PENDING_HUMAN_DEVICE_TEST`.

## Seguridad visible y reportes internos

- El modulo Seguridad no aparece en el home ni en la navegacion principal.
- `/app/seguridad` permanece como ruta secundaria oculta.
- Los botones de reportar en modulos sociales siguen activos.
- La moderacion de reportes sigue disponible en administracion.
- La decision mantiene una experiencia menos pesada para jovenes sin perder cuidado comunitario.

## Estado admin

- Administracion solo aparece para usuarios con rol admin.
- `npm run qa:admin` confirmo acceso admin, bloqueo a no admin, KPIs, reportes, devocionales y sugerencias.
- No se usa `service_role` en frontend.

## QA completo

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | Build Vite correcto. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Build de produccion sin secretos detectados. |
| `npm run qa:auth` | QA_AUTH_OK | Auth con usuarios QA confirmado. |
| `npm run qa:rls` | QA_RLS_OK | Aislamiento RLS confirmado. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas staging principales OK. |
| `npm run qa:prayer` | QA_PRAYER_OK | Sala de oracion OK. |
| `npm run qa:forums` | QA_FORUMS_OK | Foros, comentarios, reacciones y reportes OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin y bloqueo no admin OK. |
| `npm run qa:games` | QA_GAMES_OK | Juegos completos OK. |
| `npm run qa:map` | QA_MAP_OK | Mapa y sugerencias OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Escenarios end-to-end OK. |

## Pendientes reales

- Ejecutar prueba PWA en dispositivo fisico: instalar, abrir desde icono, login, navegacion offline basica y desinstalacion.
- Validar tacto real con 2 o 3 usuarios piloto en Android antes de ampliar el grupo.
- Revisar feedback de teclado movil en formularios largos durante el piloto.

## Recomendacion

Iniciar piloto cerrado con grupo reducido. Mantener monitoreo de reportes, Auth, RLS, instalacion PWA y navegacion movil durante las primeras sesiones.
