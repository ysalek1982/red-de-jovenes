# Biblia - Fase 37

## Objetivo

Hacer que `/app/biblia` sea mas comoda para lectura, busqueda y guardado sin tocar el corpus RVR1909, RPC, RLS ni Gemini.

## Cambios aplicados

- La pagina usa `app-page` para safe-area y padding movil consistente.
- Versiculo diario/aleatorio queda como card destacada.
- Inputs, selects y textareas usan patrones tactiles compartidos.
- Acciones principales usan botones consistentes.
- Acciones por versiculo pasan de links pequenos a chips tactiles.
- Lectura por capitulo, busqueda, planes, guardados y subrayados usan cards compartidas.
- Empty states mantienen la explicacion real del corpus sin prometer datos inexistentes.
- La etiqueta "Sugerido por IA" se mantiene para salidas asistidas.

## Sin cambios funcionales

- No se modifica `bibleService`.
- No se modifica la Biblia completa importada.
- No se modifica Gemini ni secrets.
- No se cambia la logica de guardados, subrayados, busqueda o planes.

## QA requerido

- `npm run qa:bible-corpus`
- `npm run qa:bible-search`
- `npm run qa:bible-reader`
- `npm run qa:bible-plans`
- `npm run qa:bible-daily`
- `npm run qa:bible-ai`

