# Home como feed social cristiano

## Cambios realizados

- Se agrego "Versiculo del momento" en la parte superior de `/app`.
- Se agrego composer rapido: "Que esta haciendo Dios hoy?" para publicar directo en Foros con la Palabra.
- Se ampliaron accesos reales a Biblia, Eventos, Discipulado y Construir la Red.
- El pulso comunitario ahora puede incluir publicaciones, peticiones, devocional, progreso de juegos, comunidades y eventos reales.
- La card de comunidad destacada sigue leyendo grupos reales desde Supabase.

## Reglas aplicadas

- No se agregaron metricas ficticias.
- Si no hay actividad, se muestra estado vacio pastoral y accionable.
- La publicacion rapida guarda en `posts` usando el cliente normal de Supabase y respeta RLS.

## QA

- Build local: OK durante implementacion.
- Composer: conectado a `createPost`.
- Datos: provenientes de Supabase o estados vacios.
