# Rediseño de menu movil

Fecha: 2026-05-19

## Objetivo

Convertir la navegacion privada en una experiencia mas cercana a una app movil, reduciendo saturacion y priorizando las acciones principales del piloto.

## Navegacion movil nueva

Bottom nav fijo con accesos principales:

- Inicio
- Oracion
- Foros
- Juegos
- Mapa
- Mas

El boton `Mas` abre una hoja secundaria con:

- Devocional
- Perfil
- Administracion, solo si el usuario tiene rol admin
- Cerrar sesion

## Desktop

Desktop mantiene navegacion inferior amplia con:

- Inicio
- Oracion
- Foros
- Juegos
- Mapa
- Devocional
- Perfil
- Administracion, solo admin
- Salir

## Decisiones UX

- Seguridad no aparece en el menu.
- El menu movil marca el modulo activo.
- El panel `Mas` se cierra al elegir una ruta o al tocar cerrar.
- La barra considera `safe-area-inset-bottom` para dispositivos moviles.
- El shell conserva el `InstallPrompt` sin duplicarlo dentro del menu.

## Validacion

- `npm run lint`: OK.
- `npm run build`: OK.
- La ruta `/app/seguridad` permanece disponible como ruta secundaria oculta, pero no forma parte de la navegacion visible.
