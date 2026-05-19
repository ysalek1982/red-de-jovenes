# Revision final PWA para piloto movil

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Validaciones desde entorno Codex

| Recurso | Resultado |
| --- | --- |
| `/manifest.webmanifest` | 200 |
| `/sw.js` | 200 |
| `/offline.html` | 200 |

Manifest:

```json
{
  "name": "Red de Jóvenes",
  "short_name": "Red Jóvenes",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#020617",
  "icons": 1
}
```

## Service worker

Estado: OK base.

- Cachea recursos propios de la app.
- Ignora origenes externos con `url.origin !== self.location.origin`.
- No cachea respuestas de Supabase.
- Para navegacion offline usa fallback `/offline.html`.

## Install prompt

Estado: preparado.

- `InstallPrompt` escucha `beforeinstallprompt`.
- No se muestra si la app ya esta en modo standalone.
- Si el usuario descarta la instalacion del prompt del navegador, guarda preferencia local y no insiste.

## Flujo esperado

| Caso | Resultado esperado |
| --- | --- |
| Abrir app instalada sin sesion | `start_url` `/` redirige a `/entrar`. |
| Abrir app instalada con sesion | `start_url` `/` redirige a `/app`. |
| Perder conexion en navegacion | Muestra fallback offline. |
| Volver online | La app carga datos desde Supabase normalmente. |

## Pendiente humano

PENDING_HUMAN_DEVICE_TEST.

No se puede confirmar desde Codex:

- aparicion real del prompt de instalacion en Chrome Android;
- instalacion desde icono en Android;
- instalacion desde Chrome/Edge Desktop;
- apertura desde icono instalado;
- comportamiento con teclado movil real;
- offline fallback en dispositivo fisico.

Estos puntos deben validarse con el checklist movil antes del piloto con mas usuarios.
