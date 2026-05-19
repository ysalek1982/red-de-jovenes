# Modulo Eventos

## Ruta

`/app/eventos`

## Funciones

- Lista de proximos eventos activos.
- Filtros:
  - todos;
  - online;
  - esta semana;
  - mis confirmados.
- Confirmar asistencia.
- Cancelar asistencia.
- Crear evento desde UI admin.

## Datos

Tablas:
- `events`
- `event_rsvps`

## Seguridad

Usuarios autenticados leen eventos activos y gestionan solo su RSVP. El creador o admin puede actualizar eventos.

## QA

Script: `npm run qa:events`  
Resultado esperado: `QA_EVENTS_OK`
