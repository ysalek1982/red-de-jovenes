# Seguridad como capacidad interna

Fecha: 2026-05-19

## Decision

Se retiro Seguridad como modulo visible de la experiencia principal de jovenes. La capacidad sigue existiendo como reportes, cuidado comunitario y moderacion pastoral, pero no compite con los modulos principales.

## Cambios

- Removido `Seguridad` de la navegacion privada.
- Removida la tarjeta `Espacio seguro` de los accesos rapidos de `/app`.
- Removida la seccion destacada de seguridad del home privado.

## Se mantiene

- Ruta secundaria `/app/seguridad` para acceso directo si se necesita.
- `content_reports`.
- `safetyService`.
- Botones de reportar en foros, comentarios y oracion.
- Moderacion de reportes en `/app/admin`.

## Lenguaje recomendado

Cuando aparezca una accion relacionada a reportes debe tratarse como cuidado pastoral:

- Reportar con respeto.
- Avisar a un lider.
- Cuidar comunidad.
- Moderacion pastoral.

## QA esperado

- `qa:functional` puede seguir validando que `/app/seguridad` responde, pero no debe exigir que sea visible en navegacion.
- `qa:forums`, `qa:prayer` y `qa:admin` conservan la cobertura de reportes y moderacion.
