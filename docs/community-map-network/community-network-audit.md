# Auditoria de comunidad y red

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Resumen

Red de Jovenes ya funciona como app cristiana/PWA con Auth, RLS, foros, oracion, devocionales, juegos, mapa, reportes y administracion. La experiencia tecnica esta estable, pero la sensacion de red todavia puede crecer: los modulos funcionan, aunque varias interacciones siguen siendo individuales y el mapa funciona mas como directorio que como comunidad.

## Elementos que ya hacen sentir comunidad

- Foros con publicaciones, comentarios, reacciones Amen y reportes.
- Sala de oracion con peticiones, apoyo "Estoy orando", testimonios de respuesta y reportes.
- Mapa con grupos activos, sugerencias y aprobacion admin.
- Perfil editable con ciudad, pais, iglesia, bio, avatar y preferencias.
- Home privado con devocional, progreso personal, ultimas oraciones y foros recientes.
- Admin con moderacion de reportes, devocionales y sugerencias.

## Elementos todavia aislados

- El mapa no permite unirse a comunidades ni ver "Mis comunidades".
- El home no resume comunidades propias ni actividad comunitaria unificada.
- Foros no pueden filtrar por comunidad del usuario.
- Perfil no muestra pertenencia a comunidades ni actividad resumida.
- Oracion no diferencia peticiones relacionadas a comunidades.
- Los mensajes de feedback existen, pero pueden ser mas calidos y consistentes.

## Mejoras viables sin complejidad excesiva

- Agregar membresia simple a comunidades con `group_members`.
- Mostrar conteo real de miembros por comunidad mediante funcion segura.
- Permitir unirse/salir de comunidades activas.
- Mostrar "Mis comunidades" en mapa, perfil y home.
- Agregar filtros comunitarios en foros y oracion cuando el usuario pertenece a grupos.
- Hacer que el home sea un pulso comunitario con datos reales.
- Mejorar toasts/mensajes, badges y estados vacios.

## Tabla de acciones

| Modulo | Estado actual | Mejora propuesta | Prioridad |
| --- | --- | --- | --- |
| Mapa Mundial | Directorio real con sugerencias y aprobacion | Membresia, mis comunidades, conteos reales, mapa visual mas accionable | Alta |
| Inicio `/app` | Accesos y resumen personal | Pulso de comunidad, actividad reciente y comunidad destacada | Alta |
| Foros | Social basico funcional | Autor mas completo, filtros por comunidad y microcopy de participacion | Media |
| Perfil | Datos personales y preferencias | Mis comunidades y resumen de actividad | Media |
| Oracion | Peticiones y apoyos funcionales | Mensajes mas comunitarios y filtro por comunidad si aplica | Media |
| Admin | Moderacion operativa | Mantener aprobacion de sugerencias compatible con membresias | Alta |
| RLS | Auth/RLS OK | Agregar politicas seguras para `group_members` | Alta |

## Criterios de cierre de fase

- Datos comunitarios reales desde Supabase.
- Sin metricas ficticias.
- Seguridad no vuelve al menu visible.
- Reportes y moderacion siguen activos.
- QA completo local y staging OK.
