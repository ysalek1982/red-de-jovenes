# Validacion staging - Biblia e IA Gemini

## URL

- Staging/produccion piloto: https://red-de-jovenes.vercel.app/
- Deployment Vercel validado: `red-de-jovenes-qqikgey10-ysaleks-projects.vercel.app`
- Alias production: https://red-de-jovenes.vercel.app

## Despliegue

Se ejecuto `npx vercel --prod --yes --scope ysaleks-projects` desde el arbol actual.

Resultado:

- Build remoto: OK.
- Alias final: OK.
- SPA fallback: OK por `qa:functional`.

## Edge Functions

Funciones activas en Supabase:

- `admin-ai-settings`
- `ai-generate`
- `ai-action-executor`

Se configuro `AI_CONFIG_MASTER_KEY` como secret de Supabase. No se versiono ni se imprimio la clave.

## QA staging

Variable usada:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas, privadas y modulos principales responden en staging. |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | RPC de versiculo aleatorio disponible desde Supabase. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin opera y no-admin queda bloqueado. |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` | Estado IA via Edge Function, no-admin denegado, key no expuesta. |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` | Sin key Gemini real, la accion queda controlada como `AI_PROVIDER_NOT_CONFIGURED`; accion invalida denegada. |

## Pendientes de staging

- Configurar una llave Gemini real desde el panel admin.
- Probar generacion real de Gemini despues de configurar la llave.
- Cargar Biblia completa solo con fuente/licencia clara.
