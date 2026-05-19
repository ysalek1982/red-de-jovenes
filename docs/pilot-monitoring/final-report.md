# Reporte final de monitoreo del piloto

## Dictamen

**LISTO PARA PILOTO CERRADO MONITOREADO.**

Red de Jovenes queda preparada para operar el piloto cerrado con feedback de usuarios, bitacora de incidentes, panel diario de monitoreo y reporte de cierre basado en datos reales.

## URL staging

- https://red-de-jovenes.vercel.app/

## Feedback piloto

Se agrego la tabla `pilot_feedback`, RLS y formulario “Ayudanos a mejorar” accesible desde:

- Menu Mas.
- Perfil.

El admin puede ver feedback nuevo, categoria, modulo, rating, detalle y cambiar estado con nota interna.

## Incidentes

Se agrego la tabla `pilot_incidents`, RLS y bitacora admin para:

- registrar incidente;
- clasificar severidad;
- marcar triage/resuelto/cerrado;
- dejar resolucion.

Usuarios normales no pueden leer ni crear incidentes; deben usar feedback o reportes contextuales.

## Panel diario

El panel Admin “Estado del piloto” ahora muestra:

- usuarios activos hoy;
- nuevos registros;
- perfiles incompletos;
- publicaciones y comentarios;
- oraciones y apoyos;
- juegos;
- mensajes;
- feedback nuevo;
- incidentes abiertos;
- errores IA.

Todos los datos vienen de Supabase. Si no hay actividad, se muestra cero.

## Reporte de cierre

El admin puede generar un Markdown de cierre con:

- rango de fechas;
- participacion;
- uso por modulo;
- comunidad;
- Biblia e IA;
- seguridad/moderacion;
- feedback;
- incidentes;
- recomendacion y decision.

## QA local

Ver `docs/pilot-monitoring/final-local-qa.md`.

Resultado: OK en lint, build, smoke, Auth, RLS, funcional, admin, comunidad, foros, oracion, juegos, mapa, eventos, discipulado, mensajes, social, construir, buscador, notificaciones, Biblia, IA, feedback, incidentes, reporte y journeys.

## QA staging

Ver `docs/pilot-monitoring/final-staging-qa.md`.

Resultado: OK en rutas funcionales, admin, feedback, incidentes, reporte, comunidad y journeys.

## Migraciones aplicadas

- `20260519150000_pilot_feedback.sql`
- `20260519151000_pilot_incidents.sql`

## Pendientes humanos

- Probar PWA en dispositivo real.
- Probar recovery con inbox real.
- Configurar Gemini real si se usara IA durante el piloto.
- Definir responsable diario para revisar feedback e incidentes.

## Recomendacion

Iniciar piloto cerrado monitoreado con grupo pequeno durante 7 a 14 dias. Revisar feedback, incidentes, reportes e IA diariamente. No pasar a beta si hay incidentes criticos abiertos o problemas de privacidad sin resolver.
