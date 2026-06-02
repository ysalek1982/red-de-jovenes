# Mejoras por modulo - 2026-06-01

## Dictamen

MEJORAS INCREMENTALES IMPLEMENTADAS SOBRE MODULOS EXISTENTES.

## Alcance

Se trabajo solo sobre modulos ya existentes. No se agregaron modulos nuevos, no se toco Auth/RLS, no se modifico el corpus biblico RVR1909, no se activo Gemini y no se tocaron secretos. El modulo visible "Construir la Red" no fue reintroducido.

## Subagentes usados

Se uso una tanda de subagentes por modulo o grupo de modulo para auditar:

| Subagente | Modulo revisado | Resultado integrado |
| --- | --- | --- |
| Pasteur | Inicio, onboarding, busqueda global y AppShell | Busy state en post rapido, busqueda global sin resultados stale y cierre por ruta/escape/outside click |
| Hooke | Biblia y devocional | Busqueda biblica con alcance "Toda la Biblia / Libro actual"; fecha devocional local; favoritos ordenados |
| Gibbs | Foros | Se preserva comunidad oculta al editar post; deletes validan filas afectadas; cancelar edicion de comentario |
| Laplace | Oracion | Menos datos expuestos en cliente; acciones sin sesion muestran feedback; confirmacion al eliminar; vacios por filtro |
| Popper | Juegos | Memory Match protegido contra timers stale; guardado por sesion de juego; mensajes de guardado con tono correcto |
| Pauli | Comunidad / Mapa | Busqueda sin sensibilidad a acentos; seleccion coherente con filtros; sugerencias aprobadas usan id de sugerencia; confirmacion al salir |
| Confucius | Eventos | RSVP filtra `going`; feedback para usuarios sin sesion; validacion de fecha futura |
| Meitner | Discipulado | Semantica accesible para progreso, tracks y formulario de reflexion |
| Pascal | Mensajes | Consulta defensiva por membresia, mensajes eliminados ocultos, seleccion de conversacion creada, chat con empty state |
| Einstein | Perfil | Aviso de privacidad para datos visibles de perfil |
| Gauss | Admin | Hallazgos documentados; cambios profundos de reporte quedan pendientes para evitar mezclar alcance |
| Chandrasekhar | QA/rutas | Hallazgos documentados sobre docs historicas y QA legacy |

## Cambios aplicados

| Area | Cambio |
| --- | --- |
| Oracion | `getPublicPrayerRequests` ya no trae perfiles de peticiones anonimas ni `user_id` de apoyos; solo conteos y apoyo propio |
| Oracion | Usuarios sin sesion reciben mensaje claro al publicar, orar, reportar o marcar respondida |
| Oracion | Eliminar peticion propia requiere confirmacion y el servicio valida fila afectada |
| Oracion | Estados vacios ahora cambian segun filtro |
| Juegos | Timers de Memory Match se invalidan al cambiar/reiniciar juego |
| Juegos | Guardado de puntaje queda ligado a la sesion de juego actual para evitar respuestas stale |
| Juegos | Mensajes de historial/guardado distinguen exito y error; progreso tiene semantica accesible |
| Foros | Editar un post no elimina su comunidad si la comunidad original no esta disponible en el selector |
| Foros | Delete de post/comentario valida filas afectadas |
| Foros | Comentario en edicion tiene accion Cancelar |
| Mensajes | Conversaciones se cargan desde membresias propias antes de consultar conversaciones |
| Mensajes | Mensajes con `deleted_at` no se muestran |
| Mensajes | Crear conversacion directa selecciona la conversacion creada |
| Mensajes | Chat muestra estado vacio y reporte solo en mensajes ajenos |
| Eventos | Conteo RSVP solo cuenta `status = going` |
| Eventos | RSVP sin sesion muestra feedback; crear evento valida fecha futura |
| Biblia | Busqueda permite elegir entre toda la Biblia y libro actual |
| Devocional | Fecha de hoy usa zona local; favoritos mantienen orden de favoritos |
| Comunidad / Mapa | Busqueda normaliza acentos, detalle respeta filtros y sugerencias aprobadas buscan por `created_from_suggestion_id` |
| Perfil | Se agrego aviso de privacidad sobre datos visibles |
| Discipulado | Progreso y seleccion de tracks tienen semantica accesible; compartir exige reflexion |

## QA local ejecutado

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |

## Pendiente

Ejecutar QA funcional completo contra Supabase cuando el entorno tenga resolucion/red estable:

```powershell
npm run smoke:build
npm run qa:functional
npm run qa:admin
npm run qa:bible-corpus
npm run qa:journeys
npm run qa:community
npm run qa:forums
npm run qa:prayer
npm run qa:games
npm run qa:map
npm run qa:events
npm run qa:discipleship
npm run qa:messages
npm run qa:search
npm run qa:notifications
npm run qa:pilot-feedback
npm run qa:pilot-incidents
npm run qa:mobile-scroll
```

