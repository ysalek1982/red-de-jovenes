# Mejora CMS y mobile - 2026-06-02

## Objetivo

Mejorar la experiencia movil y administrativa sin agregar modulos nuevos ni tocar Auth, RLS, Biblia corpus, Gemini o secretos.

## Cambios aplicados

- Se agrego una navegacion interna en Admin para saltar rapidamente entre Centro CMS, Piloto, Devocional, Biblia, IA, Feedback, Incidentes y Reportes.
- Se agrego un bloque "Centro CMS" con accesos por tarea para publicar contenido, gestionar Biblia, cuidar comunidad y operar piloto.
- Se mejoro el formulario de devocionales con labels visibles, ayuda contextual y flujo de publicacion.
- Se mejoro la programacion del versiculo diario con labels claros y campos mas faciles de usar en telefono.
- Se tradujeron estados visibles de feedback e incidentes para que el admin no vea codigos internos en ingles.
- Se ajusto soporte CSS para scroll horizontal tactil y anclas internas con margen superior adecuado.
- Se mejoro el cierre de notificaciones en movil: cambio de ruta, tecla Escape y toque fuera.
- Se agrego contencion de scroll y safe-area en el menu Mas y en el formulario de feedback.
- Se aumento el tamano tactil de botones pequenos reutilizables.
- Se agrego proteccion contra textos largos en Foros, Oracion y Comunidad/Mapa.
- Se mejoro el formulario "Sugerir comunidad" con labels persistentes, autocompletado y campos mas claros.
- Se mejoro el formulario admin de eventos como carga CMS, incluyendo selector visible de modalidad.
- Se agrego edicion y desactivacion no destructiva de eventos activos para administradores.
- Se extendio la actualizacion de eventos para mantener titulo, descripcion, modalidad, pais, ciudad y fecha desde el formulario CMS.
- Se agrego cierre por Escape y click fuera al dialogo de feedback.
- Se ajusto el padding inferior seguro de la ruta interna de reportes/seguridad sin hacerla visible en la navegacion.
- Se mantuvo la informacion real de Supabase; no se agregaron datos ficticios.

## Seguridad y alcance

- No se modificaron politicas RLS.
- No se tocaron tablas ni migraciones.
- No se expuso ninguna key.
- No se activo Gemini.
- No se modifico el corpus biblico.
- No se reintrodujo el modulo Construir la Red.

## Pendiente de validacion

- Probar Admin en telefono fisico.
- Confirmar que los administradores comprenden el flujo de carga de devocionales y versiculo diario.

## QA ejecutado

- `npm run lint`: OK.
- `npm run build`: OK.
- `npm run smoke:build`: OK, `SMOKE_BUILD_OK`.
- `npm run qa:mobile-scroll`: OK, `QA_MOBILE_SCROLL_OK` en validacion estatica local.
- Nueva corrida posterior a edicion/desactivacion de eventos:
  - `npm run lint`: OK.
  - `npm run build`: OK.
  - `npm run smoke:build`: OK.
  - `npm run qa:mobile-scroll`: OK.
  - `npm run qa:events`: BLOQUEADO por DNS externo de Supabase.
- `npm run qa:functional`: BLOQUEADO por DNS externo de Supabase (`ENOTFOUND ntlzlfbztryasbmjnynq.supabase.co`).
- `npm run qa:admin`: BLOQUEADO por el mismo DNS externo de Supabase.
- `npm run qa:journeys`: BLOQUEADO por el mismo DNS externo de Supabase.
- `npm run qa:map`: BLOQUEADO por el mismo DNS externo de Supabase.
- `npm run qa:events`: BLOQUEADO por el mismo DNS externo de Supabase.

## Pendientes

- Probar Admin en telefono fisico.
- Reintentar QA funcional/admin/journeys cuando el DNS de Supabase responda.
