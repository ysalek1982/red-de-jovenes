# Notificaciones internas

## Alcance

Notificaciones internas dentro de la app. No es push real todavia.

## Funciones

- Campana en el header privado.
- Contador de no leidas.
- Lista de notificaciones propias.
- Marcar una como leida.
- Marcar todas como leidas.

## Datos

Tabla:
- `notifications`

## Pendiente futuro

Push real con VAPID/Edge Functions o proveedor compatible.

## QA

Script: `npm run qa:notifications`  
Resultado esperado: `QA_NOTIFICATIONS_OK`
