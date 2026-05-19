# Edge Functions IA Gemini

## Funciones creadas

- `admin-ai-settings`
- `ai-generate`
- `ai-action-executor`

## Principios

- Gemini se llama solo desde Supabase Edge Functions.
- La key no usa `VITE_*`.
- La key se cifra con `AI_CONFIG_MASTER_KEY` antes de guardarse.
- El frontend solo recibe estado enmascarado.
- Las acciones sensibles pasan por cola y aprobacion admin.

## Deploy

```powershell
npx supabase functions deploy admin-ai-settings
npx supabase functions deploy ai-generate
npx supabase functions deploy ai-action-executor
```

## Secretos requeridos

Supabase gestiona:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Configurar manual/local:

```powershell
npx supabase secrets set AI_CONFIG_MASTER_KEY="<clave-larga-generada-localmente>"
```

La API key Gemini se guarda desde el panel admin o por la funcion `admin-ai-settings`; nunca se versiona.
