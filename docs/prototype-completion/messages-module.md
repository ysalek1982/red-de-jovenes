# Modulo Mensajes seguros

## Ruta

`/app/mensajes`

## Alcance real

Mensajeria asincrona segura. No se promete chat en tiempo real.

## Funciones

- Ver conversaciones donde el usuario es miembro.
- Crear conversacion directa con perfiles sugeridos.
- Enviar mensaje.
- Leer mensajes de conversaciones propias.
- Reportar mensaje con lenguaje pastoral: "Avisar a un lider".

## Datos

Tablas:
- `conversations`
- `conversation_members`
- `messages`
- `message_reports`

## Seguridad

RLS limita lectura/envio a miembros de la conversacion. Los reportes de mensajes son visibles para admin.

## QA

Script: `npm run qa:messages`  
Resultado esperado: `QA_MESSAGES_OK`
