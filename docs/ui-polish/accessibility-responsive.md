# Accesibilidad y responsive - Fase 37

## Cambios aplicados

- Se agregaron clases compartidas con focus visible para botones, chips e inputs.
- Se uso `app-page` para padding inferior con `env(safe-area-inset-bottom)`.
- El bottom nav conserva objetivos tactiles grandes y estado activo de alto contraste.
- Filtros de Foros y Oracion usan scroll horizontal sin overflow visible.
- Inputs/selects de Biblia, Mapa, Eventos, Perfil y Construir usan altura tactil consistente.
- Empty states y alertas tienen contraste y estructura uniforme.

## Resoluciones revisadas

- 360px: bottom nav y panel "Mas" no deben tapar formularios.
- 375px/414px: chips pueden desplazarse horizontalmente.
- 768px: grids se reorganizan sin overflow.
- Desktop: navegacion inferior amplia se conserva.

## Pendientes humanos

- Verificacion visual real en Chrome Android.
- Verificacion PWA instalada en dispositivo fisico.
- Ajustes finos por feedback del piloto si aparecen pantallas con textos cortados.

