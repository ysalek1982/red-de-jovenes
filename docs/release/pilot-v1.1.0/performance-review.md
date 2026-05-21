# Revision de Rendimiento Basico - pilot-v1.1.0

Fecha: 2026-05-21

## Build

Comando:

```powershell
npm run build
```

Resultado: OK.

## Bundle principal

| Artefacto | Tamano | Gzip |
| --- | ---: | ---: |
| `assets/index-Da50drBq.js` | 472.26 kB | 137.73 kB |
| `assets/index-K-dv12ui.css` | 49.47 kB | 8.85 kB |
| `assets/AdminHome-DEX_rhZ0.js` | 59.87 kB | 13.13 kB |
| `assets/WorldMapPage-8bq_fDIG.js` | 20.97 kB | 5.71 kB |
| `assets/AppShell-Duv0fi5o.js` | 17.02 kB | 4.95 kB |
| `assets/AppHome-BlzmEm7Q.js` | 16.70 kB | 4.77 kB |
| `assets/BiblePage-BohyIjKL.js` | 16.55 kB | 4.46 kB |

## Assets

Archivos mas pesados:

| Archivo | Tamano |
| --- | ---: |
| `assets/hero-youth.jpg` | 141286 bytes |
| `assets/bible-study.jpg` | 113011 bytes |
| `assets/cross-glow.jpg` | 96482 bytes |

No se detectaron imagenes pesadas que bloqueen el piloto.

## PWA staging

| Recurso | Resultado |
| --- | --- |
| `https://red-de-jovenes.vercel.app/manifest.webmanifest` | 200 |
| `https://red-de-jovenes.vercel.app/sw.js` | 200 |
| `https://red-de-jovenes.vercel.app/offline.html` | 200 |

## Vercel ignore

Se agrego `.vercelignore` para evitar envios accidentales de:

- `.env*`
- `.auth/`
- `supabase/.temp/`
- `node_modules`
- `dist`
- logs

## Observaciones

- Vite reporto tiempos de plugin CSS/postCSS como informacion de build, sin fallo ni warning bloqueante.
- No se hicieron optimizaciones grandes porque no hay advertencias graves.

## Dictamen

PERFORMANCE_REVIEW_OK.
