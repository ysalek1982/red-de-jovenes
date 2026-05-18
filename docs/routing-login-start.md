# Entrada directa a login

Fecha: 2026-05-18

## Cambio aplicado

La ruta raíz `/` ahora funciona como entrada de aplicación:

- Sin sesión: redirige a `/entrar`.
- Con sesión: redirige a `/app`.

La landing pública se conserva completa en:

```text
/landing
```

El demo público se mantiene en:

```text
/demo
```

## Motivo

La app debe comportarse como PWA instalada: al abrirla desde el icono de inicio
no debe presentar una landing promocional, sino llevar al usuario al login o a su
red privada según el estado de sesión.

## Rutas públicas finales de esta fase

- `/`: entrada inteligente.
- `/landing`: landing pública del prototipo Lovable.
- `/demo`: demo público del producto.
- `/entrar`: login.
- `/crear-cuenta`: registro.

## PWA

`public/manifest.webmanifest` conserva:

- `start_url: /`
- `scope: /`
- `display: standalone`

Con esto, una instalación PWA abre la entrada inteligente y mantiene el flujo
esperado.

## QA

- `npm run lint`: OK.
- `npm run build`: OK.

No se crearon migraciones en esta fase.
