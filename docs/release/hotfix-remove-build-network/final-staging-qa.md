# QA staging - Hotfix remover Construir

## Dictamen

QA STAGING OK.

## Deployment

| Campo | Valor |
| --- | --- |
| URL pública | `https://red-de-jovenes.vercel.app` |
| Deployment Vercel | `https://red-de-jovenes-bm6u6qs2s-ysaleks-projects.vercel.app` |
| Estado | READY |
| Alias principal | Apunta al deployment nuevo |

## Validaciones ejecutadas contra staging

Se configuró:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validación | Resultado | Observación |
| --- | --- | --- |
| `npm run qa:functional` | OK | `QA_FUNCTIONAL_ROUTES_OK`; `/app/construir` no forma parte de rutas esperadas |
| `npm run qa:admin` | OK | `QA_ADMIN_OK` |
| `npm run qa:bible-corpus` | OK | `QA_BIBLE_CORPUS_COMPLETE_OK`; RVR1909 completa |
| `npm run qa:journeys` | OK | `QA_JOURNEYS_OK` |
| `npm run qa:mobile-scroll` | OK | `QA_MOBILE_SCROLL_OK`; rutas principales HTTP 200 |

## Validación funcional del retiro

- El bundle de staging no incluye chunk de `BuildNetworkPage`.
- `qa:functional` ya no espera `/app/construir`.
- El módulo no está en navegación activa ni QA activo.
- La ruta manual queda controlada por redirección interna a `/app`.

## Pendiente humano

PENDING_HUMAN_VISUAL_CONFIRMATION: abrir la app en móvil real, entrar a Más y confirmar visualmente que Construir la Red no aparece.
