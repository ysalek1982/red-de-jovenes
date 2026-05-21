# Inicio comunitario - Fase 37

## Objetivo

Pulir `/app` para que se sienta como portada viva de la comunidad, no como panel tecnico.

## Cambios aplicados

- La pantalla ahora usa `app-page` y deja de agregar decoracion fija innecesaria.
- El saludo principal refuerza tono comunitario: "Hoy tambien puedes ser luz".
- Se aplicaron clases compartidas a cards, alertas, inputs, botones y empty states.
- El versiculo del momento queda como card destacada con acciones tactiles.
- El composer rapido mantiene la creacion real de publicaciones en Foros.
- Las cards de acciones, progreso, pulso, devocional, oraciones y foros quedan visualmente mas consistentes.
- Los estados vacios usan patron `app-empty` y mantienen datos reales, sin metricas ficticias.

## Sin cambios funcionales

- No se modificaron consultas Supabase.
- No se agregaron modulos.
- No se reintrodujo Seguridad.
- No se altero Auth, RLS, Biblia completa ni Gemini.

## QA requerido

- `npm run qa:functional`
- `npm run qa:journeys`
- `npm run qa:community`

