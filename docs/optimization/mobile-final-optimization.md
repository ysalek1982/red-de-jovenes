# Optimizacion movil final

## Revision

Se revisaron los puntos de riesgo movil:

- bottom nav fijo;
- menu `Mas`;
- formularios largos;
- teclado movil;
- scroll/foco corregido en hotfix `pilot-v1.1.1`;
- Biblia lectura larga;
- juegos tactiles;
- mensajes/chat;
- safe-area.

## Cambio aplicado

Archivo: `src/index.css`

- `touch-action: manipulation` en controles de formulario/botones para mejorar respuesta tactil.
- `font-size: 16px` en inputs, textarea y selects en pantallas menores a `640px` para evitar zoom accidental en iOS.

## Estado

- Bottom nav se mantiene.
- Seguridad no vuelve al menu visible.
- No se modifica flujo de Auth/RLS.
- No se cambia layout general.

## Pendiente humano

Probar en telefono fisico:

- teclado en formularios de Perfil, Oracion, Foros y Feedback;
- cambio de capitulo en Biblia;
- iniciar/terminar juegos;
- abrir menu `Mas`;
- scroll despues de navegar entre modulos.
