# QA staging - Biblia IA operativa

## URL

- https://red-de-jovenes.vercel.app/

## Deploy

- Vercel production deploy: `red-de-jovenes-fdijqiqx2-ysaleks-projects.vercel.app`
- Alias: https://red-de-jovenes.vercel.app

## Supabase

- Migraciones remotas: al dia.
- Edge Functions desplegadas:
  - `admin-ai-settings`
  - `ai-generate`
  - `ai-action-executor`

## QA staging

Variable usada:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | SPA y rutas principales OK. |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | RPC Biblia aleatoria OK. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin/no-admin OK. |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` | Panel Biblia operativo y no-admin denegado. |
| `npm run qa:ai-settings` | `QA_AI_SETTINGS_OK` | Key no expuesta, estado admin OK. |
| `npm run qa:ai-actions` | `QA_AI_ACTIONS_OK` | Acciones controladas sin proveedor real. |
| `npm run qa:ai-limits` | `QA_AI_USAGE_LIMITS_OK` | Limite diario bloquea segunda solicitud. |
| `npm run qa:ai-prompts` | `QA_AI_PROMPTS_OK` | Plantillas pastorales activas. |
| `npm run qa:ai-real` | `QA_AI_REAL_PROVIDER_SKIPPED` | Gemini real no configurado aun. |
| `npm run qa:ai-approval` | `QA_AI_HUMAN_APPROVAL_OK` | Cola IA aprobada/ejecutada por admin. |

## Pendientes

- Configurar key real de Gemini desde admin.
- Ejecutar `qa:ai-real` hasta obtener `QA_AI_REAL_PROVIDER_OK`.
- Cargar Biblia completa solo con licencia documentada.
