# Revision de seguridad frontend

## Alcance

Revision enfocada en cliente, configuracion de deploy y exposicion accidental de secretos.

## Validaciones

| Punto | Resultado | Observacion |
|---|---:|---|
| `service_role` en `src` | OK | No se detecto uso en frontend. |
| Gemini key en frontend | OK | No hay `GEMINI_API_KEY` ni variable `VITE_*` para Gemini en `src`. |
| Connection strings | OK | No se detectaron strings de base en frontend. |
| Supabase frontend | OK | `src/lib/supabase.ts` usa publishable key. |
| Admin visible solo admin | OK | Se mantiene control por rol y QA admin vigente. |
| Seguridad visible en menu | OK | No se reintrodujo como modulo principal. |
| LocalStorage sensible | OK | Solo se usa para descarte del prompt PWA. |
| Mensajes privados | OK | El cliente consulta via RLS; no se agregaron bypasses. |

## Hallazgos esperados fuera de frontend

Los scripts administrativos y Edge Functions referencian `SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_PASSWORD` como variables de entorno. Esto es esperado para herramientas administrativas y backend, no para `src`.

## Cambio aplicado

`.vercelignore` se reforzo para excluir:

- `.env*.local`
- `.vercel`
- `*.local.json`

## Decision

No se tocaron Auth/RLS, Gemini ni Biblia corpus. No se agregaron secretos ni variables nuevas.
