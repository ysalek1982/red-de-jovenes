# Construir la Red

## Ruta

`/app/construir`

## Funciones

- Copiar invitacion a Red de Jovenes.
- Sugerir comunidad.
- Sugerir mejora, evento, contenido o cuidado comunitario.
- Ver estado de mis sugerencias.

## Datos

Tablas:
- `group_suggestions`
- `feedback_suggestions`

## Seguridad

Usuarios crean y leen sus propias sugerencias. Admin podra revisar/cambiar estado desde administracion.

## QA

Script: `npm run qa:build-network`  
Resultado esperado: `QA_BUILD_NETWORK_OK`
