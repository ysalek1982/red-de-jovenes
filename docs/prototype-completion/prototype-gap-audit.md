# Auditoria de brechas contra prototipo Lovable

Fecha: 2026-05-19  
Referencia: https://red-de-jovenes.lovable.app/ y https://red-de-jovenes.lovable.app/app  
Staging actual: https://red-de-jovenes.vercel.app/

## Resumen ejecutivo

El prototipo Lovable muestra una red social cristiana juvenil con inicio tipo feed, versiculo del momento, historias/circulos, buscador global y modulos visibles para Biblia, Devocional, Orar, Discipulado, Foros, Eventos, Juegos, Comunidad, Mensajes, Perfil y Construir. La app actual ya cuenta con autenticacion real, RLS, oracion, foros, devocional, juegos, mapa/comunidades, perfil, admin, reportes internos y PWA, pero todavia faltan varios modulos del prototipo y una capa mas fuerte de red social.

La prioridad de Fase 29 es completar los modulos visibles que faltan sin convertir la app en portal institucional, sin exponer secretos y sin reintroducir Seguridad como modulo principal.

## Hallazgos principales del prototipo

- La landing conserva el concepto: "La red social cristiana de la nueva generacion" y "Conectando jovenes en Cristo".
- El demo interno usa navegacion amplia: Inicio, Biblia, Devocional, Orar, Discipulado, Foros, Eventos, Juegos, Comunidad, Mensajes, Perfil y Construir.
- El home prototipo se siente social: versiculo del momento, historias, composer, feed con testimonios/eventos/oracion, racha, versiculos guardados y sugerencias.
- Varias metricas de la landing son aspiracionales; en la app real no deben mostrarse como datos reales si no vienen de Supabase.
- El prototipo sugiere buscador global y mensajes, pero no prueba persistencia real; en la app real deben quedar como funcionalidades base reales, no decorativas.

## Tabla de brechas

| Modulo | En prototipo | En app actual | Brecha | Accion requerida | Prioridad |
|---|---|---|---|---|---|
| Home tipo red social | Feed social, historias, composer, versiculo y sugerencias | Home comunitario con datos reales y accesos | Falta composer rapido, feed combinado mas social, historias/circulos y sugerencias | Convertir /app en feed social cristiano con datos reales y estados vacios utiles | Alta |
| Biblia | Ruta /app/biblia y versiculos guardados | No existe modulo dedicado | Falta lectura, guardados, progreso y subrayados | Crear modulo Biblia funcional con progreso propio y versiculos guardados | Alta |
| Comunidad/Mapa | Comunidad global y mapa | Mapa funcional con grupos, sugerencias y membresias | Necesita integrarse mas con home, perfil y acciones sociales | Mantener mapa real y enlazarlo desde Comunidad en "Mas" | Alta |
| Mensajes | Ruta /app/mensajes | No existe | Falta mensajeria segura | Crear mensajeria asincrona sin prometer tiempo real | Alta |
| Eventos | Ruta /app/eventos y publicaciones de evento | No existe modulo dedicado | Falta eventos y RSVP | Crear eventos comunitarios con asistencia propia | Alta |
| Discipulado | Ruta /app/discipulado | No existe | Falta rutas de crecimiento | Crear tracks, pasos y progreso personal | Alta |
| Buscador global | Campo "Buscar amigos, versiculos, secciones" | No existe busqueda global | Falta busqueda transversal | Crear GlobalSearch respetando RLS | Alta |
| Menu movil ampliado | Muchos modulos visibles | Bottom nav simple de 5 accesos | Falta arquitectura para mas modulos | Reorganizar bottom nav y "Mas" sin mostrar Seguridad | Alta |
| Historias/circulos | Usuarios y comunidades recientes | No existe como seccion explicita | Falta sensacion social inmediata | Usar perfiles/comunidades reales como circulos de actividad | Media |
| Sugerencias | Personas/grupos a seguir | Comunidades en mapa, sin seguir usuarios | Falta seguir/dejar de seguir | Crear user_follows y sugerencias reales | Media |
| Perfil social | Perfil en prototipo | Perfil propio funcional | Falta pertenencia social mas visible | Mostrar comunidades, actividad y relaciones propias | Media |
| Construir la Red | Ruta /app/construir | No existe | Falta invitar/sugerir/feedback | Crear modulo para invitar, sugerir comunidad/evento/mejora | Media |
| Rachas/progreso | Racha y versiculos guardados | Progreso por devocional/juegos parcial | Falta integrarlo a Biblia/home | Mostrar progreso real, no ficticio | Media |
| Notificaciones internas | Sensacion de red activa | Preferencias sin notificaciones internas | Falta campana/lista interna | Crear notificaciones internas sin push real | Media |
| Chat en tiempo real | Mensajes parecen inmediatos | No existe | Realtime no es requisito seguro para piloto | Implementar mensajes asincronos y documentar limite | Baja |
| Mapa geografico avanzado | Comunidad global visual | Mapa visual interactivo propio | No hay mapa geografico real | Mantener mapa visual funcional; geografia avanzada futura | Baja |
| Push real | Landing menciona notificaciones | PWA base sin push real | Push requiere llaves/edge setup | Mantener preferencias y notificaciones internas; push futuro | Baja |

## Decision de alcance Fase 29

Se implementaran modulos funcionales base para Biblia, Eventos, Discipulado, Mensajes, Seguimiento social, Construir la Red, Buscador global y Notificaciones internas. Los modulos se conectaran a Supabase con RLS y QA especifico. Las funciones de tiempo real, push real, chat avanzado y mapa geografico con coordenadas quedan como evolucion futura.
