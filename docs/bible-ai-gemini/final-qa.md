# QA Biblia e IA Gemini

## Scripts agregados

- `npm run qa:bible-db`
- `npm run qa:bible-random`
- `npm run qa:ai-settings`
- `npm run qa:ai-actions`

## Criterios

| Area | Validacion |
|---|---|
| Biblia DB | traduccion activa, 66 libros, RPC aleatorio, RPC capitulo, guardar versiculo, RLS bloquea escritura de texto biblico |
| Versiculo aleatorio | `get_random_bible_verse` devuelve contenido |
| IA Settings | admin consulta estado por Edge Function, no admin bloqueado, `encrypted_api_key` no se expone |
| IA Actions | accion permitida funciona o queda en cola si Gemini no esta configurado, accion invalida se rechaza |

## Nota

Si no existe key Gemini real, `qa:ai-actions` acepta `AI_PROVIDER_NOT_CONFIGURED` como estado correcto porque el sistema maneja el bloqueo sin exponer secretos ni fallar la app.

## Resultado local

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run lint` | OK | ESLint sin errores. |
| `npm run build` | OK | Build Vite generado en `dist`. |
| `npm run smoke:build` | `SMOKE_BUILD_OK` | No se detectaron secretos ni archivos faltantes en `dist`. |
| `npm run qa:auth` | `QA_AUTH_OK` | Usuarios QA A/B con sesion y lecturas base. |
| `npm run qa:rls` | `QA_RLS_OK` | Escritura propia permitida y escritura ajena denegada. |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas y privadas principales responden. |
| `npm run qa:bible` | `QA_BIBLE_OK` | Modulo Biblia existente sigue operativo. |
| `npm run qa:bible-db` | `QA_BIBLE_DB_OK` | Traduccion activa, 66 libros, versiculo aleatorio y capitulo disponibles. |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | RPC de versiculo aleatorio devuelve referencias validas. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin opera y no-admin queda bloqueado. |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` | Estado IA via Edge Function, no-admin denegado, key no expuesta. |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` | Sin key real, la accion queda controlada como `AI_PROVIDER_NOT_CONFIGURED`; accion invalida denegada. |
| `npm run qa:community` | `QA_COMMUNITY_OK` | Comunidad, reportes y RLS social siguen operativos. |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` | Escenarios de joven, participante, admin y seguridad OK. |
